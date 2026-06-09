import type { Message } from '../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  // Simple time formatter to extract hours and minutes from the ISO date string
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Format as HH:MM
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="flex flex-col max-w-[70%]">
        {/* Author Name */}
        <span className={`text-xs text-slate-400 mb-1 px-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {message.author}
        </span>
        
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 text-sm shadow-md ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-tr-none'
              : 'bg-slate-800 text-slate-100 rounded-tl-none'
          }`}
        >
          <p className="break-words whitespace-pre-wrap">{message.message}</p>
          
          {/* Timestamp */}
          <span className="block text-[10px] text-right mt-1 opacity-70">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
