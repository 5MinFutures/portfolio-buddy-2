import skoolLogo from '../assets/skool-logo.png';

interface ButtonSectionProps {
  onFetchSupabase: () => void;
  processing: boolean;
}

const ButtonSection = ({ onFetchSupabase, processing }: ButtonSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-end gap-2 sm:gap-3 mb-4 sm:mb-6">
      {/* Load Data Button */}
      <button
        onClick={onFetchSupabase}
        disabled={processing}
        className="w-full sm:w-auto px-4 py-2 min-h-[44px] bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Load data from database"
      >
        Load Data
      </button>

      {/* skool.com/futures Button */}
      <a
        href="https://www.skool.com/futures"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 min-h-[44px] bg-black text-[#84cc16] font-bold rounded-md hover:bg-gray-900 transition-colors"
        aria-label="Join our Skool community"
      >
        <img src={skoolLogo} alt="Skool" className="h-5 w-5" />
        <span>skool.com/futures</span>
      </a>
    </div>
  );
};

export default ButtonSection;
