'use client';

import { useForm } from 'react-hook-form';
import api from '@/utils/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadCourse() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err.response?.data || err.message);
    }
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      syllabus_text: data.syllabus_text || '', // ✅ include syllabus_text
    };

    try {
      await api.post('/courses', payload);
      alert('✅ Course submitted successfully!');
      reset();
      router.push('/instructor/dashboard');
    } catch (err: any) {
      console.error('❌ Error uploading course:', err.response?.data || err.message);
      alert('❌ Failed to upload course');
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">🎓 Upload New Course</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('title')}
          placeholder="Course Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          {...register('description')}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          {...register('syllabus')}
          placeholder="Course syllabus (optional)"
          className="w-full p-2 border rounded min-h-[120px]"
          rows={6}
        />
        <input
          {...register('thumbnail_url')}
          placeholder="Thumbnail URL"
          className="w-full p-2 border rounded"
          required
        />
        <input
          {...register('price')}
          placeholder="Price"
          type="number"
          step="0.01"
          className="w-full p-2 border rounded"
          required
        />

        <select {...register('categoryId')} className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
