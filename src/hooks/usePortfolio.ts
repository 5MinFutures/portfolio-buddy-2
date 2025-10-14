// src/hooks/usePortfolio.ts
import { useMemo } from 'react';
import { getDateKey, getMarginRate, getDisplayName, getColorForIndex } from '../utils/dataUtils.ts';
import { differenceInCalendarDays } from 'date-fns';

const usePortfolio = (
  allMetrics: Record<string, any>,
  selectedTradeLists: Set<string>,
  dateRange: { start: string | null; end: string | null },
  normalizeEquity: boolean,
  startingCapital: number,
  contractMultipliers: Record<string, number>
) => {
  const portfolioData = useMemo(() => {
    if (selectedTradeLists.size === 0) return null;
    const allTrades: any[] = [];
    let totalMargin = 0;
    let startDate = new Date();
    let endDate = new Date(0);
    Array.from(selectedTradeLists).forEach(filename => {
      const metrics = allMetrics[filename];
      if (metrics && metrics.tradeData) {
        allTrades.push(...metrics.tradeData.map((trade: any) => ({
          ...trade,
          dateKey: getDateKey(trade.date)
        })));
        totalMargin += getMarginRate(metrics.symbol, filename);
        if (metrics.startDate < startDate) startDate = metrics.startDate;
        if (metrics.endDate > endDate) endDate = metrics.endDate;
      }
    });
    allTrades.sort((a, b) => a.date - b.date);

    const timeSeries: any[] = [];
    let cumEquity = startingCapital;
    let peak = startingCapital;
    let maxDrawdown = 0;
    let totalPnl = 0;
    let winningTradesCount = 0;
    let losingTradesCount = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let totalTrades = 0;

    // Group by date for daily aggregation if needed, but for equity curve, cumulative per trade date
    const equityByDate = new Map();
    allTrades.forEach(trade => {
      const key = getDateKey(trade.date);
      if (!equityByDate.has(key)) equityByDate.set(key, 0);
      equityByDate.set(key, equityByDate.get(key) + trade.equity);
      if (trade.equity > 0) {
        winningTradesCount++;
        totalWins += trade.equity;
      } else if (trade.equity < 0) {
        losingTradesCount++;
        totalLosses += trade.equity;
      }
      totalTrades++;
    });

    // Build time series
    equityByDate.forEach((dailyEquity, dateKey) => {
      cumEquity += dailyEquity;
      totalPnl += dailyEquity;
      if (cumEquity > peak) peak = cumEquity;
      const drawdown = peak - cumEquity;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      timeSeries.push({
        dateStr: dateKey,
        cumEquity,
        drawdown: -drawdown, // Negative for chart
        drawdownPercent: startingCapital > 0 ? (-drawdown / startingCapital) * 100 : 0
      });
    });

    const tradingPeriodDays = differenceInCalendarDays(endDate, startDate) || 1;
    const annualGrowthRate = (totalPnl / startingCapital / tradingPeriodDays) * 365 * 100;
    const pnlDrawdownRatio = maxDrawdown !== 0 ? totalPnl / maxDrawdown : Infinity;
    const ddPercentStartingCapital = (maxDrawdown / startingCapital) * 100;
    const tradeWinRate = totalTrades > 0 ? (winningTradesCount / totalTrades) * 100 : 0;
    const averageWin = winningTradesCount > 0 ? totalWins / winningTradesCount : 0;
    const averageLoss = losingTradesCount > 0 ? totalLosses / losingTradesCount : 0;
    const expectedValue = (tradeWinRate / 100 * averageWin) - ((1 - tradeWinRate / 100) * Math.abs(averageLoss));

    return {
      timeSeries,
      metrics: {
        totalPnl,
        annualGrowthRate,
        pnlDrawdownRatio,
        maxDrawdown,
        ddPercentStartingCapital,
        tradeWinRate,
        totalTrades,
        winningTradesCount,
        losingTradesCount,
        averageWin,
        averageLoss,
        expectedValue,
        totalMargin,
        tradingPeriodDays,
        selectedCount: selectedTradeLists.size
      }
    };
  }, [allMetrics, selectedTradeLists, dateRange, normalizeEquity, startingCapital, contractMultipliers]);

  const individualChartsData = useMemo(() => {
    const series = Array.from(selectedTradeLists).map((filename: string, index: number) => {
      const metrics = allMetrics[filename];
      const data = metrics.processedData.map((trade: any) => ({
        date: getDateKey(trade.date),
        cumEquity: normalizeEquity ? (trade.cumEquity / metrics.margin) * 100 : trade.cumEquity
      }));
      return { filename, name: getDisplayName(metrics), color: getColorForIndex(index), data };
    });

    const combinedData: any[] = [];
    // Merge all individual data by date, filling nulls for missing dates
    const allDates = new Set(series.flatMap(s => s.data.map((d: any) => d.date)));
    Array.from(allDates).sort().forEach(date => {
      const entry: any = { date };
      series.forEach(s => {
        const point = s.data.find((d: any) => d.date === date);
        entry[s.name] = point ? point.cumEquity : null;
      });
      combinedData.push(entry);
    });

    return { series, combinedData };
  }, [allMetrics, selectedTradeLists, normalizeEquity]);

  const dailyReturnsMap = useMemo(() => {
    const returnsMap = new Map<string, number[]>();
    Array.from(selectedTradeLists).forEach(filename => {
      const metrics = allMetrics[filename];
      const dailyReturns: number[] = [];
      let prevEquity = 0;
      const equityByDate = new Map();
      metrics.tradeData.forEach((trade: any) => {
        const key = getDateKey(trade.date);
        if (!equityByDate.has(key)) equityByDate.set(key, 0);
        equityByDate.set(key, equityByDate.get(key) + trade.equity);
      });
      Array.from(equityByDate.keys()).sort().forEach(date => {
        const dailyEquity = equityByDate.get(date);
        const returnPct = prevEquity !== 0 ? (dailyEquity / prevEquity) * 100 : 0;
        dailyReturns.push(returnPct);
        prevEquity += dailyEquity;
      });
      returnsMap.set(filename, dailyReturns);
    });
    return returnsMap;
  }, [allMetrics, selectedTradeLists]);

  return { portfolioData, individualChartsData, dailyReturnsMap };
};

export default usePortfolio;