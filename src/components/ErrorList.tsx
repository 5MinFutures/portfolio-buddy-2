import { AlertCircle } from 'lucide-react';

interface ErrorListProps {
  errors: string[];
}

const ErrorList = ({ errors }: ErrorListProps) => {
  return (
    <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-start">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 ml-2 sm:ml-3">
          <h4 className="text-red-800 font-medium mb-1 text-sm sm:text-base">Processing Errors:</h4>
          <ul className="text-red-700 text-xs sm:text-sm space-y-1">
            {errors.map((error: string, index: number) => <li key={index}>• {error}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorList;