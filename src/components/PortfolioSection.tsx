import { useState, useMemo } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import MetricsTable from './MetricsTable';
import { Chart as ChartJS, LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, Filler } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // For date handling
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import { formatNumber } from '../utils/dataUtils';

// Register Chart.js components and plugins
ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Tooltip, Legend, Filler, zoomPlugin, annotationPlugin);

interface TimeSeriesItem {
  dateStr: string;
  cumEquity: number;
  drawdown: number;
  drawdownPercent: number;
  // Add more properties as needed
}

interface PortfolioMetrics {
  totalPnl: number;
  annualGrowthRate: number;
  pnlDrawdownRatio: number;
  maxDrawdown: number;
  ddPercentStartingCapital: number;
  tradeWinRate: number;
  totalTrades: number;
  winningTradesCount: number;
  losingTradesCount: number;
  averageWin: number;
  averageLoss: number;
  expectedValue: number;
  totalMargin: number;
  tradingPeriodDays: number;
  selectedCount: number;
  // Add more properties as needed
}

interface PortfolioData {
  timeSeries: TimeSeriesItem[];
  metrics: PortfolioMetrics;
}

interface IndividualSeriesItem {
  date: string;
  cumEquity: number;
  // Add more properties as needed
}

interface IndividualSeries {
  name: string;
  data: IndividualSeriesItem[];
  color: string;
}

interface IndividualChartsData {
  series: IndividualSeries[];
  combinedData: unknown[]; // Adjust if combinedData structure is known
}

interface PortfolioSectionProps {
  allMetrics: Record<string, Record<string, unknown>>;
  selectedTradeLists: Set<string>;
  toggleSelection: (filename: string) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: string | null; end: string | null }>>;
  chartType: string;
  setChartType: React.Dispatch<React.SetStateAction<string>>;
  normalizeEquity: boolean;
  setNormalizeEquity: React.Dispatch<React.SetStateAction<boolean>>;
  startingCapital: number;
  setStartingCapital: React.Dispatch<React.SetStateAction<number>>;
  portfolioData: PortfolioData | null;
  individualChartsData: IndividualChartsData;
  showMetrics: boolean;
  sortedAndFilteredMetrics: Record<string, unknown>[];
  contractMultipliers: { [key: string]: number };
  handleContractChange: (filename: string, value: number) => void;
  masterContractValue: string;
  setMasterContractValue: (value: string) => void;
  applyMasterToAll: (value: number) => void;
  sortConfig: { key: string | null; direction: 'asc' | 'desc' };
  handleSort: (key: string) => void;
  sortPriorities: { column: string; direction: 'asc' | 'desc' }[];
  showAdvancedSort: boolean;
  setShowAdvancedSort: (value: boolean) => void;
  addSortPriority: () => void;
  removeSortPriority: (index: number) => void;
  updateSortPriority: (index: number, field: 'column' | 'direction', value: string) => void;
  clearSorting: () => void;
  applyAdvancedSort: () => void;
}

