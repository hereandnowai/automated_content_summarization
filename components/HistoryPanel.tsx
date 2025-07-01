import React from 'react';
import { HistoryEntry, OutputFormat, SummaryLength } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onViewItem: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onViewItem,
  onClearHistory,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const formatDate = (timestamp: number) => {
    // Intl.DateTimeFormat can be used for locale-specific date formatting
    // For simplicity, keeping toLocaleString() which uses system locale.
    // For full control, use Intl.DateTimeFormat with currentLanguage from context.
    return new Date(timestamp).toLocaleString();
  };

  const titleColor = theme === 'light' ? 'text-[#B9375E]' : 'text-teal-300';
  const closeButtonFocusRing = theme === 'light' ? 'focus:ring-[#B9375E]' : 'dark:focus:ring-teal-600';
  const loadButtonClasses = theme === 'light' 
    ? 'bg-[#B9375E] hover:bg-[#a32f51] focus:ring-[#B9375E]'
    : 'bg-teal-600 hover:bg-teal-700 dark:focus:ring-offset-slate-700 focus:ring-teal-500';
  const itemBgColor = theme === 'light' ? 'bg-slate-50' : 'dark:bg-slate-700';

  const noHistoryTextColor = theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400';
  const timestampTextColor = theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400';
  const contentPreviewTextColor = theme === 'light' ? 'text-slate-800' : 'dark:text-slate-300';
  const contentPreviewStrongTextColor = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-300'; 
  const detailsTextColor = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-400';


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-panel-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 id="history-panel-title" className={`text-xl font-semibold ${titleColor}`}>{t('historyPanel.title')}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 ${closeButtonFocusRing}`}
            aria-label={t('historyPanel.closeAlt') as string}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          {history.length === 0 ? (
            <p className={`${noHistoryTextColor} text-center py-8`}>{t('historyPanel.noHistory')}</p>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className={`${itemBgColor} p-4 rounded-lg shadow hover:shadow-md transition-shadow`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                  <p className={`text-xs ${timestampTextColor} font-medium`}>{formatDate(entry.timestamp)}</p>
                  <button
                    onClick={() => onViewItem(entry)}
                    className={`mt-2 sm:mt-0 text-white text-xs font-semibold py-1.5 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition duration-150 ${loadButtonClasses} ${theme === 'light' ? 'focus:ring-offset-slate-50' : 'dark:focus:ring-offset-slate-700'}`}
                    aria-label={t('historyPanel.loadSummaryAlt', { timestamp: formatDate(entry.timestamp) }) as string}
                  >
                    {t('historyPanel.loadSummary')}
                  </button>
                </div>
                <p className={`text-sm ${contentPreviewTextColor} mb-1 truncate`} title={entry.content}>
                  <strong className={`font-medium ${contentPreviewStrongTextColor}`}>{t('historyPanel.contentPrefix')}</strong> {entry.content.substring(0, 100)}{entry.content.length > 100 ? '...' : ''}
                </p>
                <p className={`text-xs ${detailsTextColor}`}>
                  <strong className="font-medium">{t('historyPanel.formatPrefix')}</strong> {t(`outputFormatOptions.${Object.keys(OutputFormat).find(k => OutputFormat[k as keyof typeof OutputFormat] === entry.outputFormat) || 'PARAGRAPH'}`)} | <strong className="font-medium">{t('historyPanel.lengthPrefix')}</strong> {t(`summaryLengthOptions.${Object.keys(SummaryLength).find(k => SummaryLength[k as keyof typeof SummaryLength] === entry.summaryLength) || 'STANDARD'}`)}
                </p>
                {entry.focusArea && (
                  <p className={`text-xs ${detailsTextColor}`}>
                    <strong className="font-medium">{t('historyPanel.focusPrefix')}</strong> {entry.focusArea}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <footer className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              onClick={onClearHistory}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800 transition duration-150"
              aria-label={t('historyPanel.clearHistoryAlt') as string}
            >
              {t('historyPanel.clearHistory')}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};