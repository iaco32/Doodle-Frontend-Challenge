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
    <form onSubmit={handleSubmit} className="border-t border-[#d4dade] bg-[#3996d2] p-2 md:p-4 shadow-inner">
      <div className="flex space-x-2 md:space-x-3 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          disabled={isSending}
          placeholder="Message"
          className="flex-1 rounded-md border-2 border-[#2f76a2] caret-[#2f76a2] bg-white px-4 py-2.5 text-[#434b54] placeholder-[#b3bcc3] focus:outline-none disabled:opacity-50 transition-colors font-sans text-base"
        />
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="rounded-md bg-[#ff7e67] px-6 py-2.5 font-semibold text-white hover:bg-[#ff6f54] active:bg-[#e5644c] focus:outline-none disabled:opacity-50 transition-colors font-sans text-base"
        >
          Send
        </button>
      </div>
    </form>
  );
}
