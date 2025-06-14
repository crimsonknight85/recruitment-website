export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center">
      <h1 className="text-5xl md:text-6xl font-semibold mb-4">
        Find Talent. Get Hired.
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">
        Your modern hiring platform — fast, simple, powerful.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a
          href="/jobs"
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition text-center"
        >
          Browse Jobs
        </a>
        <a
          href="/admin/post-job"
          className="border border-black text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-black hover:text-white transition text-center"
        >
          Post a Job
        </a>
      </div>
    </div>
  );
}
