'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';
import ReviewSection from './review';
import CertificateViewer from './certificate';

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  

  useEffect(() => {
    if (!courseId) return;

    
    api.get(`/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error('❌ Course fetch error:', err));

    api.get(`/certificates/${courseId}`)
      .then(() => setCertificateAvailable(true))
      .catch(() => setCertificateAvailable(false)); // not issued yet
  }, [courseId]);

  if (!course) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img src={course.thumbnail_url} className="w-full h-64 object-cover rounded mb-6" alt="Course Thumbnail" />
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-2">By {course.created_by?.name}</p>
      <p className="text-blue-600 text-xl font-bold mb-4">${course.price}</p>
      <p className="text-gray-700 leading-relaxed">{course.description}</p>

     
      {course.syllabus && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">📋 Syllabus (Markdown Preview)</h3>
          <div className="prose prose-blue max-w-none bg-gray-50 p-4 rounded shadow">
            <ReactMarkdown>{course.syllabus}</ReactMarkdown>
          </div>
        </div>
      )}

      
      {certificateAvailable && (
        <div className="mt-10">
          <CertificateViewer />
        </div>
      )}

      <div className="mt-10">
        <ReviewSection />
      </div>
    </div>
  );
}
