'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import Link from 'next/link';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message || error);
      } else {
        setJobs(data);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Job Openings</h1>
      {jobs.length === 0 ? (
        <p>No job postings found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: 30, borderBottom: '1px solid #ccc', paddingBottom: 20 }}>
              <a
                href={`/jobs/${job.slug}`}
                style={{ fontSize: '20px', fontWeight: 'bold', color: 'blue', textDecoration: 'none' }}
              >
                {job.title}
              </a>
              <p style={{ margin: '4px 0' }}>
                <strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}
              </p>
              <p>{job.description?.slice(0, 120)}...</p>
              <Link
                href={`/jobs/${job.slug}`}
                style={{
                  padding: '8px 16px',
                  background: 'black',
                  color: 'white',
                  display: 'inline-block',
                  marginTop: '8px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                View & Apply →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
