'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { setToken } from '@/utils/auth';
import { useEffect, useState } from 'react';

export default function Login() {
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
      const res = await api.post('/auth/login', data);

      // Save JWT
      setToken(res.data.access_token);

      // Save role, email, id
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userEmail', res.data.user.email);
      localStorage.setItem('userId', res.data.user.id);

      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'admin') router.push('/admin/dashboard');
      else if (role === 'instructor') router.push('/instructor/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to EduVerse</h2>
        {error && <p className="text-red-200 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white text-white outline-none"
          />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded bg-white/20 placeholder-white text-white outline-none"
          />
          <button className="w-full py-2 bg-white text-indigo-600 font-semibold rounded hover:bg-gray-100 transition">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
