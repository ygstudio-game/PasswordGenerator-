// src/App.jsx
import React from 'react';
import PasswordGenerator from './components/PasswordGenerator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
               Password Generator
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create strong, memorable passwords with custom words, numbers, and symbols
          </p>
        </header>
        
        <PasswordGenerator />
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p className="mb-1">© {new Date().getFullYear()} Yadnyesh Borole . Secure Password Generator</p>
          <p className="mb-1">Secure Password Generator</p>
          <p>All passwords are generated locally in your browser - none are stored or transmitted</p>
        </footer>
      </div>
    </div>
  );
}

export default App;