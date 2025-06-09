'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import CoverLetterButton from '@/app/components/CoverLetterButton';
import { format } from 'date-fns';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('job_applications').select('*');
      setApplications(data);
    };
    fetchData();
  }, []);

  const filtered = applications.filter(app => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.job_slug.toLowerCase().includes(search.toLowerCase());

    const matchesJob = jobFilter ? app.job_slug === jobFilter : true;
    const matchesStatus = statusFilter ? app.status === statusFilter : true;

    const createdDate = new Date(app.created_at);
    const matchesStart = startDate ? createdDate >= new Date(startDate) : true;
    const matchesEnd = endDate ? createdDate <= new Date(endDate) : true;

    return matchesSearch && matchesJob && matchesStatus && matchesStart && matchesEnd;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Job', 'Resume URL', 'Date'];
    const rows = filtered.map(app => [
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

  const uniqueJobs = [...new Set(applications.map(app => app.job_slug))];

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-2xl font-bold mb-4">Submitted Applications</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search name, email, or job"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={jobFilter}
          onChange={e => setJobFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Jobs</option>
          {uniqueJobs.map(job => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border px-2 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border px-2 py-2 rounded"
        />
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Export CSV
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Job</th>
            <th className="border px-4 py-2">Resume</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(app => (
            <tr key={app.id}>
              <td className="border px-4 py-2">{app.full_name}</td>
              <td className="border px-4 py-2">{app.email}</td>
              <td className="border px-4 py-2">{app.job_slug}</td>
              <td className="border px-4 py-2">
                <a
                  href={app.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
                <CoverLetterButton coverLetter={app.cover_letter} />
              </td>
              <td className="border px-4 py-2">
                {format(new Date(app.created_at), 'Pp')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
