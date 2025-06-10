'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminJobsPage() {
  // 🔐 Secure with ENV variable
  if (process.env.NEXT_PUBLIC_ALLOW_ADMIN !== 'true') {
    return <div className="p-10 text-center text-red-600 font-bold">Not authorized</div>;
  }

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Job Posts</h1>

      <Link
        href="/admin/jobs/new"
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block hover:bg-green-700"
      >
        + Post New Job
      </Link>

      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : (
        <table className="w-full text-sm shadow-sm rounded overflow-hidden mt-4 border-collapse border border-gray-300">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{job.title}</td>
                <td className="px-4 py-3">{job.location}</td>
                <td className="px-4 py-3 flex gap-3">
                  <Link href={`/admin/jobs/edit/${job.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      const confirmDelete = confirm('Are you sure you want to delete this job?');
                      if (!confirmDelete) return;
                      const { error } = await supabase.from('jobs').delete().eq('id', job.id);
                      if (error) {
                        alert('Error deleting job: ' + error.message);
                      } else {
                        setJobs((prev) => prev.filter((j) => j.id !== job.id));
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
