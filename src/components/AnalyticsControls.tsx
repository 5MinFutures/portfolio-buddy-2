import { Calculator, LineChart, BarChart3 } from 'lucide-react';

interface AnalyticsControlsProps {
  showMetrics: boolean;
  setShowMetrics: React.Dispatch<React.SetStateAction<boolean>>;
  showPortfolio: boolean;
  setShowPortfolio: React.Dispatch<React.SetStateAction<boolean>>;
  showCorrelation: boolean;
  setShowCorrelation: React.Dispatch<React.SetStateAction<boolean>>;
}

const AnalyticsControls = ({
  showMetrics,
  setShowMetrics,
  showPortfolio,
  setShowPortfolio,
  showCorrelation,
  setShowCorrelation
}: AnalyticsControlsProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Processed Files</h3>
        <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
          <button onClick={() => setShowMetrics(!showMetrics)} className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base">
            <Calculator className="h-4 w-4 mr-2" />
            {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
          </button>
          <button onClick={() => setShowPortfolio(!showPortfolio)} className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm sm:text-base">
            <LineChart className="h-4 w-4 mr-2" />
            {showPortfolio ? 'Hide Portfolio' : 'Show Portfolio'}
          </button>
          <button onClick={() => setShowCorrelation(!showCorrelation)} className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm sm:text-base">
            <BarChart3 className="h-4 w-4 mr-2" />
            {showCorrelation ? 'Hide Correlation' : 'Show Correlation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsControls;