import LessonPlayer from '@/app/courses/[courseId]/lesson-player';

export default function WatchLessonPage({ params }: any) {
  const userId = localStorage.getItem('userId'); // ensure you set this during login
  const courseId = params.id;
  const lessonId = params.lessonId;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lesson Viewer</h1>

      <LessonPlayer userId={userId!} courseId={courseId} lessonId={lessonId} />
    </div>
  );
}
