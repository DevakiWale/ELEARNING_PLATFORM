'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import api from '@/utils/api';

export default function ReviewForm() {
  const { courseId } = useParams(); // ✅ Matches [courseId]
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const submitReview = async () => {
    try {
      console.log({ courseId, rating, comment }); // ✅ Debug
      await api.post('/reviews', {
        courseId,
        rating,
        comment,
      });
      setMessage('✅ Review submitted!');
      setComment('');
    } catch (err: any) {
      setMessage('❌ Error submitting review');
      console.error(err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2">⭐ Leave a Review</h3>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <select
        className="mb-2"
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Stars
          </option>
        ))}
      </select>
      <button
        onClick={submitReview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
