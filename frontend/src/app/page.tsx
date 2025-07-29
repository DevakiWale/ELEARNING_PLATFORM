'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold drop-shadow-md">Welcome to EduVerse</h1>
        <p className="text-lg max-w-xl mx-auto">
          An immersive E-Learning platform for students and instructors with real-time features and beautiful UI.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-200"
          >
            Register
          </button>
        </div>
      </div>
    </main>
  );
}
