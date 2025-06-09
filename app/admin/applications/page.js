'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import CoverLetterButton from '@/app/components/CoverLetterButton';
import SearchApplications from './SearchApplications';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [gptResults, setGptResults] = useState({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const jobFilter = searchParams.get('job') || '';
  const statusFilter = searchParams.get('status') || '';

  const updateQueryParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/applications?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[ Server ] Error fetching applications:', error);
      } else {
        setApplications(data);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Job', 'Resume URL', 'Date'];
    const rows = sorted.map(app => [
      app.full_name,
      app.email,
      app.job_slug,
      app.resume_url,
      new Date(app.created_at).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'applications.csv';
    link.click();
  };

  const filtered = applications.filter(app =>
    app.full_name.toLowerCase().includes(search.toLowerCase()) ||
    app.email.toLowerCase().includes(search.toLowerCase()) ||
    app.job_slug.toLowerCase().includes(search.toLowerCase())
  ).filter(app =>
    (jobFilter ? app.job_slug === jobFilter : true) &&
    (statusFilter ? app.status === statusFilter : true)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ padding: 40 }}>
      <h1 className="text-2xl font-bold mb-4">Submitted Applications</h1>
      <SearchApplications />

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Filter by name, email, or job"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('full_name')}>
              Name {sortKey === 'full_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Job</th>
            <th className="border px-4 py-2">Resume</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No applications submitted yet.
              </td>
            </tr>
          ) : (
            sorted.map((app) => (
              <tr key={app.id}>
                <td className="border px-4 py-2">{app.full_name}</td>
                <td className="border px-4 py-2">{app.email}</td>
                <td className="border px-4 py-2">{app.job_slug || 'Unknown'}</td>
                <td className="border px-4 py-2 flex flex-col gap-2">
                  <a
                    href={app.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Resume
                  </a>
                  <CoverLetterButton coverLetter={app.cover_letter} />
                  <select
                    value={app.status || ''}
                    onChange={async (e) => {
                      const { error } = await supabase
                        .from('job_applications')
                        .update({ status: e.target.value })
                        .eq('id', app.id);
                      if (!error) app.status = e.target.value;
                    }}
                    className="mt-2 border rounded px-2 py-1"
                  >
                    <option value="">Select Status</option>
                    <option value="New">New</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <textarea
                    className="mt-2 border rounded px-2 py-1"
                    defaultValue={app.notes || ''}
                    placeholder="Add notes here..."
                    onBlur={async (e) => {
                      const { error } = await supabase
                        .from('job_applications')
                        .update({ notes: e.target.value })
                        .eq('id', app.id);
                      if (!error) app.notes = e.target.value;
                    }}
                  />
                </td>
                <td className="border px-4 py-2">
                  {new Date(app.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
