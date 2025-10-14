import { Download } from 'lucide-react';
import CorrelationHeatmap from './CorrelationHeatmap.tsx';
import { buildCorrelationMatrix } from '../utils/dataUtils.ts';

interface CorrelationSectionProps {
  selectedTradeLists: Set<string>;
  dailyReturnsMap: Map<string, number[]>;
  correlationThreshold: number;
  setCorrelationThreshold: React.Dispatch<React.SetStateAction<number>>;
  correlationMatrix: { matrix: number[][]; strategies: string[]; size: number } | null;
  correlationCalculating: boolean;
  onExport: () => void;
  allMetrics: { [key: string]: Record<string, unknown> }; // Changed from any to Record<string, unknown>
}

const CorrelationSection = ({
  selectedTradeLists,
  dailyReturnsMap,
  correlationThreshold,
  setCorrelationThreshold,
  correlationMatrix,
  correlationCalculating,
  onExport,
  allMetrics
}: CorrelationSectionProps) => {
  return (
    <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <h4 className="text-base sm:text-lg font-semibold text-orange-800">Spearman's Correlation Analysis</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 sm:space-x-4">
            <div className="flex items-center gap-2 sm:space-x-2">
              <label className="text-xs sm:text-sm font-medium text-orange-800">Significance Threshold:</label>
              <select
                value={correlationThreshold}
                onChange={(e) => setCorrelationThreshold(parseFloat(e.target.value))}
                className="text-xs sm:text-sm px-1 sm:px-2 py-1 border border-orange-300 rounded focus:outline-none focus:border-orange-500"
              >
                <option value={0.3}>0.30 (Weak)</option>
                <option value={0.5}>0.50 (Moderate)</option>
                <option value={0.7}>0.70 (Strong)</option>
              </select>
              <button
                onClick={() => {
                  console.clear();
                  console.log('=== MANUAL CORRELATION DEBUG TRIGGER ===');
                  const matrix = buildCorrelationMatrix(dailyReturnsMap, selectedTradeLists); // Removed Array.from
                  console.log('Matrix result:', matrix);
                  console.log('Daily returns map:', dailyReturnsMap);
                }}
                className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600"
              >
                Debug Correlations
              </button>
            </div>
            {correlationMatrix && (
              <button
                onClick={onExport}
                className="flex items-center text-xs sm:text-sm text-orange-600 hover:text-orange-800 px-2 sm:px-3 py-1 border border-orange-300 rounded-md hover:bg-orange-100"
              >
                <Download className="h-3 w-3 mr-1" />
                Export CSV
              </button>
            )}
          </div>
        </div>
        {selectedTradeLists.size < 2 && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-orange-100 border border-orange-200 rounded">
            <p className="text-xs sm:text-sm text-orange-800">
              Select at least 2 trading strategies from the metrics table above to calculate correlations.
              Correlation analysis helps identify portfolio diversification opportunities and strategy dependencies.
            </p>
          </div>
        )}
        {correlationCalculating && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-orange-100 border border-orange-200 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-orange-600 border-t-transparent mr-2 sm:mr-3"></div>
              <span className="text-orange-700 text-xs sm:text-sm">Calculating Spearman's correlations...</span>
            </div>
          </div>
        )}
      </div>
      {selectedTradeLists.size >= 2 && correlationMatrix && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <h5 className="font-medium text-gray-800 text-sm sm:text-base">Strategy Correlation Matrix</h5>
            <div className="text-xs sm:text-sm text-gray-600">
              Based on daily returns • {dailyReturnsMap.get(Array.from(selectedTradeLists)[0])?.length || 0} trading days
            </div>
          </div>
          <CorrelationHeatmap
            matrix={correlationMatrix.matrix}
            strategies={correlationMatrix.strategies}
            threshold={correlationThreshold}
            allMetrics={allMetrics}
          />
        </div>
      )}
    </div>
  );
};

export default CorrelationSection;