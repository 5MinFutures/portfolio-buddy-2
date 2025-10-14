// src/hooks/useMetrics.ts
import { useMemo } from 'react';
import { calculateMetrics, getAdjustedMetrics } from '../utils/dataUtils.ts';

interface SortPriority {
  column: string;
  direction: 'asc' | 'desc';
}

const useMetrics = (
  cleanedData: Record<string, { header: string[]; data: any[][] }>,
  contractMultipliers: Record<string, number>,
  sortConfig: { key: string | null; direction: 'asc' | 'desc' },
  sortPriorities: SortPriority[]
) => {
  const allMetrics = useMemo(() => {
    const metrics: Record<string, any> = {};
    Object.entries(cleanedData).forEach(([filename, data]) => {
      const originalMetrics = calculateMetrics(data, filename);
      if (originalMetrics) {
        const multiplier = contractMultipliers[filename] || 1.0;
        metrics[filename] = getAdjustedMetrics(originalMetrics, multiplier);
      }
    });
    return metrics;
  }, [cleanedData, contractMultipliers]);

  const sortedAndFilteredMetrics = useMemo(() => {
    const sorted = Object.values(allMetrics);
    if (sortPriorities.length > 0) {
      sorted.sort((a: any, b: any) => {
        for (const { column, direction } of sortPriorities) {
          let valA = a[column] ?? 0;
          let valB = b[column] ?? 0;
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return direction === 'asc' ? -1 : 1;
          if (valA > valB) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else if (sortConfig.key) {
      sorted.sort((a: any, b: any) => {
        const key = sortConfig.key as string;
        let valA = a[key] ?? 0;
        let valB = b[key] ?? 0;
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allMetrics, sortConfig, sortPriorities]);

  return { allMetrics, sortedAndFilteredMetrics };
};

export default useMetrics;