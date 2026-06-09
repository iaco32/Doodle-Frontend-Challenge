import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageInput from './MessageInput.tsx';

describe('MessageInput', () => {
  it('renders input field and send button', () => {
    render(<MessageInput onSendMessage={async () => {}} />);
    
    expect(screen.getByPlaceholderText(/^Message$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('allows typing in the input field', () => {
    render(<MessageInput onSendMessage={async () => {}} />);
    const input = screen.getByPlaceholderText(/^Message$/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(input.value).toBe('Hello World');
  });

  it('disables the send button when the input is empty or contains only whitespace', () => {
    render(<MessageInput onSendMessage={async () => {}} />);
    const button = screen.getByRole('button', { name: /send/i });
    const input = screen.getByPlaceholderText(/^Message$/i);

    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: '   ' } });
    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(button).not.toBeDisabled();
  });

  it('calls onSendMessage and clears input on successful submission', async () => {
    const handleSendMessage = vi.fn().mockResolvedValue(undefined);
    render(<MessageInput onSendMessage={handleSendMessage} />);
    
    const input = screen.getByPlaceholderText(/^Message$/i) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    expect(handleSendMessage).toHaveBeenCalledWith('Test message');
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('disables input and button while sending', async () => {
    let resolvePromise: (value: void) => void = () => {};
    const delayPromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    
    const handleSendMessage = vi.fn().mockReturnValue(delayPromise);
    render(<MessageInput onSendMessage={handleSendMessage} />);

    const input = screen.getByPlaceholderText(/^Message$/i);
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Speedy message' } });
    fireEvent.click(button);

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    resolvePromise();

    await waitFor(() => {
      expect(input).not.toBeDisabled();
      expect(button).toBeDisabled(); // back to disabled because input gets cleared and is empty
    });
  });
});
