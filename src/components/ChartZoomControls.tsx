interface ChartZoomControlsProps {
  isZoomed: boolean;
  onReset: () => void;
}

/**
 * Mobile-optimized controls for chart zoom operations.
 * Provides reset zoom functionality.
 */
export const ChartZoomControls = ({
  isZoomed,
  onReset
}: ChartZoomControlsProps) => {
  return (
    <div className="flex justify-end mb-3 sm:mb-4">
      <button
        onClick={onReset}
        disabled={!isZoomed}
        className={`
          px-3 py-2 sm:px-4 sm:py-2
          rounded-md
          text-sm font-medium
          transition-colors
          min-h-[44px] sm:min-h-0
          ${
            isZoomed
              ? 'bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
        aria-label="Reset zoom to 100%"
      >
        Reset Zoom
      </button>
    </div>
  );
};
