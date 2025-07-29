'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust if deployed

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams() as { courseId: string; lessonId: string };
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/lessons`);
        const selected = res.data.find((l: any) => l.id === lessonId);
        setLesson(selected || null);
      } catch (err) {
        console.error('Error fetching lesson:', err);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    if (!lesson) return;

    let watched = 0;
    const interval = setInterval(() => {
      watched += 10;
      if (watched <= 100) {
        socket.emit('progress', {
          courseId,
          lessonId,
          percent: watched,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [lesson]);

  if (!lesson) return <p className="text-center mt-20">📦 Loading lesson...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

      {/* ✅ Video Player */}
      <div className="mb-6">
        <video controls className="w-full rounded max-h-[500px]">
          <source src={lesson.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <p className="text-gray-600">⏱ Duration: {lesson.duration} minutes</p>
    </div>
  );
}
