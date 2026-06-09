/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#0f172a',        // Dark navy background
          panel: '#1e293b',     // Sidebar / header
          surface: '#1e293b',   // Input area surface
          bubble: {
            own: '#4f46e5',     // Indigo – own messages
            other: '#334155',   // Slate – others' messages
          },
          accent: '#6366f1',    // Indigo accent
          muted: '#64748b',     // Muted text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
