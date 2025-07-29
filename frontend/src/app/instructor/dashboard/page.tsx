'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('userEmail');

    if (role !== 'instructor') {
      router.push('/unauthorized');
    } else {
      fetchCourses(email);
    }
  }, []);

  const fetchCourses = async (email: string | null) => {
    try {
      const res = await api.get('/courses');
      const filtered = res.data.filter((c: any) => c.created_by?.email === email);
      setCourses(filtered);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">👩‍🏫 Your Uploaded Courses</h1>

      <div className="text-right mb-6">
        <Link href="/instructor/upload-course">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Upload New Course
          </button>
        </Link>
      </div>

      {!Array.isArray(courses) || courses.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          You haven’t uploaded any courses yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course: any) => (
            <div key={course.id} className="border rounded p-4 bg-white shadow hover:shadow-md transition">
              <img
                src={course.thumbnail_url || '/default-thumbnail.jpg'}
                alt={course.title}
                className="h-40 w-full object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span
                  className={`font-bold ${course.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {course.status || 'pending'}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Price: ${course.price}</p>

              <Link href={`/instructor/courses/${course.id}/lessons`}>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Manage Lessons
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
