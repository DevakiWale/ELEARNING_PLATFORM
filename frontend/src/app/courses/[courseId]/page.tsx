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
  const [loadingCertificate, setLoadingCertificate] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    // Fetch course data
    api.get(`/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error('❌ Course fetch error:', err));

    // Check if certificate exists
    setLoadingCertificate(true);
    api.get(`/certificates/${courseId}`)
      .then(() => {
        setCertificateAvailable(true);
        setLoadingCertificate(false);
      })
      .catch(() => {
        setCertificateAvailable(false);
        setLoadingCertificate(false);
      });
  }, [courseId]);

  if (!course) return <p className="text-center mt-20">Loading course...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img 
        src={course.thumbnail_url} 
        className="w-full h-64 object-cover rounded mb-6" 
        alt="Course Thumbnail" 
      />
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

      {/* Certificate Section - Fixed rendering logic */}
      <div className="mt-10">
        {loadingCertificate ? (
          <p className="text-center">Checking certificate availability...</p>
        ) : certificateAvailable ? (
          <CertificateViewer />
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Complete all course requirements to unlock your certificate.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <ReviewSection />
      </div>
    </div>
  );
}