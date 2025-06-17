'use client';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 border-r p-6">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="flex flex-col space-y-3">
          <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
          <Link href="/admin/applications" className="text-blue-600 hover:underline">Applications</Link>
          <Link href="/admin/jobs" className="text-blue-600 hover:underline">Job Postings</Link>
          <Link href="/admin/interviews" className="text-blue-600 hover:underline">Interviews</Link>
          <Link href="/admin/settings" className="text-blue-600 hover:underline">Settings</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
