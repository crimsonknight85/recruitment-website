'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PostJobPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('jobs').insert([
      { title, slug, description },
    ]);

    if (error) {
      console.error('Error posting job:', error.message || error.details || error);
    } else {
      setSuccessMessage('✅ Job posted successfully!');
      setTitle('');
      setSlug('');
      setDescription('');
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
      {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-2 w-full rounded"
          required
        />
        <input
          type="text"
          placeholder="Slug (e.g. frontend-developer)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border px-4 py-2 w-full rounded"
          required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-4 py-2 w-full rounded h-40"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
