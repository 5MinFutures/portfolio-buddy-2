// src/hooks/useSorting.ts
import { useState } from 'react';

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface SortPriority {
  column: string;
  direction: 'asc' | 'desc';
}

const useSorting = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [showAdvancedSort, setShowAdvancedSort] = useState(false);
  const [sortPriorities, setSortPriorities] = useState<SortPriority[]>([]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
    setSortPriorities([]);
  };

  const addSortPriority = () => {
    setSortPriorities(prev => [...prev, { column: 'netProfit', direction: 'desc' }]);
  };

  const removeSortPriority = (index: number) => {
    setSortPriorities(prev => prev.filter((_, i) => i !== index));
  };

  const updateSortPriority = (index: number, field: 'column' | 'direction', value: string) => {
    setSortPriorities(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const clearSorting = () => {
    setSortPriorities([]);
    setSortConfig({ key: null, direction: 'asc' });
  };

  const applyAdvancedSort = () => {
    if (sortPriorities.length > 0) {
      setSortConfig({ key: null, direction: 'asc' });
      setShowAdvancedSort(false);
    }
  };

  return {
    sortConfig,
    showAdvancedSort,
    setShowAdvancedSort,
    sortPriorities,
    handleSort,
    addSortPriority,
    removeSortPriority,
    updateSortPriority,
    clearSorting,
    applyAdvancedSort
  };
};

export default useSorting;