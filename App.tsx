import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main>
          <Dashboard />
        </main>
        <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Energy Theft Detection System &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;