'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      alert('Access denied. Only admins can access this page.');
      router.push('/');
      return;
    }

    api.get('/courses/pending')
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/courses/${id}/${action}`);
      alert(`Course ${action}d successfully!`);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Action failed.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛡️ Admin – Pending Course Approvals</h1>
      {courses.length === 0 ? (
        <p className="text-center">No pending courses 🎉</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course: any) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg p-4">
              <img src={course.thumbnail_url} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-bold mt-3">{course.title}</h2>
              <p className="text-gray-600 mt-1">{course.description.slice(0, 60)}...</p>
              <p className="text-sm mt-1">By: <span className="font-semibold">{course.created_by?.name}</span></p>
              <p className="font-bold text-blue-600 mt-1">${course.price}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleAction(course.id, 'approve')}
                  className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleAction(course.id, 'reject')}
                  className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
