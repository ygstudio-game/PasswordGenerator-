// src/components/PasswordGenerator.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCopy, FaRedo, FaCheck, FaLock, FaEye, FaEyeSlash, FaPlus, FaTrash } from 'react-icons/fa';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState('');
  const [strengthPercent, setStrengthPercent] = useState(0);
  const [strengthColor, setStrengthColor] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState('');
  const [customWords, setCustomWords] = useState(['']);
  const [useCustomWords, setUseCustomWords] = useState(false);
  const [customNumbers, setCustomNumbers] = useState(['']);
  const [useCustomNumbers, setUseCustomNumbers] = useState(false);
  const [customSymbols, setCustomSymbols] = useState(['']);
  const [useCustomSymbols, setUseCustomSymbols] = useState(false);
  
  // Memorable password state
  const [passwordType, setPasswordType] = useState('random'); // 'random' or 'memorable'
  const [numberOfWords, setNumberOfWords] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [addNumbersToWords, setAddNumbersToWords] = useState(true);

  // Refs
  const passwordRef = useRef(null);
  
  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Word list for memorable passwords
  const wordList = [
    'apple', 'banana', 'cherry', 'dragon', 'elephant', 'forest', 'galaxy', 
    'harmony', 'island', 'jupiter', 'kangaroo', 'lightning', 'mountain', 
    'nebula', 'ocean', 'penguin', 'quantum', 'river', 'sunshine', 'tiger',
    'universe', 'volcano', 'waterfall', 'xylophone', 'yellow', 'zebra',
    'abstract', 'bicycle', 'camera', 'diamond', 'eclipse', 'feather', 'guitar',
    'horizon', 'infinity', 'jungle', 'keyboard', 'lighthouse', 'moonlight', 'northern',
    'octopus', 'paradise', 'quicksand', 'rainbow', 'silhouette', 'thunder', 'umbrella',
    'velocity', 'whisper', 'yellowstone', 'zenith'
  ];
  
  // Generate password function
  const generatePassword = useCallback(() => {
    setError('');
    
    if (passwordType === 'memorable') {
      // Generate memorable password
      const words = [];
      const cryptoArray = new Uint32Array(numberOfWords);
      window.crypto.getRandomValues(cryptoArray);
      
      for (let i = 0; i < numberOfWords; i++) {
        const randomIndex = cryptoArray[i] % wordList.length;
        let word = wordList[randomIndex];
        
        // Capitalize if enabled
        if (capitalizeWords) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        
        // Add numbers if enabled
        if (addNumbersToWords) {
          const randomNum = Math.floor(Math.random() * 10);
          word += randomNum;
        }
        
        words.push(word);
      }
      
      // Join words with separator
      let newPassword = words.join(separator);
      
      // Add custom elements if enabled
      if (useCustomWords && customWords[0]?.trim() !== '') {
        newPassword = customWords[0] + separator + newPassword;
      }
      
      if (useCustomNumbers && customNumbers[0]?.trim() !== '') {
        newPassword += customNumbers[0];
      }
      
      if (useCustomSymbols && customSymbols[0]?.trim() !== '') {
        newPassword += customSymbols[0];
      }
      
      setPassword(newPassword);
      calculateStrength(newPassword);
      return;
    }
    
    // Generate random password
    let charSet = '';
    let newPassword = '';
    
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;
    
    // Validate at least one character set is selected
    if (charSet.length === 0 && 
        !useCustomWords && 
        !useCustomNumbers && 
        !useCustomSymbols) {
      setError('Please select at least one character type or add custom elements');
      setPassword('');
      setStrength('');
      setStrengthPercent(0);
      return;
    }
    
    // Create arrays for custom elements
    const allCustomElements = [];
    
    if (useCustomWords) {
      customWords.forEach(word => {
        if (word.trim() !== '') allCustomElements.push(word.trim());
      });
    }
    
    if (useCustomNumbers) {
      customNumbers.forEach(num => {
        if (num.trim() !== '') allCustomElements.push(num.trim());
      });
    }
    
    if (useCustomSymbols) {
      customSymbols.forEach(sym => {
        if (sym.trim() !== '') allCustomElements.push(sym.trim());
      });
    }
    
    // Calculate total length of custom elements
    const customLength = allCustomElements.reduce((total, el) => total + el.length, 0);
    
    // Validate password length
    if (length < customLength) {
      setError(`Password length must be at least ${customLength} to include all custom elements`);
      setPassword('');
      setStrength('');
      setStrengthPercent(0);
      return;
    }
    
    // Generate the base password
    const charSetArray = charSet.split('');
    const charSetSize = charSetArray.length;
    const cryptoArray = new Uint32Array(length - customLength);
    window.crypto.getRandomValues(cryptoArray);
    
    for (let i = 0; i < length - customLength; i++) {
      const randomIndex = cryptoArray[i] % charSetSize;
      newPassword += charSetArray[randomIndex];
    }
    
    // Insert custom elements at random positions
    if (allCustomElements.length > 0) {
      const passwordChars = newPassword.split('');
      
      allCustomElements.forEach(element => {
        if (element.length > 0) {
          // Find a random position to insert the element
          const insertPos = Math.floor(Math.random() * (passwordChars.length + 1));
          
          // Insert the element
          passwordChars.splice(insertPos, 0, ...element.split(''));
        }
      });
      
      newPassword = passwordChars.join('');
    }
    
    setPassword(newPassword);
    calculateStrength(newPassword);
  }, [
    includeUppercase, includeLowercase, includeNumbers, includeSymbols,
    length, customWords, customNumbers, customSymbols,
    useCustomWords, useCustomNumbers, useCustomSymbols,
    passwordType, numberOfWords, separator, capitalizeWords, addNumbersToWords
  ]);
  
  // Calculate password strength
  const calculateStrength = useCallback((pass) => {
    let strengthValue = 0;
    
    // Length contributes 25% (max 25)
    strengthValue += Math.min(25, (pass.length / 32) * 25);
    
    // Character variety
    let varietyScore = 0;
    if (/[A-Z]/.test(pass)) varietyScore++;
    if (/[a-z]/.test(pass)) varietyScore++;
    if (/[0-9]/.test(pass)) varietyScore++;
    if (/[^A-Za-z0-9]/.test(pass)) varietyScore++;
    
    // Variety contributes 75% (max 75)
    strengthValue += (varietyScore / 4) * 75;
    
    // Penalize short passwords even if they have variety
    if (pass.length < 8) strengthValue *= 0.6;
    
    // Bonus for custom elements
    const hasCustomElements = useCustomWords || useCustomNumbers || useCustomSymbols;
    if (hasCustomElements) strengthValue = Math.min(100, strengthValue * 1.1);
    
    setStrengthPercent(Math.round(strengthValue));
    
    // Set strength text and color
    if (strengthValue < 40) {
      setStrength('Weak');
      setStrengthColor('bg-red-500');
    } else if (strengthValue < 70) {
      setStrength('Medium');
      setStrengthColor('bg-yellow-500');
    } else if (strengthValue < 90) {
      setStrength('Strong');
      setStrengthColor('bg-green-500');
    } else {
      setStrength('Very Strong');
      setStrengthColor('bg-emerald-500');
    }
  }, [useCustomWords, useCustomNumbers, useCustomSymbols]);
  
  // Copy to clipboard
  const copyToClipboard = () => {
    if (passwordRef.current && password.length > 0) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Handle custom inputs
  const handleCustomInputChange = (setter, index, value) => {
    setter(prev => {
      const newItems = [...prev];
      newItems[index] = value;
      return newItems;
    });
  };
  
  const addCustomInput = (setter) => {
    setter(prev => [...prev, '']);
  };
  
  const removeCustomInput = (setter, index) => {
    setter(prev => {
      const newItems = [...prev];
      newItems.splice(index, 1);
      return newItems;
    });
  };
  
  // Generate password on initial render and when settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-indigo-100 p-3 rounded-full">
            <FaLock className="text-indigo-600 text-2xl" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Enhanced Password Generator</h1>
        <p className="text-gray-600 mt-2">Create strong, customizable passwords with your own words and symbols</p>
      </div>
      
      {/* Password Type Selection */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button 
          className={`px-4 py-2 rounded-lg transition-colors ${
            passwordType === 'random' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setPasswordType('random')}
        >
          Random Password
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-colors ${
            passwordType === 'memorable' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setPasswordType('memorable')}
        >
          Memorable Password
        </button>
      </div>
      
      {/* Password Display */}
      <div className="relative">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <input
            type={showPassword ? "text" : "password"}
            ref={passwordRef}
            value={password}
            readOnly
            className="w-full py-4 px-4 bg-transparent text-lg font-mono focus:outline-none"
            aria-label="Generated password"
          />
          <div className="flex">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-3 text-gray-500 hover:text-indigo-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <button
              onClick={copyToClipboard}
              disabled={password.length === 0}
              className={`p-3 text-gray-500 hover:text-indigo-600 transition-colors ${password.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Copy password to clipboard"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {copied && !error && (
          <div className="absolute top-2 right-14 bg-green-500 text-white text-xs px-2 py-1 rounded animate-fade">
            Copied!
          </div>
        )}
      </div>
      
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password Strength:</span>
          <span className={`font-medium ${strengthColor.replace('bg-', 'text-')}`}>
            {strength} {strengthPercent > 0 && `(${strengthPercent}%)`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${strengthColor}`} 
            style={{ width: `${strengthPercent}%` }}
          ></div>
        </div>
      </div>
      
      {/* Password Type Specific Options */}
      {passwordType === 'random' ? (
        <>
          {/* Length Slider for Random Passwords */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <label htmlFor="length" className="text-gray-700 font-medium">
                Password Length: <span className="text-indigo-600">{length}</span>
              </label>
              <span className="text-sm text-gray-500">
                {length < 8 ? 'Too short' : length < 12 ? 'Good' : 'Excellent'}
              </span>
            </div>
            <input
              type="range"
              id="length"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              aria-label="Password length slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>4</span>
              <span>12</span>
              <span>20</span>
              <span>28</span>
              <span>36</span>
              <span>44</span>
              <span>52</span>
              <span>60</span>
              <span>64</span>
            </div>
          </div>
          
          {/* Character Options */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Include Character Types:</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${includeUppercase ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {includeUppercase && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Uppercase (A-Z)</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={() => setIncludeLowercase(!includeLowercase)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${includeLowercase ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {includeLowercase && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Lowercase (a-z)</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${includeNumbers ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {includeNumbers && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Numbers (0-9)</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${includeSymbols ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {includeSymbols && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Symbols (!@#$)</span>
              </label>
            </div>
          </div>
          
          {/* Custom Sections for Random Passwords */}
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useCustomWords}
                  onChange={() => setUseCustomWords(!useCustomWords)}
                  className="sr-only"
                />
                <div className={`block w-5 h-5 rounded border ${useCustomWords ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                  {useCustomWords && (
                    <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-700 font-medium">Include Custom Words</span>
            </label>
            
            {useCustomWords && (
              <div className="space-y-3 pl-7">
                {customWords.map((word, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={word}
                      onChange={(e) => handleCustomInputChange(setCustomWords, index, e.target.value)}
                      placeholder={`Custom word ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    />
                    {customWords.length > 1 && (
                      <button 
                        onClick={() => removeCustomInput(setCustomWords, index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Remove custom word"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                    {index === customWords.length - 1 && (
                      <button 
                        onClick={() => addCustomInput(setCustomWords)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                        aria-label="Add another custom word"
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Add your own words (names, places, etc.) to include in the password
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useCustomNumbers}
                  onChange={() => setUseCustomNumbers(!useCustomNumbers)}
                  className="sr-only"
                />
                <div className={`block w-5 h-5 rounded border ${useCustomNumbers ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                  {useCustomNumbers && (
                    <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-700 font-medium">Include Custom Numbers</span>
            </label>
            
            {useCustomNumbers && (
              <div className="space-y-3 pl-7">
                {customNumbers.map((number, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => handleCustomInputChange(setCustomNumbers, index, e.target.value)}
                      placeholder={`Custom number ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    />
                    {customNumbers.length > 1 && (
                      <button 
                        onClick={() => removeCustomInput(setCustomNumbers, index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Remove custom number"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                    {index === customNumbers.length - 1 && (
                      <button 
                        onClick={() => addCustomInput(setCustomNumbers)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                        aria-label="Add another custom number"
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Add specific numbers (birth years, anniversaries, etc.) to include in the password
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={useCustomSymbols}
                  onChange={() => setUseCustomSymbols(!useCustomSymbols)}
                  className="sr-only"
                />
                <div className={`block w-5 h-5 rounded border ${useCustomSymbols ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                  {useCustomSymbols && (
                    <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-700 font-medium">Include Custom Symbols</span>
            </label>
            
            {useCustomSymbols && (
              <div className="space-y-3 pl-7">
                {customSymbols.map((symbol, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => handleCustomInputChange(setCustomSymbols, index, e.target.value)}
                      placeholder={`Custom symbol ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                    />
                    {customSymbols.length > 1 && (
                      <button 
                        onClick={() => removeCustomInput(setCustomSymbols, index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Remove custom symbol"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                    {index === customSymbols.length - 1 && (
                      <button 
                        onClick={() => addCustomInput(setCustomSymbols)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                        aria-label="Add another custom symbol"
                      >
                        <FaPlus />
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Add specific symbols (emojis, special characters, etc.) to include in the password
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Memorable Password Options */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">Number of Words</label>
                <select
                  value={numberOfWords}
                  onChange={(e) => setNumberOfWords(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  {[3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num} words</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-700 font-medium">Separator</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Dot (.)</option>
                  <option value=",">Comma (,)</option>
                  <option value=" ">Space ( )</option>
                  <option value="">None</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={capitalizeWords}
                    onChange={() => setCapitalizeWords(!capitalizeWords)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${capitalizeWords ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {capitalizeWords && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Capitalize Words</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={addNumbersToWords}
                    onChange={() => setAddNumbersToWords(!addNumbersToWords)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${addNumbersToWords ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {addNumbersToWords && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Add Numbers to Words</span>
              </label>
            </div>
            
            {/* Custom Elements for Memorable Passwords */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useCustomWords}
                    onChange={() => setUseCustomWords(!useCustomWords)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${useCustomWords ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {useCustomWords && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700 font-medium">Add Prefix Word</span>
              </label>
              
              {useCustomWords && (
                <div className="space-y-3 pl-7">
                  {customWords.slice(0, 1).map((word, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={word}
                        onChange={(e) => handleCustomInputChange(setCustomWords, index, e.target.value)}
                        placeholder="Prefix word"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      />
                      <button 
                        onClick={() => removeCustomInput(setCustomWords, index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Remove custom word"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    Add a custom prefix word to your memorable password
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useCustomNumbers}
                    onChange={() => setUseCustomNumbers(!useCustomNumbers)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${useCustomNumbers ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {useCustomNumbers && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700 font-medium">Add Suffix Number</span>
              </label>
              
              {useCustomNumbers && (
                <div className="space-y-3 pl-7">
                  {customNumbers.slice(0, 1).map((number, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={number}
                        onChange={(e) => handleCustomInputChange(setCustomNumbers, index, e.target.value)}
                        placeholder="Suffix number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      />
                      <button 
                        onClick={() => removeCustomInput(setCustomNumbers, index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Remove custom number"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    Add a custom suffix number to your memorable password
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useCustomSymbols}
                    onChange={() => setUseCustomSymbols(!useCustomSymbols)}
                    className="sr-only"
                  />
                  <div className={`block w-5 h-5 rounded border ${useCustomSymbols ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                    {useCustomSymbols && (
                      <svg className="w-4 h-4 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-gray-700 font-medium">Add Suffix Symbol</span>
              </label>
              
              {useCustomSymbols && (
                <div className="space-y-3 pl-7">
                  {customSymbols.slice(0, 1).map((symbol, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={symbol}
                        onChange={(e) => handleCustomInputChange(setCustomSymbols, index, e.target.value)}
                        placeholder="Suffix symbol"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      />
                      <button 
                        onClick={() => removeCustomInput(setCustomSymbols, index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                        aria-label="Remove custom symbol"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    Add a custom suffix symbol to your memorable password
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center justify-center"
      >
        <FaRedo className="mr-2 animate-spin-once" />
        Generate New Password
      </button>
      
      {/* Security Tips */}
      <div className="text-sm text-gray-600 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="font-medium text-indigo-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Password Security Tips
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use at least <span className="font-medium">12 characters</span> for security</li>
          <li>Include a <span className="font-medium">mix of character types</span></li>
          <li>Custom words should be <span className="font-medium">memorable but not obvious</span></li>
          <li>Use a <span className="font-medium">unique password</span> for each account</li>
          <li>Consider using a <span className="font-medium">password manager</span></li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordGenerator;