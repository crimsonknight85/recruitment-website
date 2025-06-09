'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function JobDetailPage() {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching job:', error.message);
      }

      setJob(data);
      setLoading(false);
    };

    fetchJob();
  }, [slug]);

  if (loading) return <p style={{ padding: 20 }}>Loading job...</p>;
  if (!job) return <p style={{ padding: 20 }}>Job not found</p>;

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{job.title}</h1>
      <p style={{ color: 'gray', fontSize: '14px' }}>
        Posted on {new Date(job.created_at).toLocaleDateString()}
      </p>
      <p style={{ marginTop: '20px' }}>{job.description}</p>

      {/* 🔜 Next: Application form will go here */}
      <p style={{ marginTop: '40px', fontStyle: 'italic' }}>
        Application form coming next...
      </p>
    </main>
  );
}
