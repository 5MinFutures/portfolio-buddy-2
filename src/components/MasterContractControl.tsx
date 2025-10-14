import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MasterContractControlProps {
  masterValue: string;
  onMasterValueChange: (value: string) => void;
  onApplyToAll: (value: number) => void;
  allMetricsKeys: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MasterContractControl = ({ masterValue, onMasterValueChange, onApplyToAll, allMetricsKeys }: MasterContractControlProps) => {
  const [localValue, setLocalValue] = useState(masterValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const presetValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(masterValue);
    }
  }, [masterValue, isFocused]);

  const applyValue = () => {
    const parsed = parseFloat(localValue);
    if (!isNaN(parsed) && parsed >= 0.1 && parsed <= 100000) {
      onMasterValueChange(parsed.toString());
    } else {
      setLocalValue(masterValue);
    }
  };

  const cancelEdit = () => {
    setLocalValue(masterValue);
  };

  const handleApplyToAll = () => {
    const parsed = parseFloat(localValue);
    if (!isNaN(parsed) && parsed >= 0.1) {
      onMasterValueChange(parsed.toString());
      onApplyToAll(parsed);
    }
  };

  const handleIncrement = () => {
    const parsed = parseFloat(masterValue);
    if (isNaN(parsed) || parsed < 0.1) {
      onMasterValueChange('0.1');
      return;
    }
    if (parsed < 1.0) {
      onMasterValueChange(Math.min(1.0, parseFloat((parsed + 0.1).toFixed(1))).toString());
    } else {
      onMasterValueChange(Math.min(100000, Math.floor(parsed) + 1).toString());
    }
  };

  const handleDecrement = () => {
    const parsed = parseFloat(masterValue);
    if (isNaN(parsed) || parsed <= 0.1) return;
    if (Math.abs(parsed - 1.0) < 0.001) {
      onMasterValueChange('0.9');
    } else if (parsed < 1.0) {
      onMasterValueChange(Math.max(0.1, parseFloat((parsed - 0.1).toFixed(1))).toString());
    } else {
      onMasterValueChange(Math.max(1.0, Math.floor(parsed) - 1).toString());
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="flex items-center space-x-1">
        <div className="relative flex items-center">
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
                handleApplyToAll();
                (e.target as HTMLInputElement).blur();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelEdit();
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="1.0"
            className="w-12 sm:w-16 px-1 py-1 text-xs border rounded-l text-center"
          />
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-1 py-1 text-xs border-t border-b border-r hover:bg-gray-100"
          >
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-16 sm:w-20 bg-white border rounded shadow-lg z-10 max-h-40 sm:max-h-48 overflow-y-auto">
              {presetValues.map(val => (
                <button
                  key={val}
                  onClick={() => {
                    onMasterValueChange(val.toString());
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100"
                >
                  {val}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <button onClick={handleIncrement} className="p-0.5 hover:bg-gray-100 rounded">
            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button onClick={handleDecrement} className="p-0.5 hover:bg-gray-100 rounded">
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          applyValue();
        }}
        onClick={handleApplyToAll}
        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
      >
        Apply All
      </button>
    </div>
  );
};

export default MasterContractControl;