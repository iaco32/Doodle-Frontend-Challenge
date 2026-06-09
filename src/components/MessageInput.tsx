import { useState, type FormEvent, type ChangeEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || isSending) return;

    try {
      setIsSending(true);
      await onSendMessage(trimmedText);
      setText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const isButtonDisabled = !text.trim() || isSending;

  return (
    <form onSubmit={handleSubmit} className="border-t border-doodle-border dark:border-slate-800 bg-doodle-form-bg p-2 md:p-4 shadow-inner">
      <div className="flex space-x-2 md:space-x-3 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          disabled={isSending}
          placeholder="Message"
          className="flex-1 rounded-md border-2 border-doodle-input-border dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-doodle-text dark:text-slate-100 placeholder-doodle-muted dark:placeholder-slate-400 caret-doodle-input-border dark:caret-slate-100 focus:outline-none disabled:opacity-50 transition-colors font-sans text-base"
        />
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="rounded-md bg-doodle-send-button px-6 py-2.5 font-semibold text-white focus:outline-none disabled:opacity-50 transition-colors font-sans text-base cursor-pointer"
        >
          Send
        </button>
      </div>
    </form>
  );
}
