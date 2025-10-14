import skoolLogo from '../assets/skool-logo.png'

const Header = () => {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Trading Data Processor</h1>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Upload or fetch CSV trade lists to analyze metrics, build portfolios, and compute correlations.</p>
      <a
        href="https://www.skool.com/futures"
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-fit items-center gap-2 px-4 my-6 py-2 min-h-[44px] border border-gray-300 text-gray-800 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Join our Skool community"
      >
        <img src={skoolLogo} alt="Skool" className="h-5 w-5" />
        <span>skool.com/futures</span>
      </a>
    </div>
  );
};

export default Header;