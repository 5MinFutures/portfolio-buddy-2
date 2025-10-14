import { formatNumber } from '../utils/dataUtils.ts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    const tooltipOrder = dataPoint?._tooltipOrder;
    const sortedPayload = [...payload];
    if (tooltipOrder) {
      sortedPayload.sort((a, b) => {
        const aIndex = tooltipOrder.indexOf(a.name);
        const bIndex = tooltipOrder.indexOf(b.name);
        return aIndex - bIndex;
      });
    } else {
      sortedPayload.sort((a, b) => (b.value || 0) - (a.value || 0));
    }
    return (
      <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-xs sm:text-sm font-medium text-gray-800 mb-1 sm:mb-2">{label}</p>
        {sortedPayload.map((entry, index) => (
          <p key={index} className="text-xs sm:text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;