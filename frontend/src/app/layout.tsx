import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'E-Learning Platform',
  description: 'Your personalized online learning experience',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-800">
        <header className="w-full bg-white shadow p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">E-Learn</h1>
            <nav className="space-x-4">
              <a href="/" className="text-blue-600 hover:underline">Home</a>
              <a href="/login" className="text-blue-600 hover:underline">Login</a>
              <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-10">
          {children}
          <Toaster position="top-right" />
        </main>
      </body>
    </html>
  );
}
