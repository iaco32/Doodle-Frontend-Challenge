import { useEffect, useRef } from 'react';
import type { Message } from '../types/message';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages list changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4">
        <p className="text-center text-sm">No messages yet. Say hello!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwnMessage={msg.author === currentUser}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
