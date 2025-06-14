'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase/client';

export default function PostJobPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [success, setSuccess] = useState(false);

  const generateSlug = (text) =>
    text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const slug = generateSlug(title);

    const { error } = await supabase.from('jobs').insert([
      { title, slug, description, location }
    ]);

    if (error) {
      console.error('Error posting job:', error);
      alert('Something went wrong.');
    } else {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setLocation('');
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

      {success && (
        <div className="mb-4 text-green-600 font-semibold">✅ Job posted successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block mb-1 font-medium">Job Title</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border px-4 py-2 rounded"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="bg-black text-white px-6 py-2 rounded">
          Post Job
        </button>
      </form>
    </div>
  );
}
