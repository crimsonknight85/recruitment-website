'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import CoverLetterButton from '@/components/ui/CoverLetterButton';
import SearchApplications from './SearchApplications';

export default function Applications() {
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

  const handleStatusChange = async (id, newStatus) => {
  setApplications((prev) =>
    prev.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    )
  );

  await supabase
    .from('applications')
    .update({ status: newStatus })
    .eq('id', id);
};


  return (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">Applications</h1>
    
    <div className="space-y-6">
      {applications.map((app) => (
        <div
          key={app.id}
          className="border rounded-lg bg-white shadow-sm p-6 flex flex-col md:flex-row justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-gray-800">
              {app.name || 'No Name Provided'}
            </p>
            <p className="text-sm text-gray-600">{app.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Applied on: {new Date(app.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 text-sm">
            <a
              href={app.resume_url}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>

            <CoverLetterButton coverLetter={app.cover_letter} />

            <select
              value={app.status || 'Pending'}
              onChange={(e) => handleStatusChange(app.id, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  </div>
);



}
