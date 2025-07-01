import React from 'react';
import { SummarizationResult } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface SummaryOutputProps {
  result: SummarizationResult;
}

const OutputSection: React.FC<{ titleKey: string; children: React.ReactNode }> = ({ titleKey, children }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const titleColor = theme === 'light' ? 'text-[#B9375E]' : 'text-teal-400';
  const borderColor = theme === 'light' ? 'border-[#e7b6c5]' : 'dark:border-teal-700';
  const bgColor = theme === 'light' ? 'bg-slate-50' : 'dark:bg-slate-700';


  return (
    <div className={`mb-6 p-4 ${bgColor} rounded-lg shadow`}>
      <h3 className={`text-lg font-semibold ${titleColor} mb-2 border-b ${borderColor} pb-1`}>{t(titleKey)}</h3>
      {children}
    </div>
  );
};

export const SummaryOutput: React.FC<SummaryOutputProps> = ({ result }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const baseTextColor = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-300';
  const italicTextColor = theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400';


  const renderList = (items?: string[]) => {
    if (!items || items.length === 0) return <p className={`text-sm ${italicTextColor} italic`}>{t('summaryOutput.noneProvided')}</p>;
    return (
      <ul className={`list-disc list-inside ps-5 space-y-1 text-sm ${baseTextColor}`}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pe-2"> {/* Changed pr-2 to pe-2 for RTL */}
      <OutputSection titleKey="summaryOutput.generatedSummary">
        <p className={`text-sm ${baseTextColor} whitespace-pre-wrap leading-relaxed`}>{result.summary}</p>
      </OutputSection>

      {result.keyInsights && result.keyInsights.length > 0 && (
        <OutputSection titleKey="summaryOutput.keyInsights">
          {renderList(result.keyInsights)}
        </OutputSection>
      )}

      {result.actionableItems && result.actionableItems.length > 0 && (
        <OutputSection titleKey="summaryOutput.actionableItems">
          {renderList(result.actionableItems)}
        </OutputSection>
      )}

      {result.suggestedQuestions && result.suggestedQuestions.length > 0 && (
        <OutputSection titleKey="summaryOutput.suggestedQuestions">
          {renderList(result.suggestedQuestions)}
        </OutputSection>
      )}
    </div>
  );
};