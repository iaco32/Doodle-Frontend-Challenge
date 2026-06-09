import { useState } from 'react';
import { useMessages } from './hooks/useMessages.ts';
import MessageList from './components/MessageList.tsx';
import MessageInput from './components/MessageInput.tsx';
import bodyBg from './assets/Body BG.png';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => 
    localStorage.getItem('doodle_chat_user')
  );
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('doodle_chat_theme') as 'light' | 'dark') || 'light'
  );

  const handleLogin = (username: string) => {
    const trimmed = username.trim();
    if (trimmed) {
      localStorage.setItem('doodle_chat_user', trimmed);
      setCurrentUser(trimmed);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doodle_chat_user');
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('doodle_chat_theme', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <div className={`${theme} flex h-full w-full items-center justify-center bg-doodle-bg dark:bg-slate-950 font-sans antialiased transition-colors duration-200`}>
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <ChatScreen currentUser={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      )}
    </div>
  );
}

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name);
  };

  return (
    <div className="w-full max-w-md p-6">
      <div className="rounded-lg border border-doodle-border dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-md text-center">
        <img
          src="https://www.google.com/s2/favicons?domain=doodle.com&sz=128"
          alt="Doodle Logo"
          className="h-16 w-16 mx-auto mb-4 rounded-full border border-doodle-border dark:border-slate-700 object-contain p-1 bg-white shadow-sm"
        />
        <h2 className="text-2xl font-bold text-doodle-text dark:text-white mb-2">Welcome to Doodle Chat</h2>
        <p className="text-sm text-doodle-muted dark:text-slate-400 mb-6">Enter your name to join the chatroom</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="w-full rounded-md border-2 border-doodle-border dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-800 px-4 py-2.5 text-doodle-text dark:text-slate-100 placeholder-doodle-muted dark:placeholder-slate-400 focus:outline-none transition-colors font-sans text-base"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-md bg-doodle-send-button py-2.5 font-semibold text-white focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}

interface ChatScreenProps {
  currentUser: string;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function ChatScreen({ currentUser, onLogout, theme, onToggleTheme }: ChatScreenProps) {
  const { messages, isLoading, error, sendMessage } = useMessages(currentUser);

  return (
    <div className="flex h-full w-full max-w-[640px] flex-col bg-white dark:bg-slate-900 shadow-md md:h-[90vh] md:rounded-lg md:border md:border-doodle-border md:dark:border-slate-800 overflow-hidden">
      {/* Header with bg-doodle-form-bg (keeps blue color in both modes) */}
      <header className="flex items-center justify-between border-b border-doodle-border dark:border-slate-800 bg-doodle-form-bg px-6 py-4 shadow-sm z-20">
        <div className="flex items-center space-x-3">
          <img
            src="https://www.google.com/s2/favicons?domain=doodle.com&sz=128"
            alt="Doodle Logo"
            className="h-8 w-8 rounded-full border border-white/20 object-contain bg-white p-0.5"
          />
          <h1 className="text-lg font-bold text-white m-0">Doodle Chat</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-white/90">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400 border border-slate-900 animate-pulse"></span>
            <span className="hidden sm:inline">
              Logged in as: <strong className="text-white font-semibold">{currentUser}</strong>
            </span>
          </div>
          
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-doodle-border hover:bg-[#2f76a2] hover:border-[#2f76a2] focus:outline-none cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            {theme === 'light' ? (
              <svg className="h-5 w-5 text-slate-700 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-amber-500 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Logout"
            className="group flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-doodle-border hover:bg-red-500 hover:border-red-500 focus:outline-none cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
          >
            <svg 
              className="h-5 w-5 text-red-500 group-hover:text-white transition-colors duration-200" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages Area with Doodle Background */}
      <main 
        className="relative flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-950 z-10"
        style={{ 
          backgroundImage: `url(${bodyBg})`,
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Dark Mode Overlay to dim background doodle pattern (keeps doodles visible but dark) */}
        <div className="absolute inset-0 bg-slate-950/45 pointer-events-none hidden dark:block z-0" />
        
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center text-doodle-muted">
              <div className="flex flex-col items-center space-y-3">
                <svg className="h-8 w-8 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Loading messages...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-1 items-center justify-center p-4">
              <div className="max-w-md rounded-lg bg-red-50 border border-red-200 p-5 text-center text-red-700 shadow-md">
                <p className="font-semibold">Error loading messages</p>
                <p className="text-sm mt-2 opacity-90">{error}</p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} currentUser={currentUser} />
          )}
        </div>
      </main>

      {/* Input Area */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
