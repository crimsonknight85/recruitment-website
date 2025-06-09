'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

// 👇 Paste this in same file or import it
function ApplicationForm({ job }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resumeFile) {
      setError('Please upload a resume.');
      return;
    }

    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('upload_preset', 'resume_unsigned');
    formData.append('cloud_name', 'da0y3ha2x');

    const uploadRes = await fetch('https://api.cloudinary.com/v1_1/da0y3ha2x/upload', {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    const resumeUrl = uploadData.secure_url;

    const { error } = await supabase.from('job_applications').insert([
      {
        job_slug: job.slug,
        full_name: fullName,
        email,
        resume_url: resumeUrl,
        cover_letter: coverLetter,
      },
    ]);

    if (error) {
      console.error('Submission error:', error);
      setError('Something went wrong. Try again.');
    } else {
      setSuccess('Application submitted!');
      setFullName('');
      setEmail('');
      setResumeFile(null);
      setCoverLetter('');
    }
  };

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Apply for this Job</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setResumeFile(e.target.files[0])}
          required
        />
        <textarea
          placeholder="Cover Letter (optional)"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={4}
        />
        <button type="submit" style={{ padding: '10px', background: 'black', color: 'white' }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}

// 🔍 Main Page Component
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
        .limit(1)
        .maybeSingle();

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
      <p style={{ color: 'gray' }}>
        Posted on {new Date(job.created_at).toLocaleDateString()}
      </p>
      <p style={{ marginTop: '20px' }}>{job.description}</p>

      {/* ✅ Application Form */}
      <ApplicationForm job={job} />
    </main>
  );
}
