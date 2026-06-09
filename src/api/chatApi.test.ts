import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getMessages, postMessage } from './chatApi';

describe('chatApi', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
    // Set environment variables for testing
    import.meta.env.VITE_API_URL = 'http://localhost:3000';
    import.meta.env.VITE_API_TOKEN = 'test-token';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('getMessages', () => {
    it('should fetch messages with default parameters and auth headers', async () => {
      const mockMessages = [
        { _id: '1', message: 'Hello', author: 'Donato', createdAt: '2026-06-09T12:00:00Z' }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMessages,
      });

      const result = await getMessages();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/messages?limit=50',
        {
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual(mockMessages);
    });

    it('should include "after" and custom "limit" in the query string if provided', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const dateStr = '2026-06-09T11:00:00.000Z';
      await getMessages(dateStr, 20);

      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:3000/api/v1/messages?limit=20&after=${encodeURIComponent(dateStr)}`,
        {
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should throw an error if the response is not ok', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Unauthorized',
      });

      await expect(getMessages()).rejects.toThrow('Failed to fetch messages: Unauthorized');
    });
  });

  describe('postMessage', () => {
    it('should send a POST request with the correct body and auth headers', async () => {
      const mockResponse = { _id: '2', message: 'Hi', author: 'Donato', createdAt: '2026-06-09T12:01:00Z' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await postMessage('Hi', 'Donato');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/messages',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Hi', author: 'Donato' }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the post response is not ok', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(postMessage('', 'Donato')).rejects.toThrow('Failed to post message: Bad Request');
    });
  });
});
