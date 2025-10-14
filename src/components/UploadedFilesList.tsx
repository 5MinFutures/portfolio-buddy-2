import { ChevronDown, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';

interface UploadedFilesListProps {
  files: File[];
  cleanedData: { [key: string]: { header: string[]; data: any[][]; rowCount: number; columnCount: number } };
  errors: string[];
  onRemove: (filename: string) => void;
  onExport: (filename: string) => void;
  show: boolean;
  onToggle: (value: boolean) => void;
}

const UploadedFilesList = ({ files, cleanedData, errors, onRemove, onExport, show, onToggle }: UploadedFilesListProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <button onClick={() => onToggle(!show)} className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors mb-2 sm:mb-3">
        <span className="text-base sm:text-lg font-semibold text-gray-800">Uploaded Files ({files.length})</span>
        <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-600 transform transition-transform ${show ? 'rotate-180' : ''}`} />
      </button>
      {show && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {files.map((file: File, index: number) => {
            const isProcessed = cleanedData[file.name];
            const hasError = errors.some((error: string) => error.includes(file.name));
            return (
              <div key={index} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 rounded-lg border ${hasError ? 'bg-red-50 border-red-200' : isProcessed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center mb-2 sm:mb-0">
                  <FileText className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 ${hasError ? 'text-red-500' : isProcessed ? 'text-green-500' : 'text-gray-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                      {isProcessed && cleanedData[file.name] && <span className="ml-2">• {cleanedData[file.name].rowCount} rows • {cleanedData[file.name].columnCount} columns</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  {isProcessed && (
                    <>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      <button onClick={() => onExport(file.name)} className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-1 sm:px-2 py-1 border border-blue-300 rounded hover:bg-blue-50">
                        <Download className="h-3 w-3 mr-1 inline" /> Export
                      </button>
                    </>
                  )}
                  {hasError && <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />}
                  <button onClick={() => onRemove(file.name)} className="text-red-600 hover:text-red-800 p-1">
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UploadedFilesList;