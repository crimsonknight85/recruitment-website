'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';


export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (error) {
        alert('Error loading job: ' + error.message);
      } else {
        setTitle(data?.title ?? '');
        setLocation(data?.location ?? '');
        setDescription(data?.description ?? '');
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('jobs')
      .update({ title, location, description })
      .eq('id', id);

    setLoading(false);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      router.push('/admin/jobs');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Job Post</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
          className="border px-4 py-2 rounded"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Updating...' : 'Update Job'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/jobs')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
