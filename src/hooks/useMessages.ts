import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '../types/message';
import { getMessages, postMessage } from '../api/chatApi.ts';

const DEFAULT_POLLING_INTERVAL = 3000;

export function useMessages(authorName: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ref to avoid stale closure in the polling callback
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const fetchMessages = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsLoading(true);
      }
      const data = await getMessages();
      const sorted = [...data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setMessages(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching messages');
    } finally {
      if (isInitial) {
        setIsLoading(false);
      }
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    try {
      const newMsg = await postMessage(text, authorName);
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending the message');
      throw err;
    }
  }, [authorName]);

  // kick off initial load and start polling
  useEffect(() => {
    fetchMessages(true);

    const pollingIntervalMs = Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || DEFAULT_POLLING_INTERVAL;
    
    const interval = setInterval(() => {
      fetchMessages(false);
    }, pollingIntervalMs);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refetch: () => fetchMessages(false),
  };
}
