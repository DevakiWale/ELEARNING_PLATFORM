'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/utils/api';
import { useParams } from 'next/navigation';

export default function CertificateViewer() {
  const { courseId } = useParams() as { courseId: string };
  const [certificate, setCertificate] = useState<any>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (courseId) fetchCertificate();
  }, [courseId]);

  const fetchCertificate = async () => {
    try {
      const res = await api.get(`/certificates/${courseId}`);
      setCertificate(res.data);
    } catch (err) {
      console.warn('No certificate found yet.', err);
    }
  };

  const downloadServerGeneratedPdf = async () => {
    try {
      const res = await api.get(`/certificates/${courseId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download certificate:', err);
    }
  };

  if (!certificate) return null;

  return (
    <div className="mt-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        🎉 Certificate Awarded
      </h2>

      <div
        ref={pdfRef}
        className="bg-white p-8 rounded border border-gray-300 text-center shadow-lg"
      >
        <h3 className="text-4xl font-semibold text-blue-600 mb-2">
          Certificate of Completion
        </h3>
        <p className="text-lg text-gray-700 mb-2">This certifies that</p>
        <p className="text-2xl font-bold text-gray-800">{certificate.user?.name}</p>
        <p className="mt-2 text-gray-700">has successfully completed the course</p>
        <p className="text-xl font-semibold text-gray-900 mt-1">
          “{certificate.course?.title}”
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Issued on:{' '}
          {certificate.createdAt
            ? new Date(certificate.createdAt).toLocaleDateString()
            : 'N/A'}
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={downloadServerGeneratedPdf}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          📄 Download Certificate PDF
        </button>
      </div>
    </div>
  );
}
