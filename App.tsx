import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InputControls } from './components/InputControls';
import { SummaryOutput } from './components/SummaryOutput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { HistoryPanel } from './components/HistoryPanel';
import { Homepage } from './components/Homepage';
import { SummaryLength, OutputFormat, SummarizationResult, HistoryEntry } from './types';
import { summarizeContent } from './services/geminiService';
import { useTheme } from './contexts/ThemeContext';
import { useTranslation } from './hooks/useTranslation';

const MAX_HISTORY_ITEMS = 20;
const LOCAL_STORAGE_HISTORY_KEY = 'summarizationHistory';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [summaryLength, setSummaryLength] = useState<SummaryLength>(SummaryLength.STANDARD);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OutputFormat.PARAGRAPH);
  const [focusArea, setFocusArea] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummarizationResult | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  const [showHomepage, setShowHomepage] = useState<boolean>(true);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY && process.env.API_KEY !== "YOUR_API_KEY_HERE" && process.env.API_KEY.length > 10) {
            setApiKeyAvailable(true);
        } else {
            setApiKeyAvailable(false);
            // setError(t('inputControls.errorApiKeyMissing')); // Optionally set error here if not handled elsewhere
        }
    } catch (e: any) {
        setApiKeyAvailable(false);
        console.error("API Key check error:", e);
    }

    const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory) as HistoryEntry[];
        setHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse history from localStorage:", e);
        localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY); 
      }
    }
  }, [t]);

  const handleSummarize = useCallback(async () => {
    if (!content.trim()) {
      setError(t('inputControls.errorContentRequired'));
      setResult(null);
      return;
    }
    if (!apiKeyAvailable) {
      setError(t('inputControls.errorApiKeyMissing'));
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const summaryResult = await summarizeContent(content, summaryLength, outputFormat, focusArea);
      setResult(summaryResult);

      const newHistoryEntry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content,
        summaryLength,
        outputFormat,
        focusArea,
        result: summaryResult,
      };
      setHistory(prevHistory => {
        const updatedHistory = [newHistoryEntry, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (e: any) {
      console.error("Summarization error in App:", e);
      // Map specific error messages if needed, otherwise show raw error or a generic one
      if (e.message === "Gemini API Key is not configured. Please set the API_KEY environment variable.") {
        setError(t('inputControls.errorApiKeyMissing'));
      } else {
        setError(e.message || "Failed to generate summary. Please check console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [content, summaryLength, outputFormat, focusArea, apiKeyAvailable, t]);

  const toggleHistoryPanel = () => {
    setShowHistoryPanel(prev => !prev);
  };

  const handleViewHistoryItem = (entry: HistoryEntry) => {
    setContent(entry.content);
    setSummaryLength(entry.summaryLength);
    setOutputFormat(entry.outputFormat);
    setFocusArea(entry.focusArea);
    setResult(entry.result);
    setError(null);
    setShowHistoryPanel(false);
    setShowHomepage(false); 
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  };

  const handleGetStarted = () => {
    setShowHomepage(false);
  };

  const handleGoToHomepage = () => {
    setShowHomepage(true);
  };
  
  const usageInstructions = t('homepage.usageInstructions') as unknown as string[];


  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-200'
      }`}
    >
      <Header showBackButton={!showHomepage} onBackToHome={handleGoToHomepage} />
      
      {showHomepage ? (
        <Homepage onGetStarted={handleGetStarted} />
      ) : (
        <>
          <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            <section aria-labelledby="input-section-title" className={`p-6 rounded-xl shadow-lg flex flex-col space-y-6 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'dark:bg-slate-800 dark:text-slate-200'}`}>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h2 id="input-section-title" className={`text-xl font-semibold ${theme === 'light' ? 'text-[#B9375E]' : 'text-teal-400'}`}>{t('homepage.howToUseTitle')}</h2>
                <ul className={`list-disc ps-5 space-y-1 ${theme === 'light' ? 'text-slate-700' : 'dark:text-slate-300'}`}>
                  {usageInstructions.map((instr: string, index: number) => (
                    <li key={index}>{instr}</li>
                  ))}
                </ul>
                <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-[#B9375E]' : 'text-teal-400'} mt-4`}>{t('homepage.exampleInteractionTitle')}</h3>
                <p className={`whitespace-pre-line text-xs italic ${theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400'}`}>{t('homepage.exampleInteraction')}</p>
              </div>
              <InputControls
                content={content}
                setContent={setContent}
                summaryLength={summaryLength}
                setSummaryLength={setSummaryLength}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                focusArea={focusArea}
                setFocusArea={setFocusArea}
                onSummarize={handleSummarize}
                isLoading={isLoading}
                apiKeyAvailable={apiKeyAvailable}
              />
            </section>

            <section aria-labelledby="output-section-title" className={`p-6 rounded-xl shadow-lg flex flex-col sticky top-6 min-h-[calc(100vh-100px)] md:min-h-0 ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'dark:bg-slate-800 dark:text-slate-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 id="output-section-title" className={`text-2xl font-semibold ${theme === 'light' ? 'text-[#B9375E]' : 'text-teal-400'}`}>{t('summaryOutput.title')}</h2>
                <button
                  onClick={toggleHistoryPanel}
                  title={t('common.viewHistory')}
                  aria-label={t('common.viewHistory')}
                  className={`p-2 rounded-full ${theme === 'light' ? 'text-[#B9375E] hover:bg-pink-100 focus:ring-[#B9375E]' : 'text-teal-400 hover:bg-slate-700 focus:ring-teal-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'light' ? 'dark:focus:ring-offset-slate-50' : 'dark:focus:ring-offset-slate-800' }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto pe-1"> {/* Adjusted pr-1 to pe-1 for RTL */}
                {isLoading && <LoadingSpinner />}
                {error && !isLoading && <ErrorMessage message={error} />}
                {!isLoading && !error && !result && (
                  <div className={`flex flex-col items-center justify-center text-center p-8 h-full ${theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 mb-4 ${theme === 'light' ? 'text-slate-500' : 'dark:text-slate-500'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <h3 className={`text-xl font-semibold ${theme === 'light' ? 'text-slate-700' : 'dark:text-slate-300'} mb-2`}>{t('summaryOutput.placeholderTitle')}</h3>
                    <p>{t('summaryOutput.placeholderLine1')}</p>
                    <p>{t('summaryOutput.placeholderLine2')}</p>
                  </div>
                )}
                {result && !isLoading && !error && <SummaryOutput result={result} />}
              </div>
            </section>
          </main>
          {showHistoryPanel && (
            <HistoryPanel
              history={history}
              onViewItem={handleViewHistoryItem}
              onClearHistory={handleClearHistory}
              onClose={toggleHistoryPanel}
            />
          )}
        </>
      )}
      <footer className={`text-center p-4 text-sm border-t mt-auto ${
         theme === 'light' ? 'text-[#B9375E] border-slate-300' : 'text-slate-400 border-slate-700'
      }`}>
        {t('footer.copyright')}
      </footer>
    </div>
  );
};

export default App;