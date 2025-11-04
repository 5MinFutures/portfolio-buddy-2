// src/hooks/useContractMultipliers.ts
import { useState } from 'react';

const useContractMultipliers = () => {
  const [contractMultipliers, setContractMultipliers] = useState<{ [key: string]: number }>({});
  const [masterContractValue, setMasterContractValue] = useState('1.0');

  const handleContractChange = (filename: string, value: number) => {
    setContractMultipliers(prev => ({ ...prev, [filename]: value }));
  };

  const applyMasterToAll = (value: number, targetKeys?: string[]) => {
    setContractMultipliers(prev => {
      const updated = { ...prev };
      const keysToUpdate = targetKeys || Object.keys(prev);

      keysToUpdate.forEach(key => {
        updated[key] = value;
      });

      return updated;
    });
  };

  return { contractMultipliers, masterContractValue, setMasterContractValue, handleContractChange, applyMasterToAll };
};

export default useContractMultipliers;