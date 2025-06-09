'use client';

import { useState } from 'react';
import { uploadResumeToCloudinary } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabaseClient';

export default function ApplyForm({ jobSlug }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const resumeFile = formData.get('resume');
    let resumeUrl = '';

    // Upload resume to Cloudinary
    if (resumeFile && resumeFile.size > 0) {
      try {
        resumeUrl = await uploadResumeToCloudinary(resumeFile);
      } catch (err) {
        alert('Failed to upload resume. Please try again.');
        console.error(err);
        setLoading(false);
        return;
      }
    }

    // Build and log payload
    const payload = {
      job_slug: jobSlug,
      full_name: formData.get('name'),
      email: formData.get('email'),
      cover_letter: formData.get('coverLetter'),
      resume_url: resumeUrl,
      created_at: new Date().toISOString(),
    };

    console.log('Submitting payload to Supabase:', payload);

    try {
      const { error } = await supabase.from('job_applications').insert([payload]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      alert('There was a problem submitting your application.');
      console.error('Supabase Insert Error:', err.message || err);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mt-8">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        className="border px-4 py-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="border px-4 py-2 rounded"
      />
      <textarea
        name="coverLetter"
        placeholder="Cover Letter"
        rows="4"
        required
        className="border px-4 py-2 rounded"
      />
      <input
        type="file"
        name="resume"
        accept=".pdf,.doc,.docx"
        className="border px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>

      {submitted && (
        <p className="text-green-600 mt-2">
          ✅ Application submitted successfully!
        </p>
      )}
    </form>
  );
}
