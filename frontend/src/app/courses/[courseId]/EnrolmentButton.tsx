'use client';

import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function EnrollButton({ courseId }: { courseId: string }) {
  const handleEnroll = async () => {
    try {
      // Retrieve token from localStorage, cookies, or context as appropriate
      const token = localStorage.getItem('token');
      await api.post(`/enrollments/${courseId}`
        , {}, {
  headers: {
    Authorization: `Bearer ${token}`, // or via cookies
  },
}
      ); // your backend should trigger email internally
      toast.success('✅ Enrollment Successful! Check your email for confirmation.');
    } catch (err) {
      console.error(err);
      toast.error('❌ Enrollment failed. Try again.');
    }
  };

  return (
    <button
      onClick={handleEnroll}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Enroll Now
    </button>
  );
}
