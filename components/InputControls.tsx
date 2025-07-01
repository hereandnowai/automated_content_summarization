import React from 'react';
import { SummaryLength, OutputFormat } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface InputControlsProps {
  content: string;
  setContent: (value: string) => void;
  summaryLength: SummaryLength;
  setSummaryLength: (value: SummaryLength) => void;
  outputFormat: OutputFormat;
  setOutputFormat: (value: OutputFormat) => void;
  focusArea: string;
  setFocusArea: (value: string) => void;
  onSummarize: () => void;
  isLoading: boolean;
  apiKeyAvailable: boolean;
}

export const InputControls: React.FC<InputControlsProps> = ({
  content,
  setContent,
  summaryLength,
  setSummaryLength,
  outputFormat,
  setOutputFormat,
  focusArea,
  setFocusArea,
  onSummarize,
  isLoading,
  apiKeyAvailable
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const buttonClasses = theme === 'light' 
    ? 'bg-[#B9375E] hover:bg-[#a32f51] focus:ring-[#B9375E]'
    : 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500 dark:focus:ring-offset-slate-800';
  
  const inputFocusClasses = theme === 'light'
    ? 'focus:ring-[#B9375E] focus:border-[#B9375E]'
    : 'dark:focus:ring-teal-500 dark:focus:border-teal-500';

  const labelTextClasses = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-300';
  const inputTextClasses = theme === 'light' ? 'text-slate-900 placeholder-slate-500' : 'dark:text-slate-200 dark:placeholder-slate-500';
  const inputBgClasses = theme === 'light' ? 'bg-slate-50' : 'dark:bg-slate-700';


  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="content" className={`block text-sm font-medium ${labelTextClasses} mb-1`}>
          {t('inputControls.pasteContentLabel')}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className={`w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm ${inputBgClasses} ${inputTextClasses} transition duration-150 ease-in-out ${inputFocusClasses}`}
          placeholder={t('inputControls.pasteContentPlaceholder')}
          aria-label={t('inputControls.pasteContentLabel')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="summaryLength" className={`block text-sm font-medium ${labelTextClasses} mb-1`}>
            {t('inputControls.summaryLengthLabel')}
          </label>
          <select
            id="summaryLength"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value as SummaryLength)}
            className={`w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm ${inputBgClasses} ${inputTextClasses} transition duration-150 ease-in-out ${inputFocusClasses}`}
            aria-label={t('inputControls.selectSummaryLength')}
          >
            {Object.keys(SummaryLength).map((key) => (
              <option key={key} value={SummaryLength[key as keyof typeof SummaryLength]}>
                {t(`summaryLengthOptions.${key}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="outputFormat" className={`block text-sm font-medium ${labelTextClasses} mb-1`}>
            {t('inputControls.outputFormatLabel')}
          </label>
          <select
            id="outputFormat"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className={`w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm ${inputBgClasses} ${inputTextClasses} transition duration-150 ease-in-out ${inputFocusClasses}`}
            aria-label={t('inputControls.selectOutputFormat')}
          >
             {Object.keys(OutputFormat).map((key) => (
              <option key={key} value={OutputFormat[key as keyof typeof OutputFormat]}>
                {t(`outputFormatOptions.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="focusArea" className={`block text-sm font-medium ${labelTextClasses} mb-1`}>
          {t('inputControls.focusAreaLabel')}
        </label>
        <input
          type="text"
          id="focusArea"
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className={`w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm ${inputBgClasses} ${inputTextClasses} transition duration-150 ease-in-out ${inputFocusClasses}`}
          placeholder={t('inputControls.focusAreaPlaceholder')}
          aria-label={t('inputControls.focusAreaLabel')}
        />
      </div>

      <button
        onClick={onSummarize}
        disabled={isLoading || !content.trim() || !apiKeyAvailable}
        className={`w-full text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
        aria-live="polite"
      >
        {isLoading ? t('inputControls.summarizingButton') : t('inputControls.summarizeButton')}
      </button>
      {!apiKeyAvailable && (
        <p className="text-xs text-red-600 dark:text-red-400 text-center mt-2" role="status">
          {t('inputControls.apiKeyNotConfigured')}
        </p>
      )}
    </div>
  );
};