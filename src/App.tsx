import React, { useState, useEffect } from 'react';
import { Calculator, History, X } from 'lucide-react';

function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
    setEquation(prev => prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay('0');
    setEquation(prev => prev + ' ' + op + ' ');
  };

  const calculate = () => {
    try {
      // Using Function constructor instead of eval for better security
      const result = new Function('return ' + equation)();
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(2);
      setHistory(prev => [...prev, `${equation} = ${formattedResult}`]);
      setDisplay(formattedResult);
      setEquation(formattedResult);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key.match(/[0-9]/)) handleNumber(e.key);
    if (e.key.match(/[\+\-\*\/]/)) handleOperator(e.key);
    if (e.key === 'Enter') calculate();
    if (e.key === 'Escape') clear();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [equation]);

  const Button = ({ children, onClick, className = '' }: { 
    children: React.ReactNode; 
    onClick: () => void; 
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-4 text-lg font-semibold rounded-xl transition-all hover:bg-opacity-90 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <Calculator className="text-blue-400 w-6 h-6" />
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <History className="w-5 h-5" />
          </button>
        </div>

        {showHistory && (
          <div className="mb-4 p-2 bg-gray-700 rounded-lg max-h-32 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="text-sm text-gray-300 py-1">{item}</div>
            ))}
          </div>
        )}

        <div className="bg-gray-900 p-4 rounded-xl mb-4">
          <div className="text-gray-400 text-sm h-6">{equation}</div>
          <div className="text-white text-4xl font-bold text-right overflow-hidden">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Button onClick={clear} className="bg-red-500 text-white">
            C
          </Button>
          <Button onClick={() => handleOperator('/')} className="bg-blue-500 text-white">
            ÷
          </Button>
          <Button onClick={() => handleOperator('*')} className="bg-blue-500 text-white">
            ×
          </Button>
          <Button onClick={() => handleOperator('-')} className="bg-blue-500 text-white">
            -
          </Button>

          {[7, 8, 9].map(num => (
            <Button 
              key={num} 
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-700 text-white"
            >
              {num}
            </Button>
          ))}
          <Button onClick={() => handleOperator('+')} className="bg-blue-500 text-white">
            +
          </Button>

          {[4, 5, 6].map(num => (
            <Button 
              key={num} 
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-700 text-white"
            >
              {num}
            </Button>
          ))}
          <Button onClick={calculate} className="bg-green-500 text-white row-span-2">
            =
          </Button>

          {[1, 2, 3].map(num => (
            <Button 
              key={num} 
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-700 text-white"
            >
              {num}
            </Button>
          ))}

          <Button 
            onClick={() => handleNumber('0')} 
            className="bg-gray-700 text-white col-span-2"
          >
            0
          </Button>
          <Button 
            onClick={() => handleNumber('.')} 
            className="bg-gray-700 text-white"
          >
            .
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;