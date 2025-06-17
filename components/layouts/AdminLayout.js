'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Applications', href: '/admin/applications' },
    { label: 'Job Postings', href: '/admin/jobs' },
    { label: 'Interviews', href: '/admin/interviews' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <aside className="w-60 bg-white border-r px-6 py-10 shadow-sm">
        <nav className="flex flex-col gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded transition ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
