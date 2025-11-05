import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
  const { darkMode, setDarkMode } = useTheme();
  const [activeButton, setActiveButton] = useState('Dashboard');
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Reports', icon: '📑' }
  ];

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className={`relative overflow-hidden transition-colors duration-300
        ${darkMode ? 'bg-gradient-to-r from-purple-900 via-blue-800 to-cyan-700 text-white' : 'bg-gradient-to-r from-white via-blue-50 to-cyan-50 text-gray-800'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 -top-10 w-40 h-40 bg-white/6 rounded-full blur-2xl" />
        <div className="absolute right-8 top-4 w-56 h-56 bg-white/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Title with continuous floating animation */}
        <div className="flex items-center gap-6">
          <motion.h1
            className={`text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            aria-label="AI Product Trend Predictor"
          >
            <motion.span
              className="inline-block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
            >
              AI Product Trend Predictor
            </motion.span>
          </motion.h1>

          {/* small caption that also gently floats (optional) */}
          <motion.span
            className={`hidden md:inline-block ml-2 text-sm font-medium ${
              darkMode ? 'text-white/80' : 'text-gray-600'
            }`}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            Real-time insights & beautiful UI
          </motion.span>
        </div>

        {/* controls / nav */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-300'
            }`}
            title="Toggle theme"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>

          <nav className="hidden md:flex gap-2">
            <AnimatePresence>
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => setActiveButton(item.name)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${activeButton === item.name
                      ? darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-900'
                      : darkMode ? 'text-white/80 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </nav>
        </div>
      </div>

      <div className={`h-1 ${darkMode ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600' : 'bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300'}`} />
    </motion.header>
  );
};

export default Header;