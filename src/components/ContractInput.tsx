import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ContractInputProps {
  filename: string;
  value: number;
  onChange: (filename: string, value: number) => void;
}

const ContractInput = ({ filename, value, onChange }: ContractInputProps) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const presetValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
    }
  }, [value, isFocused]);

  const applyValue = () => {
    const parsed = parseFloat(localValue);
    if (!isNaN(parsed) && parsed >= 0.1 && parsed <= 100000) {
      onChange(filename, parsed);
    } else {
      setLocalValue(value.toString());
    }
  };

  const cancelEdit = () => {
    setLocalValue(value.toString());
  };

  const handleIncrement = () => {
    if (value < 1.0) {
      const newValue = Math.min(1.0, parseFloat((value + 0.1).toFixed(1)));
      onChange(filename, newValue);
    } else {
      const newValue = Math.min(100000, Math.floor(value) + 1);
      onChange(filename, newValue);
    }
  };

  const handleDecrement = () => {
    if (value <= 0.1) {
      return;
    } else if (Math.abs(value - 1.0) < 0.001) {
      onChange(filename, 0.9);
    } else if (value < 1.0) {
      const newValue = Math.max(0.1, parseFloat((value - 0.1).toFixed(1)));
      onChange(filename, newValue);
    } else {
      const newValue = Math.max(1.0, Math.floor(value) - 1);
      onChange(filename, newValue);
    }
  };

  return (
    <div className="flex items-center space-x-1 relative">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={(e) => {
          setIsFocused(true);
          e.target.select();
        }}
        onBlur={() => {
          setIsFocused(false);
          cancelEdit();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            applyValue();
            (e.target as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-12 sm:w-16 px-1 py-1 text-sm border rounded-l text-center"
      />
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-1 py-1 border-t border-b border-r hover:bg-gray-100"
      >
        <ChevronDown className="h-3 w-3" />
      </button>
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-16 sm:w-20 bg-white border rounded shadow-lg z-10 max-h-40 sm:max-h-48 overflow-y-auto">
          {presetValues.map(val => (
            <button
              key={val}
              onClick={() => {
                onChange(filename, val);
                setShowDropdown(false);
              }}
              className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100"
            >
              {val}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-col">
        <button onClick={handleIncrement} className="p-0.5 hover:bg-gray-100 rounded">
          <ChevronUp className="h-3 w-3" />
        </button>
        <button onClick={handleDecrement} className="p-0.5 hover:bg-gray-100 rounded">
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default ContractInput;