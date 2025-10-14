import { CheckCircle } from 'lucide-react';

const SessionComplete = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-center">
        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
        <div>
          <h4 className="text-green-800 font-medium text-sm sm:text-base">Portfolio Analysis Complete</h4>
          <p className="text-green-700 text-xs sm:text-sm">Portfolio aggregation, interactive equity curves, and comprehensive analytics ready for analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default SessionComplete;