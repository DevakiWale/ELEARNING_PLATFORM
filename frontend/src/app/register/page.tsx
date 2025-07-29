'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password_hash: data.password_hash, // match backend
        role: data.role,
      });

      // ✅ Registration successful, redirect to login
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Join EduVerse</h2>
        {error && <p className="text-red-200 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name')}
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white text-white outline-none"
          />
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white text-white outline-none"
          />
          <input
            {...register('password_hash')}
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white text-white outline-none"
          />
          <select
            {...register('role')}
            required
            className="w-full px-4 py-2 rounded bg-white/20 text-white outline-none"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 bg-white text-indigo-600 font-semibold rounded hover:bg-gray-100 transition"
          >
            Register
          </button>
        </form>
      </div>
    </main>
  );
}
