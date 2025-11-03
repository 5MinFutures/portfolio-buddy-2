import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => void;
  processing: boolean;
}

const UploadSection = ({ onFileChange, processing }: UploadSectionProps) => {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center cursor-pointer hover:border-blue-500 transition-colors" onDragOver={(e) => e.preventDefault()} onDrop={onFileChange}>
        <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
        <p className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">Drag and drop CSV files here</p>
        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">or</p>
        <label className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-blue-700 cursor-pointer text-sm sm:text-base">
          Select Files
          <input type="file" multiple accept=".csv" onChange={onFileChange} className="hidden" />
        </label>
      </div>
      {processing && <p className="mt-2 text-blue-600 text-sm">Processing...</p>}
    </div>
  );
};

export default UploadSection;