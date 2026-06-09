import type { Message } from '../types/message';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  // Format as "10 Mar 2018 10:19"
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const day = date.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-md border p-4 max-w-[240px] md:max-w-[420px] text-left shadow-sm ${
          isOwnMessage 
            ? 'bg-doodle-bubble-own border-doodle-border' 
            : 'bg-doodle-bubble-other border-doodle-border dark:bg-slate-800 dark:border-slate-700'
        }`}
      >
        {/* Author Name - only show for other senders */}
        {!isOwnMessage && (
          <div className="text-xs font-semibold text-doodle-muted dark:text-slate-400 mb-1">
            {message.author}
          </div>
        )}
        
        {/* Message Text */}
        <p className="text-base text-doodle-text dark:text-slate-100 break-words whitespace-pre-wrap leading-normal font-sans">
          {message.message}
        </p>
        
        {/* Timestamp */}
        <span className={`block text-xs text-doodle-muted dark:text-slate-400 mt-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
