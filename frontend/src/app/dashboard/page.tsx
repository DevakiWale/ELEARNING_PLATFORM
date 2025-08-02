'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchEnrollments();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setProfile(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch profile:', err);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/enrollments/me');
      setEnrollments(res.data);
    } catch (err: any) {
      console.error('❌ Error fetching enrollments:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        router.push('/login');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📘 My Learning Dashboard</h1>

      {profile ? (
        <div className="bg-white p-4 rounded shadow mb-6">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading profile...</p>
      )}

      {enrollments.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>You’re not enrolled in any courses yet.</p>
          <Link href="/courses">
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              ➕ Browse Courses
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-1 gap-6">
          {enrollments.map((enroll) => (
            <div 
              key={enroll.id}
              className="border rounded p-4 bg-white shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <img
                    src={enroll.course?.thumbnail_url || '/default-thumbnail.jpg'}
                    alt={enroll.course?.title || 'Course Image'}
                    className="h-40 w-full object-cover rounded mb-3"
                  />
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-xl font-semibold">{enroll.course?.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{enroll.course?.description}</p>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded h-4 mb-2">
                    <div
                      className="bg-green-500 h-4 rounded transition-all duration-300"
                      style={{ width: `${enroll.progress || 0}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">Progress: {enroll.progress || 0}%</p>

                  {/* Lessons List (styled like second example) */}
                  <div className="space-y-2 mb-4">
                    {Array.isArray(enroll.course?.lessons) && enroll.course.lessons.length > 0 ? (
                      enroll.course.lessons.map((lesson: any) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${enroll.course.id}/lessons/${lesson.id}`}
                          className="block text-blue-600 hover:underline"
                        >
                          ▶️ {lesson.title}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-red-500">No lessons added yet.</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => router.push(`/courses/${enroll.course.id}`)}
                    >
                      View Course
                    </button>

                    {enroll.progress === 100 && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        🎉 Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
