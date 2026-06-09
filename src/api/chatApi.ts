import type { Message } from '../types/message';

const getApiConfig = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = import.meta.env.VITE_API_TOKEN || '';
  return { baseUrl, token };
};

export async function getMessages(after?: string, limit: number = 50): Promise<Message[]> {
  const { baseUrl, token } = getApiConfig();
  
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());
  if (after) {
    queryParams.append('after', after);
  }

  const response = await fetch(`${baseUrl}/api/v1/messages?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.statusText || response.status}`);
  }

  return response.json();
}

export async function postMessage(message: string, author: string): Promise<Message> {
  const { baseUrl, token } = getApiConfig();

  const response = await fetch(`${baseUrl}/api/v1/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, author }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post message: ${response.statusText || response.status}`);
  }

  return response.json();
}
