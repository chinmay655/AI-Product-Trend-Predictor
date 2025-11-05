import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen transition-colors duration-300 dark:bg-gray-900">
        <Header />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
