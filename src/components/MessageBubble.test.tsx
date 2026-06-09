import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MessageBubble from './MessageBubble.tsx';
import type { Message } from '../types/message';

describe('MessageBubble', () => {
  const mockMessage: Message = {
    _id: '1',
    message: 'Hello world!',
    author: 'Alice',
    createdAt: '2026-06-09T12:00:00.000Z',
  };

  it('renders message text and author name for other users', () => {
    render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
    
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('does not render author name for own messages', () => {
    render(<MessageBubble message={mockMessage} isOwnMessage={true} />);
    
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('applies correct alignments and styling for other senders', () => {
    const { container } = render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
    
    expect(container.firstChild).toHaveClass('justify-start');
    
    const bubble = screen.getByText('Hello world!').closest('div');
    expect(bubble).toHaveClass('bg-doodle-bubble-other');
    expect(bubble).not.toHaveClass('bg-doodle-bubble-own');
  });

  it('applies correct alignments and styling for own messages', () => {
    const { container } = render(<MessageBubble message={mockMessage} isOwnMessage={true} />);
    
    expect(container.firstChild).toHaveClass('justify-end');
    
    const bubble = screen.getByText('Hello world!').closest('div');
    expect(bubble).toHaveClass('bg-doodle-bubble-own');
    expect(bubble).not.toHaveClass('bg-doodle-bubble-other');
  });

  it('renders formatted timestamp matching spec', () => {
    render(<MessageBubble message={mockMessage} isOwnMessage={false} />);
    
    // 2026-06-09T12:00:00.000Z will be parsed in local timezone.
    // Let's assert that the formatted text contains "Jun 2026" and the time component.
    expect(screen.getByText(/Jun 2026/)).toBeInTheDocument();
  });
});
