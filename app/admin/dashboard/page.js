'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/applications"
          className="block bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-1">View Applications</h2>
          <p className="text-gray-600 text-sm">Manage and filter job applications</p>
        </Link>

        <Link
          href="/admin/jobs"
          className="block bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-1">Job Postings</h2>
          <p className="text-gray-600 text-sm">Create, edit, and manage job listings</p>
        </Link>

        <Link
          href="/admin/interviews"
          className="block bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-1">Interview Schedule</h2>
          <p className="text-gray-600 text-sm">(Coming soon) View and schedule interviews</p>
        </Link>

        <Link
          href="/admin/settings"
          className="block bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-1">Settings</h2>
          <p className="text-gray-600 text-sm">(Coming soon) Customize platform settings</p>
        </Link>
      </div>
    </>
  );
}
