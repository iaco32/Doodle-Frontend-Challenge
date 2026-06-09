import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MessageBubble from './MessageBubble';
import type { Message } from '../types/message';

describe('MessageBubble', () => {
  const mockMessage: Message = {
    _id: '1',
    message: 'Hello world!',
    author: 'Alice',
    createdAt: '2026-06-09T12:00:00.000Z',
  };

  it('renders message text and author name', () => {
    render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
    
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('applies left alignment style for other senders', () => {
    const { container } = render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
    
    // Check for container classes corresponding to left alignment (e.g. justify-start)
    expect(container.firstChild).toHaveClass('justify-start');
    
    // Bubble should have dark/neutral background
    const bubble = screen.getByText('Hello world!').closest('div');
    expect(bubble).not.toHaveClass('bg-blue-600');
  });

  it('applies right alignment and blue style for own messages', () => {
    const { container } = render(<MessageBubble message={mockMessage} isOwnMessage={true} />);
    
    // Check for container classes corresponding to right alignment
    expect(container.firstChild).toHaveClass('justify-end');
    
    // Bubble should have blue/accent background
    const bubble = screen.getByText('Hello world!').closest('div');
    expect(bubble).toHaveClass('bg-blue-600');
  });

  it('renders formatted timestamp', () => {
    render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
    
    // The timestamp should be rendered (we'll check for the time part like "12:00" or similar based on locale)
    // To make tests environment independent, let's just make sure some time text is present
    expect(screen.getByText(/12:00/)).toBeInTheDocument();
  });
});
