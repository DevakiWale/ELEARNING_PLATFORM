'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // backend server

export default function ChatBox({ courseId, user }: { courseId: string; user: string }) {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', { courseId });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [courseId]);

  const sendMessage = () => {
    if (text.trim()) {
      const message = { user, text, courseId };
      socket.emit('sendMessage', message);
      setMessages((prev) => [...prev, message]);
      setText('');
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-xl font-semibold mb-2">💬 Live Chat</h3>
      <div className="max-h-40 overflow-y-auto bg-gray-100 p-3 rounded mb-3">
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.user}:</strong> {msg.text}</p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">Send</button>
      </div>
    </div>
  );
}
