// src/components/SortableHeader.tsx
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortableHeaderProps {
  column: string;
  children: React.ReactNode;
  sortConfig: { key: string | null; direction: 'asc' | 'desc' };
  handleSort: (key: string) => void;
}

const SortableHeader = ({ column, children, sortConfig, handleSort }: SortableHeaderProps) => {
  return (
    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b cursor-pointer hover:bg-gray-100 relative group">
      <div className="flex items-center space-x-1" onClick={() => handleSort(column)}>
        <span>{children}</span>
        {sortConfig.key === column && (sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </div>
    </th>
  );
};

export default SortableHeader;