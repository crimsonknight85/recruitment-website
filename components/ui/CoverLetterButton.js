'use client';

export default function CoverLetterButton({ coverLetter }) {
  return (
    <button
      onClick={() => alert(coverLetter)}
      className="text-blue-600 underline hover:text-blue-800"
    >
      View Cover Letter
    </button>
  );
}
