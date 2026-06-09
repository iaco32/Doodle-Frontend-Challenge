import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMessages } from './useMessages.ts';
import * as chatApi from '../api/chatApi.ts';
import type { Message } from '../types/message';

vi.mock('../api/chatApi.ts', () => ({
  getMessages: vi.fn(),
  postMessage: vi.fn(),
}));

describe('useMessages hook', () => {
  const mockMessages: Message[] = [
    { _id: '1', message: 'Hello', author: 'Alice', createdAt: '2026-06-09T12:00:00.000Z' },
    { _id: '2', message: 'Hi', author: 'Bob', createdAt: '2026-06-09T12:01:00.000Z' },
  ];

  it('should fetch messages on mount and manage loading state', async () => {
    vi.mocked(chatApi.getMessages).mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useMessages('Donato'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toEqual(mockMessages);
  });

  it('should fetch new messages via polling interval', async () => {
    vi.useFakeTimers();
    vi.mocked(chatApi.getMessages).mockResolvedValue(mockMessages);

    const { result } = renderHook(() => useMessages('Donato'));

    // Resolve the initial fetch mount hook calls using runOnlyPendingTimersAsync
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(result.current.messages).toEqual(mockMessages);
    vi.mocked(chatApi.getMessages).mockClear();

    // Advance time by 3 seconds to trigger polling
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(chatApi.getMessages).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should send a message and add it to the state', async () => {
    const newMessage: Message = {
      _id: '3',
      message: 'New message',
      author: 'Donato',
      createdAt: '2026-06-09T12:02:00.000Z',
    };

    vi.mocked(chatApi.getMessages).mockResolvedValue(mockMessages);
    vi.mocked(chatApi.postMessage).mockResolvedValue(newMessage);

    const { result } = renderHook(() => useMessages('Donato'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.sendMessage('New message');
    });

    expect(chatApi.postMessage).toHaveBeenCalledWith('New message', 'Donato');
    expect(result.current.messages).toContainEqual(newMessage);
  });

  it('should handle API errors during initial fetch', async () => {
    const errorMessage = 'Network error';
    vi.mocked(chatApi.getMessages).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useMessages('Donato'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
  });
});
