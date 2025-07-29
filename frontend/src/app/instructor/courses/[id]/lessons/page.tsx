'use client';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function LessonsPage() {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [mounted, setMounted] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && courseId) fetchLessons();
  }, [mounted, courseId]);

  const fetchLessons = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      setLessons(res.data);
    } catch (err) {
      console.error('Failed to load lessons:', err.response?.data || err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVideoUrl(res.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('❌ Upload failed');
    }
  };

  const onSubmit = async (data: any) => {
    if (!videoUrl) return alert('Please upload a video or paste a URL.');

    try {
      const payload = {
        ...data,
        duration: parseInt(data.duration),
        video_url: videoUrl,
      };

      await api.post(`/courses/${courseId}/lessons`, payload);
      alert('✅ Lesson added successfully');
      reset();
      setVideoUrl('');
      fetchLessons();
    } catch (err) {
      console.error('Error submitting lesson:', err.response?.data || err.message);
      alert('❌ Failed to add lesson');
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Manage Lessons</h1>

      {/* ✅ Lesson Upload Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow mb-8">
        <input {...register('title')} placeholder="Lesson Title" className="w-full p-2 border rounded" required />
        <input {...register('duration')} type="number" placeholder="Duration (minutes)" className="w-full p-2 border rounded" required />

        {/* ✅ Paste Cloudinary URL */}
        <input
          type="text"
          placeholder="Paste Cloudinary Video URL (optional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />

       

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
          ➕ Add Lesson
        </button>
      </form>

      {/* ✅ Lesson List */}
      <h2 className="text-xl font-semibold mb-3">🎥 Lesson List</h2>
      {lessons.length === 0 ? (
        <p className="text-gray-500">No lessons added yet.</p>
      ) : (
        <ul className="space-y-4">
          {lessons.map((lesson: any) => (
            <li key={lesson.id} className="bg-gray-100 p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{lesson.title}</h3>
              <p className="text-sm text-gray-600">Duration: {lesson.duration} mins</p>
              <a
                href={`/courses/${courseId}/lessons/${lesson.id}`}
                className="text-blue-600 underline"
              >
                ▶ Go to Lesson
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