const PortfolioSection = ({
  allMetrics,
  selectedTradeLists,
  toggleSelection,
  dateRange,
  setDateRange,
  chartType,
  setChartType,
  normalizeEquity,
  setNormalizeEquity,
  startingCapital,
  setStartingCapital,
  portfolioData,
  individualChartsData,
  showMetrics,
  sortedAndFilteredMetrics,
  contractMultipliers,
  handleContractChange,
  masterContractValue,
  setMasterContractValue,
  applyMasterToAll,
  sortConfig,
  handleSort,
  sortPriorities,
  showAdvancedSort,
  setShowAdvancedSort,
  addSortPriority,
  removeSortPriority,
  updateSortPriority,
  clearSorting,
  applyAdvancedSort
}: PortfolioSectionProps) => {
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // Calculate max drawdown point for annotation
  const maxDrawdownPoint = useMemo(() => {
    if (!portfolioData?.timeSeries) return null;
    return portfolioData.timeSeries.reduce((max: TimeSeriesItem, point: TimeSeriesItem) =>
      point.drawdown < max.drawdown ? point : max, portfolioData.timeSeries[0] || {} as TimeSeriesItem);
  }, [portfolioData]);

  // Equity Chart Data
  const equityChartData = useMemo(() => {
    if (!portfolioData?.timeSeries) return { datasets: [] };
    return {
      datasets: [
        {
          label: 'Portfolio Equity',
          data: portfolioData.timeSeries.map(item => ({
            x: item.dateStr,
            y: normalizeEquity ? item.cumEquity : item.cumEquity,
          })),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
  }, [portfolioData, normalizeEquity]);

  // Drawdown Chart Data
  const drawdownChartData = useMemo(() => {
    if (!portfolioData?.timeSeries) return { datasets: [] };
    return {
      datasets: [
        {
          label: 'Drawdown',
          data: portfolioData.timeSeries.map(item => ({
            x: item.dateStr,
            y: normalizeEquity ? item.drawdownPercent : item.drawdown,
          })),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
  }, [portfolioData, normalizeEquity]);

  // Individual Charts Data
  const individualChartData = useMemo(() => {
    if (!individualChartsData.series.length) return { datasets: [] };
    return {
      datasets: individualChartsData.series.map((series: IndividualSeries) => ({
        label: series.name,
        data: series.data.map((item: IndividualSeriesItem) => ({
          x: item.date,
          y: normalizeEquity ? item.cumEquity : item.cumEquity,
        })),
        borderColor: series.color,
        backgroundColor: `${series.color}33`,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      })),
    };
  }, [individualChartsData, normalizeEquity]);

  // Common Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: { day: 'MMM d, yyyy' },
        },
        ticks: {
          maxTicksLimit: 30,
          font: { size: 10 },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          font: { size: 10 },
          callback: (value: any) => normalizeEquity ? `${value.toFixed(2)}%` : formatNumber(value),
        },
        grid: { color: '#e5e7eb' },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 10 }, color: '#1f2937' },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => `${context.dataset.label || ''}: ${normalizeEquity ? context.parsed.y.toFixed(2) + '%' : formatNumber(context.parsed.y)}`,
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x' as const,
        },
        pan: { enabled: true, mode: 'x' as const },
      },
      annotation: {
        annotations: maxDrawdownPoint && (chartType === 'drawdown' || chartType === 'both') ? [
          {
            type: 'line' as const,
            xMin: maxDrawdownPoint.dateStr,
            xMax: maxDrawdownPoint.dateStr,
            borderColor: '#EF4444',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'Max DD',
              position: 'center' as const,  // Changed to 'center' to match valid options
              backgroundColor: '#EF4444',
              color: '#ffffff',
              font: { size: 10 },
            },
          },
        ] : [],
      },
    },
  };

  // Drawdown-specific options (reversed Y-axis)
  const drawdownOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        reverse: true,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: (value: any) => normalizeEquity ? `${value.toFixed(2)}%` : formatNumber(value),
        },
      },
    },
  };

  return (
    <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
      {showMetrics && (
        <MetricsTable
          sortedAndFilteredMetrics={sortedAndFilteredMetrics}
          selectedTradeLists={selectedTradeLists}
          toggleSelection={toggleSelection}
          contractMultipliers={contractMultipliers}
          handleContractChange={handleContractChange}
          masterContractValue={masterContractValue}
          setMasterContractValue={setMasterContractValue}
          applyMasterToAll={applyMasterToAll}
          sortConfig={sortConfig}
          handleSort={handleSort}
          sortPriorities={sortPriorities}
          showAdvancedSort={showAdvancedSort}
          setShowAdvancedSort={setShowAdvancedSort}
          addSortPriority={addSortPriority}
          removeSortPriority={removeSortPriority}
          updateSortPriority={updateSortPriority}
          clearSorting={clearSorting}
          applyAdvancedSort={applyAdvancedSort}
        />
      )}
      {selectedTradeLists.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 sm:space-x-4">
              <div className="flex items-center gap-1 sm:gap-2 sm:space-x-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-800">Date Range:</span>
                <input
                  type="date"
                  value={dateRange.start || ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="text-xs sm:text-sm px-1 sm:px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  aria-label="Start Date"
                />
                <span className="text-blue-600 text-xs sm:text-sm">to</span>
                <input
                  type="date"
                  value={dateRange.end || ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="text-xs sm:text-sm px-1 sm:px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  aria-label="End Date"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:space-x-3">
              <label className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={normalizeEquity}
                  onChange={(e) => setNormalizeEquity(e.target.checked)}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded"
                  aria-label="Normalize by Margin"
                />
                <span className="text-blue-800">Normalize by Margin</span>
              </label>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-blue-800">Starting Capital:</span>
                <input
                  type="number"
                  value={startingCapital}
                  onChange={(e) => setStartingCapital(Number(e.target.value) || 1000000)}
                  className="w-20 sm:w-24 px-1 sm:px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="1000000"
                  aria-label="Starting Capital"
                />
              </div>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                aria-label="Chart Type"
              >
                <option value="equity">Equity Curve</option>
                <option value="drawdown">Drawdown</option>
                <option value="both">Both Charts</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {selectedTradeLists.size === 0 && (
        <div className="p-3 sm:p-4 bg-gray-100 border border-gray-200 rounded-lg text-center">
          <p className="text-xs sm:text-sm text-gray-600">Select at least one trading strategy from the metrics table to view portfolio analysis.</p>
        </div>
      )}
      {portfolioData && selectedTradeLists.size > 0 && portfolioData.timeSeries.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Return</p>
              <p className={`text-base sm:text-lg font-bold ${portfolioData.metrics.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatNumber(portfolioData.metrics.totalPnl)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Annual Growth Rate</p>
              <p className={`text-base sm:text-lg font-bold ${portfolioData.metrics.annualGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioData.metrics.annualGrowthRate.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">PNL/DD Ratio</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">
                {portfolioData.metrics.pnlDrawdownRatio === Infinity ? '∞' : portfolioData.metrics.pnlDrawdownRatio.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Max Drawdown</p>
              <p className="text-base sm:text-lg font-bold text-red-600">{formatNumber(portfolioData.metrics.maxDrawdown)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">DD % of Capital</p>
              <p className="text-base sm:text-lg font-bold text-red-600">{portfolioData.metrics.ddPercentStartingCapital.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Win Rate</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">{portfolioData.metrics.tradeWinRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Trades</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">{portfolioData.metrics.totalTrades}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Winning Trades</p>
              <p className="text-base sm:text-lg font-bold text-green-600">{portfolioData.metrics.winningTradesCount}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Losing Trades</p>
              <p className="text-base sm:text-lg font-bold text-red-600">{portfolioData.metrics.losingTradesCount}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Average Win</p>
              <p className="text-base sm:text-lg font-bold text-green-600">{formatNumber(portfolioData.metrics.averageWin)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Average Loss</p>
              <p className="text-base sm:text-lg font-bold text-red-600">{formatNumber(portfolioData.metrics.averageLoss)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Expected Value</p>
              <p className={`text-base sm:text-lg font-bold ${portfolioData.metrics.expectedValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatNumber(portfolioData.metrics.expectedValue)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Margin</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">{formatNumber(portfolioData.metrics.totalMargin)}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Trading Days</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">{portfolioData.metrics.tradingPeriodDays}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 font-medium">Strategies</p>
              <p className="text-base sm:text-lg font-bold text-blue-600">{portfolioData.metrics.selectedCount}</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h5 className="text-xs sm:text-sm font-medium text-blue-800">Advanced Metrics</h5>
              <button
                onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                className="text-xs text-blue-600 hover:text-blue-800 px-1 sm:px-2 py-1 border border-blue-300 rounded hover:bg-blue-100"
                aria-label={showAdvancedMetrics ? 'Hide Advanced Metrics' : 'Show Advanced Metrics'}
              >
                {showAdvancedMetrics ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            {showAdvancedMetrics && (
              <div className="text-xs text-blue-700 space-y-1 mt-2">
                <p><strong>Portfolio Composition:</strong> {Array.from(selectedTradeLists).map(filename => allMetrics[filename]?.strategyName || filename.replace('.csv', '')).join(', ')}</p>
                <p><strong>Start Date:</strong> {portfolioData.timeSeries[0]?.dateStr || 'N/A'}</p>
                <p><strong>End Date:</strong> {portfolioData.timeSeries[portfolioData.timeSeries.length - 1]?.dateStr || 'N/A'}</p>
                <p><strong>Average Trade:</strong> {formatNumber(portfolioData.metrics.totalPnl / (portfolioData.metrics.totalTrades || 1))}</p>
                <p><strong>Sharpe Ratio:</strong> {((portfolioData.metrics.annualGrowthRate / 100) / (portfolioData.metrics.maxDrawdown / startingCapital)).toFixed(2)}</p>
                <p><strong>Sortino Ratio:</strong> {((portfolioData.metrics.annualGrowthRate / 100) / (portfolioData.metrics.maxDrawdown / startingCapital)).toFixed(2)}</p>
                <p><strong>Max Drawdown Duration:</strong> N/A</p>
              </div>
            )}
          </div>
        </div>
      )}
      {portfolioData && selectedTradeLists.size > 0 && portfolioData.timeSeries.length === 0 && (
        <div className="p-3 sm:p-4 bg-red-100 border border-red-200 rounded-lg text-center">
          <p className="text-xs sm:text-sm text-red-600">No valid data available for the selected strategies. Please check your data or selections.</p>
        </div>
      )}
      {portfolioData && selectedTradeLists.size > 0 && portfolioData.timeSeries.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {(chartType === 'equity' || chartType === 'both') && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                Portfolio Equity Curve {normalizeEquity && '(% of Margin)'}
              </h4>
              <div style={{ height: '300px' }} className="min-h-[200px] sm:min-h-[300px]" aria-label="Portfolio Equity Curve">
                <Chart type="line" data={equityChartData} options={chartOptions} />
              </div>
            </div>
          )}
          {(chartType === 'drawdown' || chartType === 'both') && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                Portfolio Drawdown {normalizeEquity && '(% of Margin)'}
              </h4>
              <div style={{ height: '250px' }} className="min-h-[150px] sm:min-h-[250px]" aria-label="Portfolio Drawdown">
                <Chart type="line" data={drawdownChartData} options={drawdownOptions} />
              </div>
            </div>
          )}
          {individualChartsData.series.length >= 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                Individual Trade List Performance {normalizeEquity && '(% of Margin)'}
              </h4>
              <div style={{ height: '300px' }} className="min-h-[200px] sm:min-h-[300px]" aria-label="Individual Trade List Performance">
                <Chart type="line" data={individualChartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;