import { getDisplayName } from '../utils/dataUtils.ts';

interface CorrelationHeatmapProps {
  matrix: number[][] | null;
  strategies: string[];
  threshold: number;
  allMetrics: { [key: string]: any } | undefined;
}

const CorrelationHeatmap = ({ matrix, strategies, threshold, allMetrics }: CorrelationHeatmapProps) => {
  if (!matrix || !strategies || strategies.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Select at least 2 strategies to view correlation matrix</p>
      </div>
    );
  }

  if (!allMetrics) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Metrics data unavailable for correlation visualization</p>
      </div>
    );
  }

  const getCorrelationColor = (value: number, i: number, j: number): string => {
    if (i === j) {
      return 'text-white font-bold';
    }
    const absValue = Math.abs(value);
    if (absValue < threshold) {
      return 'text-black font-bold';
    } else {
      return 'text-black font-bold';
    }
  };
  const getCellStyle = (value: number): { backgroundColor: string } => {
    const absValue = Math.abs(value);
    if (absValue < threshold) {
      const greenIntensity = 1 - (absValue / threshold);
      const greenValue = Math.round(100 + (155 * greenIntensity));
      return { backgroundColor: `rgb(${255 - greenValue}, ${greenValue}, ${255 - greenValue})` };
    } else if (value > 0) {
      const intensity = (absValue - threshold) / (1 - threshold);
      const opacity = 0.4 + (intensity * 0.6);
      return { backgroundColor: `rgba(59, 130, 246, ${opacity})` };
    } else {
      const intensity = (absValue - threshold) / (1 - threshold);
      const opacity = 0.4 + (intensity * 0.6);
      return { backgroundColor: `rgba(239, 68, 68, ${opacity})` };
    }
  };
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 sm:space-x-6 text-xs sm:text-sm mb-3 sm:mb-4">
        {/* Color Legend */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded"></div>
          <span>Strong Negative (-1.0)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-300 rounded"></div>
          <span>Weak Negative</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded"></div>
          <span>Low Correlation (0.0)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-300 rounded"></div>
          <span>Weak Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded"></div>
          <span>Strong Positive (+1.0)</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1 sm:p-2 border border-gray-300 bg-gray-100 text-xs font-medium">Strategy</th>
              {strategies.map((strategy: string, index: number) => (
                <th key={index} className="p-1 sm:p-2 border border-gray-300 bg-gray-100 text-xs font-medium text-center min-w-[60px] sm:min-w-[80px] max-w-[80px] sm:max-w-[100px]" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                  <div className="break-words leading-tight">
                    {getDisplayName(allMetrics?.[strategy]) || strategy.replace('.csv', '').substring(0, 12)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row: number[], i: number) => (
              <tr key={i}>
                <td className="p-1 sm:p-2 border border-gray-300 bg-gray-50 text-xs font-medium">
                  {getDisplayName(allMetrics?.[strategies[i]]) || strategies[i].replace('.csv', '')}
                </td>
                {row.map((value: number, j: number) => (
                  <td key={j} className={`p-1 sm:p-2 border border-gray-300 text-center text-xs ${getCorrelationColor(value, i, j)}`} style={getCellStyle(value)} title={`${strategies[i].replace('.csv', '')} vs ${strategies[j].replace('.csv', '')}: ${value.toFixed(3)}`}>
                    {i === j ? '1.00' : value.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="bg-blue-50 p-2 sm:p-3 rounded">
          <h6 className="font-medium text-blue-800">High Positive Correlations</h6>
          <p className="text-blue-700">
            {matrix.flatMap((row: number[], i: number) => row.map((val: number, j: number) => ({ val, i, j }))).filter(({ val, i, j }: { val: number; i: number; j: number }) => i < j && val > 0.7).length} pairs above 0.70
          </p>
        </div>
        <div className="bg-red-50 p-2 sm:p-3 rounded">
          <h6 className="font-medium text-red-800">High Negative Correlations</h6>
          <p className="text-red-700">
            {matrix.flatMap((row: number[], i: number) => row.map((val: number, j: number) => ({ val, i, j }))).filter(({ val, i, j }: { val: number; i: number; j: number }) => i < j && val < -0.7).length} pairs below -0.70
          </p>
        </div>
        <div className="bg-green-50 p-2 sm:p-3 rounded">
          <h6 className="font-medium text-green-800">Good Diversification</h6>
          <p className="text-green-700">
            {matrix.flatMap((row: number[], i: number) => row.map((val: number, j: number) => ({ val, i, j }))).filter(({ val, i, j }: { val: number; i: number; j: number }) => i < j && Math.abs(val) < 0.5).length} pairs with low correlation
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;