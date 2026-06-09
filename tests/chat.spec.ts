import { test, expect, type Page } from '@playwright/test';

// shared helpers

async function login(page: Page, name = 'TestUser') {
  await page.goto('/');
  await page.getByPlaceholder('Your Name').fill(name);
  await page.getByRole('button', { name: /join chat/i }).click();
  await expect(page.getByRole('heading', { name: /doodle chat/i })).toBeVisible();
}

async function mockGetMessages(page: Page, messages: object[]) {
  await page.route('**/api/v1/messages*', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(messages),
      });
    } else {
      route.continue();
    }
  });
}

async function mockPostMessage(page: Page, response: object) {
  await page.route('**/api/v1/messages', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(response),
      });
    } else {
      route.continue();
    }
  });
}

// Login Screen

test.describe('Login Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows login screen on first visit', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome to doodle chat/i })).toBeVisible();
    await expect(page.getByPlaceholder('Your Name')).toBeVisible();
    await expect(page.getByRole('button', { name: /join chat/i })).toBeVisible();
  });

  test('Join Chat button is disabled when input is empty', async ({ page }) => {
    const button = page.getByRole('button', { name: /join chat/i });
    await expect(button).toBeDisabled();
  });

  test('Join Chat button becomes enabled when name is typed', async ({ page }) => {
    await page.getByPlaceholder('Your Name').fill('Alice');
    await expect(page.getByRole('button', { name: /join chat/i })).toBeEnabled();
  });

  test('logging in navigates to the chat screen', async ({ page }) => {
    await mockGetMessages(page, []);
    await login(page, 'Alice');
    await expect(page.getByRole('heading', { name: /doodle chat/i })).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();
  });

  test('session is persisted in localStorage', async ({ page }) => {
    await mockGetMessages(page, []);
    await login(page, 'Bob');
    await page.reload();
    await expect(page.getByRole('heading', { name: /doodle chat/i })).toBeVisible();
  });
});

// Chat Screen

test.describe('Chat Screen', () => {
  const MESSAGES = [
    { _id: '1', message: 'Hello there!', author: 'Alice', createdAt: '2026-06-01T10:00:00.000Z' },
    { _id: '2', message: 'Hi Alice!', author: 'TestUser', createdAt: '2026-06-01T10:01:00.000Z' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await mockGetMessages(page, MESSAGES);
    await login(page, 'TestUser');
  });

  test('renders messages from the API', async ({ page }) => {
    await expect(page.getByText('Hello there!')).toBeVisible();
    await expect(page.getByText('Hi Alice!')).toBeVisible();
  });

  test('shows author name for messages from other users', async ({ page }) => {
    await expect(page.getByText('Alice').first()).toBeVisible();
  });

  test('does NOT show author label for own messages', async ({ page }) => {
    const bubble = page.locator('p', { hasText: 'Hi Alice!' }).locator('..');
    await expect(bubble.getByText('TestUser')).not.toBeVisible();
  });

  test('own messages are right-aligned', async ({ page }) => {
    const ownMessageRow = page.locator('div.justify-end').filter({ hasText: 'Hi Alice!' });
    await expect(ownMessageRow).toBeVisible();
  });

  test('other messages are left-aligned', async ({ page }) => {
    const otherMessageRow = page.locator('div.justify-start').filter({ hasText: 'Hello there!' });
    await expect(otherMessageRow).toBeVisible();
  });

  test('logout button clears session and shows login screen', async ({ page }) => {
    await page.getByTitle('Logout').click();
    await expect(page.getByRole('heading', { name: /welcome to doodle chat/i })).toBeVisible();
    const storedUser = await page.evaluate(() => localStorage.getItem('doodle_chat_user'));
    expect(storedUser).toBeNull();
  });
});

// Sending Messages

test.describe('Sending Messages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await mockGetMessages(page, []);
    await login(page, 'TestUser');
  });

  test('send button is disabled when input is empty', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('send button becomes enabled when text is typed', async ({ page }) => {
    await page.getByPlaceholder(/message/i).fill('Hello!');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('typing and sending a message calls POST and shows it', async ({ page }) => {
    const newMsg = { _id: '99', message: 'New message!', author: 'TestUser', createdAt: new Date().toISOString() };
    await mockPostMessage(page, newMsg);
    await mockGetMessages(page, [newMsg]);

    await page.getByPlaceholder(/message/i).fill('New message!');
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText('New message!')).toBeVisible();
  });

  test('input is cleared after sending', async ({ page }) => {
    const newMsg = { _id: '100', message: 'Clear me!', author: 'TestUser', createdAt: new Date().toISOString() };
    await mockPostMessage(page, newMsg);
    await mockGetMessages(page, [newMsg]);

    const input = page.getByPlaceholder(/message/i);
    await input.fill('Clear me!');
    await page.locator('button[type="submit"]').click();

    await expect(input).toHaveValue('');
  });

  test('pressing Enter sends the message', async ({ page }) => {
    const newMsg = { _id: '101', message: 'Enter key!', author: 'TestUser', createdAt: new Date().toISOString() };
    await mockPostMessage(page, newMsg);
    await mockGetMessages(page, [newMsg]);

    await page.getByPlaceholder(/message/i).fill('Enter key!');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Enter key!')).toBeVisible();
  });
});

// Dark Mode Toggle

test.describe('Dark Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await mockGetMessages(page, []);
    await login(page, 'TestUser');
  });

  test('starts in light mode by default', async ({ page }) => {
    const root = page.locator('#root > div').first();
    await expect(root).toHaveClass(/(?:^|\s)light(?:\s|$)/);
    const classes = await root.getAttribute('class');
    const tokens = classes?.split(/\s+/) ?? [];
    expect(tokens).not.toContain('dark');
  });

  test('clicking theme toggle switches to dark mode', async ({ page }) => {
    await page.getByTitle(/switch to dark mode/i).click();
    const root = page.locator('#root > div').first();
    await expect(root).toHaveClass(/dark/);
  });

  test('theme preference is persisted across page reloads', async ({ page }) => {
    await page.getByTitle(/switch to dark mode/i).click();
    await page.reload();
    const root = page.locator('#root > div').first();
    await expect(root).toHaveClass(/dark/);
  });

  test('clicking toggle again switches back to light mode', async ({ page }) => {
    await page.getByTitle(/switch to dark mode/i).click();
    await page.getByTitle(/switch to light mode/i).click();
    const root = page.locator('#root > div').first();
    await expect(root).toHaveClass(/(?:^|\s)light(?:\s|$)/);
    const classes = await root.getAttribute('class');
    const tokens = classes?.split(/\s+/) ?? [];
    expect(tokens).not.toContain('dark');
  });
});
