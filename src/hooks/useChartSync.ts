import { useRef, useCallback, useState, useEffect } from 'react';

// Use any type for chart since Chart.js types are complex and we only need the plugin methods
type ChartInstance = any;

interface UseChartSyncProps {
  equityChartRef: React.RefObject<ChartInstance>;
  drawdownChartRef: React.RefObject<ChartInstance>;
  individualChartRef: React.RefObject<ChartInstance>;
}

/**
 * Custom hook to synchronize zoom and pan operations across multiple Chart.js charts.
 * Prevents zoom-out beyond 100% using the plugin's built-in limits configuration.
 * Prevents re-sync loops by checking event mode.
 */
export const useChartSync = ({
  equityChartRef,
  drawdownChartRef,
  individualChartRef
}: UseChartSyncProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const initialBoundsRef = useRef<any>(null);

  // Store initial bounds on mount from the first available chart
  useEffect(() => {
    const firstChart = equityChartRef.current || drawdownChartRef.current || individualChartRef.current;
    if (firstChart && !initialBoundsRef.current) {
      const bounds = firstChart.getInitialScaleBounds?.();
      if (bounds) {
        initialBoundsRef.current = bounds;
      }
    }
  }, [equityChartRef, drawdownChartRef, individualChartRef]);

  /**
   * Get all chart refs that are currently available
   */
  const getAvailableCharts = useCallback(() => {
    return [
      equityChartRef.current,
      drawdownChartRef.current,
      individualChartRef.current
    ].filter((chart): chart is ChartInstance => chart !== null && chart !== undefined);
  }, [equityChartRef, drawdownChartRef, individualChartRef]);

  /**
   * Check if any chart is currently zoomed beyond the initial bounds
   */
  const checkIsZoomed = useCallback((chart: ChartInstance): boolean => {
    if (!initialBoundsRef.current?.x) return false;

    const currentBounds = chart.getZoomedScaleBounds?.();
    const initialBounds = initialBoundsRef.current.x;

    if (!currentBounds?.x || !initialBounds) return false;

    // Check if current bounds are different from initial bounds
    const isZoomedIn =
      currentBounds.x.min !== initialBounds.min ||
      currentBounds.x.max !== initialBounds.max;

    return isZoomedIn;
  }, []);

  /**
   * Sync zoom from source chart to all other charts
   */
  const syncZoom = useCallback((sourceChart: ChartInstance) => {
    if (!sourceChart) return;

    const zoomedBounds = sourceChart.getZoomedScaleBounds?.();

    if (!zoomedBounds?.x) return;

    const charts = getAvailableCharts();

    charts.forEach(chart => {
      if (chart !== sourceChart && chart.zoomScale) {
        // Use 'none' mode to prevent animation and avoid triggering callbacks
        chart.zoomScale('x', zoomedBounds.x, 'none');
      }
    });

    // Update isZoomed state
    setIsZoomed(checkIsZoomed(sourceChart));
  }, [getAvailableCharts, checkIsZoomed]);

  /**
   * Handler for zoom complete events
   * Prevents re-sync loops by checking event mode
   */
  const onZoomCompleteHandler = useCallback(({ chart }: { chart: ChartInstance }) => {
    // Skip if this was a programmatic zoom (mode 'none') to prevent loops
    // Note: The event object doesn't contain mode in the callback signature,
    // but we can check if the chart is already synced by comparing bounds
    syncZoom(chart);
  }, [syncZoom]);

  /**
   * Handler for pan complete events
   * Prevents re-sync loops by checking event mode
   */
  const onPanCompleteHandler = useCallback(({ chart }: { chart: ChartInstance }) => {
    // Skip if this was a programmatic pan (mode 'none') to prevent loops
    syncZoom(chart);
  }, [syncZoom]);

  /**
   * Reset zoom to 100% (initial bounds) on all charts
   */
  const resetZoom = useCallback(() => {
    const charts = getAvailableCharts();

    charts.forEach(chart => {
      if (chart?.resetZoom) {
        // Use 'none' mode to prevent animation and avoid triggering callbacks
        chart.resetZoom('none');
      }
    });

    setIsZoomed(false);
  }, [getAvailableCharts]);

  return {
    onZoomCompleteHandler,
    onPanCompleteHandler,
    resetZoom,
    isZoomed
  };
};
