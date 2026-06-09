import { useMessages } from './hooks/useMessages.ts';
import MessageList from './components/MessageList.tsx';
import MessageInput from './components/MessageInput.tsx';
import bodyBg from './assets/Body BG.png';

export default function App() {
  const authorName = import.meta.env.VITE_AUTHOR_NAME || 'Donato';
  const { messages, isLoading, error, sendMessage } = useMessages(authorName);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#f4f5f6] font-sans antialiased">
      {/* Main Chat Container */}
      <div className="flex h-full w-full max-w-[640px] flex-col bg-white shadow-md md:h-[90vh] md:rounded-lg md:border md:border-[#d4dade] overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#d4dade] bg-white px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
              D
            </div>
            <h1 className="text-lg font-bold text-[#434b54] m-0">Doodle Chat</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm text-[#b3bcc3]">
              Logged in as: <strong className="text-[#434b54] font-semibold">{authorName}</strong>
            </span>
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
            <MessageList messages={messages} currentUser={authorName} />
          )}
        </main>

        {/* Input Area */}
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
