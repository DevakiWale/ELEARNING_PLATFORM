'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import Link from 'next/link';
import { debounce } from 'lodash';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchCategories();
  }, [search, category, sort]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses', {
        params: { search, category, sort },
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await api.get('/enrollments/me');
      const enrolledCourseIds = res.data.map((e: any) => e.course.id);
      setEnrollments(enrolledCourseIds);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleEnroll = async (courseId: string) => {
  try {
    await api.post(`/enrollments/${courseId}`); // ✅ correct endpoint
    setMessage('✅ Enrolled successfully!');
    fetchEnrollments(); // refresh UI
  } catch (err) {
    setMessage('❌ Enrollment failed. Already enrolled?');
    console.error('Enrollment error:', err);
  } finally {
    setTimeout(() => setMessage(''), 3000);
  }
};

  const handleSearchChange = debounce((value: string) => {
    setSearch(value);
  }, 400);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">📚 Available Courses</h1>
      {message && (
        <p
          className={`text-center mb-4 ${
            message.startsWith('✅')
              ? 'text-green-600'
              : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by course or instructor..."
          className="p-2 border rounded w-full sm:w-64"
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded w-full sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded w-full sm:w-48"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {/* 🎓 Course Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: any) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition duration-300 p-4"
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-4">{course.title}</h2>
              <p className="text-gray-600 mt-1">
                By {course.created_by?.name || 'Unknown'}
              </p>
              <p className="text-blue-600 mt-1 font-bold">₹{course.price}</p>

              <Link href={`/courses/${course.id}`}>
                <button className="w-full mt-4 bg-gray-100 text-blue-700 py-2 rounded hover:bg-gray-200 transition">
                  View Details
                </button>
              </Link>

              {enrollments.includes(course.id) ? (
                <button
                  disabled
                  className="w-full mt-2 bg-green-100 text-green-600 py-2 rounded cursor-default"
                >
                  ✅ Already Enrolled
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
