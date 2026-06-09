import { useState } from 'react';
import { useMessages } from './hooks/useMessages.ts';
import MessageList from './components/MessageList.tsx';
import MessageInput from './components/MessageInput.tsx';
import bodyBg from './assets/Body BG.png';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => 
    localStorage.getItem('doodle_chat_user')
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

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f4f5f6] font-sans antialiased">
      {!currentUser ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <ChatScreen currentUser={currentUser} onLogout={handleLogout} />
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
      <div className="rounded-lg border border-[#d4dade] bg-white p-8 shadow-md text-center">
        <img
          src="https://www.google.com/s2/favicons?domain=doodle.com&sz=128"
          alt="Doodle Logo"
          className="h-16 w-16 mx-auto mb-4 object-contain"
        />
        <h2 className="text-2xl font-bold text-[#434b54] mb-2">Welcome to Doodle Chat</h2>
        <p className="text-sm text-[#b3bcc3] mb-6">Enter your name to join the chatroom</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            className="w-full rounded-md border-2 border-[#d4dade] focus:border-blue-500 bg-white px-4 py-2.5 text-[#434b54] placeholder-[#b3bcc3] focus:outline-none transition-colors font-sans text-base"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-md bg-[#ff7e67] hover:bg-[#ff6f54] active:bg-[#e5644c] py-2.5 font-semibold text-white focus:outline-none transition-colors disabled:opacity-50"
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
}

function ChatScreen({ currentUser, onLogout }: ChatScreenProps) {
  const { messages, isLoading, error, sendMessage } = useMessages(currentUser);

  return (
    <div className="flex h-full w-full max-w-[640px] flex-col bg-white shadow-md md:h-[90vh] md:rounded-lg md:border md:border-[#d4dade] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#d4dade] bg-white px-6 py-4">
        <div className="flex items-center space-x-3">
          <img
            src="https://www.google.com/s2/favicons?domain=doodle.com&sz=128"
            alt="Doodle Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-lg font-bold text-[#434b54] m-0">Doodle Chat</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-[#b3bcc3]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>
              Logged in as: <strong className="text-[#434b54] font-semibold">{currentUser}</strong>
            </span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-[#ff7e67] hover:text-[#ff6f54] hover:underline focus:outline-none cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Messages Area with Doodle Background */}
      <main 
        className="flex flex-1 flex-col overflow-hidden bg-[#fafafa]"
        style={{ 
          backgroundImage: `url(${bodyBg})`,
          backgroundRepeat: 'repeat',
        }}
      >
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-[#b3bcc3]">
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
      </main>

      {/* Input Area */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
}
