import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header.tsx';
import UploadSection from './components/UploadSection.tsx';
import ErrorList from './components/ErrorList.tsx';
import UploadedFilesList from './components/UploadedFilesList.tsx';
import AnalyticsControls from './components/AnalyticsControls.tsx';
import PortfolioSection from './components/PortfolioSection.tsx';
import CorrelationSection from './components/CorrelationSection.tsx';
import MetricsTable from './components/MetricsTable.tsx';
import SessionComplete from './components/SessionComplete.tsx';
import useMetrics from './hooks/useMetrics.ts';
import usePortfolio from './hooks/usePortfolio.ts';
import useSorting from './hooks/useSorting.ts';
import useContractMultipliers from './hooks/useContractMultipliers.ts';
import { parseCSV, processCurrencyColumns, buildCorrelationMatrix } from './utils/dataUtils.ts';

interface CleanedData {
  [key: string]: {
    header: string[];
    data: (string | number)[][];
    rowCount: number;
    columnCount: number;
  };
}

const App = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [cleanedData, setCleanedData] = useState<CleanedData>({});
  const [processing, setProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showMetrics, setShowMetrics] = useState<boolean>(false);
  const [showPortfolio, setShowPortfolio] = useState<boolean>(false);
  const [showCorrelation, setShowCorrelation] = useState<boolean>(false);
  const [selectedTradeLists, setSelectedTradeLists] = useState<Set<string>>(new Set<string>());
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [chartType, setChartType] = useState<string>('equity');
  const [normalizeEquity, setNormalizeEquity] = useState<boolean>(false);
  const [startingCapital, setStartingCapital] = useState<number>(1000000);
  const [showUploadedFiles, setShowUploadedFiles] = useState<boolean>(false);
  const [correlationThreshold, setCorrelationThreshold] = useState<number>(0.5);
  const [correlationMatrix, setCorrelationMatrix] = useState<{ matrix: number[][]; strategies: string[]; size: number } | null>(null);
  const [correlationCalculating, setCorrelationCalculating] = useState<boolean>(false);

  const { contractMultipliers, masterContractValue, setMasterContractValue, handleContractChange, applyMasterToAll } = useContractMultipliers();
  const { sortConfig, sortPriorities, showAdvancedSort, setShowAdvancedSort, handleSort, addSortPriority, removeSortPriority, updateSortPriority, clearSorting, applyAdvancedSort } = useSorting();
  const { allMetrics, sortedAndFilteredMetrics } = useMetrics(cleanedData, contractMultipliers, sortConfig, sortPriorities);
  const { portfolioData, individualChartsData, dailyReturnsMap } = usePortfolio(allMetrics || {}, selectedTradeLists, dateRange, normalizeEquity, startingCapital, contractMultipliers);

  // Correlation matrix computation
  useEffect(() => {
    if (showCorrelation && selectedTradeLists.size >= 2) {
      setCorrelationCalculating(true);
      const matrix = buildCorrelationMatrix(dailyReturnsMap, selectedTradeLists);
      setCorrelationMatrix(matrix);
      setCorrelationCalculating(false);
    }
  }, [showCorrelation, selectedTradeLists, dailyReturnsMap]);

  // Dynamically load GoHighLevel iframe and script to avoid React DOM conflicts
  useEffect(() => {
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.5minfutures.com/widget/form/l3khVe6UJotvm6ZyPj1n';
    iframe.style.cssText = 'display:none;width:100%;height:100%;border:none;border-radius:3px';
    iframe.id = 'popup-l3khVe6UJotvm6ZyPj1n';
    iframe.setAttribute('data-layout', "{'id':'POPUP'}");
    iframe.setAttribute('data-trigger-type', 'showAfter');
    iframe.setAttribute('data-trigger-value', '10'); // Immediate display
    iframe.setAttribute('data-activation-type', 'alwaysActivated');
    iframe.setAttribute('data-activation-value', '');
    iframe.setAttribute('data-deactivation-type', 'leadCollected');
    iframe.setAttribute('data-deactivation-value', '');
    iframe.setAttribute('data-form-name', 'Trading Form ');
    iframe.setAttribute('data-height', '340');
    iframe.setAttribute('data-layout-iframe-id', 'popup-l3khVe6UJotvm6ZyPj1n');
    iframe.setAttribute('data-form-id', 'l3khVe6UJotvm6ZyPj1n');
    iframe.title = 'Trading Form ';
    document.body.appendChild(iframe);

    // Load script
    const script = document.createElement('script');
    script.src = 'https://www.5minfutures.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFileUpload = useCallback(async (selectedFiles: File[]) => {
    setProcessing(true);
    setErrors([]);
    const newCleanedData: CleanedData = { ...cleanedData };
    for (const file of selectedFiles) {
      try {
        const content = await readFileContent(file);
        const parsed = parseCSV(content);
        const processed = processCurrencyColumns(parsed.data, parsed.header);
        newCleanedData[file.name] = {
          header: parsed.header,
          data: processed,
          rowCount: processed.length,
          columnCount: parsed.header.length
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setErrors(prev => [...prev, `Error processing ${file.name}: ${errorMessage}`]);
      }
    }
    setCleanedData(newCleanedData);
    setProcessing(false);
  }, [cleanedData]);

  const removeFile = (filename: string) => {
    setFiles(prev => prev.filter(f => f.name !== filename));
    setCleanedData(prev => {
      const updated = { ...prev };
      delete updated[filename];
      return updated;
    });
    setSelectedTradeLists(prev => {
      const newSet = new Set(prev);
      newSet.delete(filename);
      return newSet;
    });
  };

  const exportCleanedData = (filename: string) => {
    const data = cleanedData[filename];
    if (!data) return;
    try {
      const csvContent = [
        data.header.join(','),
        ...data.data.map(row => row.map(cell => {
          if (cell === null || cell === undefined) return '';
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(','))
      ].join('\n');
      const element = document.createElement('a');
      const fileBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      element.href = URL.createObjectURL(fileBlob);
      element.download = `cleaned_${filename}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setTimeout(() => URL.revokeObjectURL(element.href), 1000);
    } catch (error) {
      console.error('Download failed:', error);
      const csvContent = [
        data.header.join(','),
        ...data.data.map(row => row.join(','))
      ].join('\n');
      navigator.clipboard.writeText(csvContent).then(() => {
        alert('Download failed, but data has been copied to clipboard. Paste it into a text file and save as .csv');
      }).catch(() => {
        alert('Download failed. Please check browser settings or try a different browser.');
      });
    }
  };

  const toggleTradeListSelection = (filename: string) => {
    setSelectedTradeLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filename)) {
        newSet.delete(filename);
      } else {
        newSet.add(filename);
      }
      return newSet;
    });
  };

  const fetchFromSupabase = async () => {
    setProcessing(true);
    setErrors([]);

    try {
      const { data, error } = await supabase
        .from('csv_files')
        .select('filename, file_content');

      if (error) throw error;

      const supabaseFiles = data.map(row => 
        new File([row.file_content], row.filename, { type: 'text/csv' })
      );

      const existingFilenames = new Set(files.map(f => f.name));
      const duplicates = supabaseFiles.filter(f => existingFilenames.has(f.name));
      const duplicateNames = new Set(duplicates.map(d => d.name));

      if (duplicates.length > 0) {
        const overwrite = window.confirm(
          `The following files already exist: ${duplicates.map(f => f.name).join(', ')}. Overwrite?`
        );

        if (overwrite) {
          setFiles(prev => [
            ...prev.filter(f => !duplicateNames.has(f.name)),
            ...supabaseFiles
          ]);
          await handleFileUpload(supabaseFiles);
        } else {
          const newFiles = supabaseFiles.filter(f => !existingFilenames.has(f.name));
          if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles]);
            await handleFileUpload(newFiles);
          }
        }
      } else {
        setFiles(prev => [...prev, ...supabaseFiles]);
        await handleFileUpload(supabaseFiles);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => [...prev, `Supabase fetch error: ${errorMessage}`]);
    } finally {
      setProcessing(false);
    }
  };

  const exportCorrelationData = () => {
    if (!correlationMatrix) return;
    const { matrix, strategies } = correlationMatrix;
    const headers = ['Strategy 1', 'Strategy 2', 'Correlation', 'Sample Size', 'Period'];
    const rows: (string | number)[][] = [];
    for (let i = 0; i < strategies.length; i++) {
      for (let j = i + 1; j < strategies.length; j++) {
        const strategy1 = strategies[i].replace('.csv', '');
        const strategy2 = strategies[j].replace('.csv', '');
        const correlation = matrix[i][j];
        rows.push([
          strategy1,
          strategy2,
          correlation.toFixed(4),
          dailyReturnsMap.get(strategies[i])?.length || 0,
          `${dateRange.start || 'All'} to ${dateRange.end || 'All'}`
        ]);
      }
    }
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    const element = document.createElement('a');
    const fileBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = 'correlation_data.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
      <Header />
      <UploadSection onFileChange={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          handleFileUpload(Array.from(target.files));
        }
      }} onFetchSupabase={fetchFromSupabase} processing={processing} />
      {errors.length > 0 && <ErrorList errors={errors} />}
      {files.length > 0 && <UploadedFilesList files={files} cleanedData={cleanedData} errors={errors} onRemove={removeFile} onExport={exportCleanedData} show={showUploadedFiles} onToggle={setShowUploadedFiles} />}
      {Object.keys(cleanedData).length > 0 && <AnalyticsControls showMetrics={showMetrics} setShowMetrics={setShowMetrics} showPortfolio={showPortfolio} setShowPortfolio={setShowPortfolio} showCorrelation={showCorrelation} setShowCorrelation={setShowCorrelation} />}
      {showPortfolio && allMetrics && Object.keys(allMetrics).length > 0 && <PortfolioSection allMetrics={allMetrics} selectedTradeLists={selectedTradeLists} toggleSelection={toggleTradeListSelection} dateRange={dateRange} setDateRange={setDateRange} chartType={chartType} setChartType={setChartType} normalizeEquity={normalizeEquity} setNormalizeEquity={setNormalizeEquity} startingCapital={startingCapital} setStartingCapital={setStartingCapital} portfolioData={portfolioData} individualChartsData={individualChartsData} showMetrics={showMetrics} sortedAndFilteredMetrics={sortedAndFilteredMetrics} contractMultipliers={contractMultipliers} handleContractChange={handleContractChange} masterContractValue={masterContractValue} setMasterContractValue={setMasterContractValue} applyMasterToAll={applyMasterToAll} sortConfig={sortConfig} handleSort={handleSort} sortPriorities={sortPriorities} showAdvancedSort={showAdvancedSort} setShowAdvancedSort={setShowAdvancedSort} addSortPriority={addSortPriority} removeSortPriority={removeSortPriority} updateSortPriority={updateSortPriority} clearSorting={clearSorting} applyAdvancedSort={applyAdvancedSort} />}
      {showCorrelation && allMetrics && Object.keys(allMetrics).length > 0 && <CorrelationSection selectedTradeLists={selectedTradeLists} dailyReturnsMap={dailyReturnsMap} correlationThreshold={correlationThreshold} setCorrelationThreshold={setCorrelationThreshold} correlationMatrix={correlationMatrix} correlationCalculating={correlationCalculating} onExport={exportCorrelationData} allMetrics={allMetrics} />}
      {showMetrics && !showPortfolio && Object.keys(cleanedData).length > 0 && allMetrics && Object.keys(allMetrics).length > 0 && <MetricsTable sortedAndFilteredMetrics={sortedAndFilteredMetrics} selectedTradeLists={selectedTradeLists} toggleSelection={toggleTradeListSelection} contractMultipliers={contractMultipliers} handleContractChange={handleContractChange} masterContractValue={masterContractValue} setMasterContractValue={setMasterContractValue} applyMasterToAll={applyMasterToAll} sortConfig={sortConfig} handleSort={handleSort} sortPriorities={sortPriorities} showAdvancedSort={showAdvancedSort} setShowAdvancedSort={setShowAdvancedSort} addSortPriority={addSortPriority} removeSortPriority={removeSortPriority} updateSortPriority={updateSortPriority} clearSorting={clearSorting} applyAdvancedSort={applyAdvancedSort} />}
      {Object.keys(cleanedData).length > 0 && <SessionComplete />}
    </div>
  );
};

export default App;