import React, { useRef ,useState,useCallback , useEffect } from "react";
import { FaCopy, FaRedo, FaCheck, FaLock } from 'react-icons/fa';


function PasswordGenerator(  ) {
    const [password,setPassword] = useState("");
    const [length,setLength] = useState(8);
    const [includeCharacter,setCharacter] = useState(false);
    const [includeNumbers,setNumber] = useState(false);
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const generatePassword = useCallback( ()=> {
    let charSet = alphabets;
    let newPassword = '';
    if (includeNumbers) charSet += numberChars;
    if (includeCharacter) charSet += symbolChars;
    for (let i = 0; i < length; i++) {
      let rmidx = Math.floor(Math.random() * charSet.length)          
      newPassword  += charSet[rmidx]
    }
    setPassword(newPassword)
},[length,includeNumbers,includeCharacter,setPassword])
  const passwordRef = useRef(null);
  const copyToClipboard = () => {
       passwordRef.current?.select();
      window.navigator.clipboard.writeText(password)
  };
  useEffect(() => {
    generatePassword(); 
  }, [length, alphabets, includeNumbers, includeCharacter]);
  
    return (
        <>
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden p-6 space-y-6">
          <div className="text-center">
        <div className="flex justify-center mb-2">
          <FaLock className="text-indigo-600 text-4xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Password Generator</h1>
        <p className="text-gray-600 mt-2">Create strong and secure passwords</p>
      </div>

        <div className="relative">
        <div className="flex items-center bg-gray-100 rounded-lg  "> 
              <input
            type="text"
            ref={passwordRef}
            value={password}
            readOnly
            className="w-full py-4 px-4 bg-transparent text-lg font-mono focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="p-3 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <FaCopy /> 
            
          </button>
          
           </div>
            <div className="space-y-3">
        <div className="flex justify-between">
          <label htmlFor="length" className="text-gray-700 font-medium">
            Password Length: <span className="text-indigo-600">{length}</span>
          </label>
        </div>
        <input
          type="range"
          id="length"
          min="4"
          max="32"
          value={length}
          onChange={(e)=>setLength((e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>4</span>
          <span>8</span>
          <span>12</span>
          <span>16</span>
          <span>20</span>
          <span>24</span>
          <span>28</span>
          <span>32</span>
        </div>
        <div className="flex space-x-2">  
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCharacter}
              onChange={() => setCharacter(!includeCharacter)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700">Character</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setNumber(!includeNumbers)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-gray-700">Numbers</span>
          </label>
      </div>
</div>
      
           </div>

           </div>
        </>
    )
}
export default PasswordGenerator;