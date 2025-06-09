// app/admin/applications/page.js
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const { data: applications, error } = await supabaseAdmin
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ Server ] Error fetching applications:', error);
    return <p>Error loading applications.</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Submitted Applications</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Job</th>
            <th className="p-2 border">Resume</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No applications submitted yet.
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id}>
                <td className="p-2 border">{app.full_name}</td>
                <td className="p-2 border">{app.email}</td>
                <td className="p-2 border">{app.job_slug}</td>
                <td className="p-2 border">
                  <a
                    href={app.resume_url}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </td>
                <td className="p-2 border">
                  {new Date(app.created_at).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
