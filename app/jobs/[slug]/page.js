'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client'; // ✅
import ApplyForm from './ApplyForm';

export default function JobDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .ilike('slug', slug)
        .single();

      if (error) {
        console.error('Error loading job:', error.message);
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    if (slug) fetchJob();
  }, [slug]);

  if (loading) return <div className="p-8 text-gray-500">Loading job...</div>;
  if (!job) return <div className="p-8 text-red-500">Job not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Back to Jobs */}
      <button
        onClick={() => router.push('/jobs')}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </button>

      {/* Job Title and Date */}
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-500 mb-6">
        Posted on {new Date(job.created_at).toLocaleDateString()}
      </p>

      {/* Description */}
      <div
        className="prose prose-sm sm:prose max-w-none mb-10"
        dangerouslySetInnerHTML={{
          __html: (job.description || 'No job description provided.').replace(/\n/g, '<br />'),
        }}
      ></div>

      {/* Application Form */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
        <ApplyForm jobSlug={slug} />
      </div>
    </div>
  );
}
