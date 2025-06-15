// trigger redeploy

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ESL Hiring",
  description: "A modern hiring platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Apple-style nav */}
        <nav className="w-full bg-[#f9f9f9] border-b">
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center text-sm">
            <a href="/" className="font-semibold hover:opacity-70 transition">ESL Hiring</a>
            <div className="flex gap-6">
              <a href="/jobs" className="hover:underline">Browse Jobs</a>
              <a href="/admin/post-job" className="hover:underline">Post a Job</a>
            </div>
          </div>
        </nav>

        {/* ✅ Shared page layout */}
        <main className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
