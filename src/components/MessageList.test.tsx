import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MessageList from './MessageList';
import type { Message } from '../types/message';

describe('MessageList', () => {
  const mockMessages: Message[] = [
    { _id: '1', message: 'Hello', author: 'Alice', createdAt: '2026-06-09T12:00:00.000Z' },
    { _id: '2', message: 'Hi there', author: 'Donato', createdAt: '2026-06-09T12:01:00.000Z' },
  ];

  beforeEach(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders a list of message bubbles', () => {
    render(<MessageList messages={mockMessages} currentUser="Donato" />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.getByText('Donato')).toBeInTheDocument();
  });

  it('renders empty state message when no messages are provided', () => {
    render(<MessageList messages={[]} currentUser="Donato" />);
    
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
  });

  it('scrolls to the bottom on render', () => {
    const scrollMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollMock;

    render(<MessageList messages={mockMessages} currentUser="Donato" />);
    
    expect(scrollMock).toHaveBeenCalled();
  });
});
