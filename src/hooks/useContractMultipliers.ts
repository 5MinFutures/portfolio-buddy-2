// src/hooks/useContractMultipliers.ts
import { useState } from 'react';

const useContractMultipliers = () => {
  const [contractMultipliers, setContractMultipliers] = useState<{ [key: string]: number }>({});
  const [masterContractValue, setMasterContractValue] = useState('1.0');

  const handleContractChange = (filename: string, value: number) => {
    setContractMultipliers(prev => ({ ...prev, [filename]: value }));
  };

  const applyMasterToAll = (value: number) => {
    const updated: { [key: string]: number } = {};
    Object.keys(contractMultipliers).forEach(key => {
      updated[key] = value;
    });
    setContractMultipliers(updated);
  };

  return { contractMultipliers, masterContractValue, setMasterContractValue, handleContractChange, applyMasterToAll };
};

export default useContractMultipliers;