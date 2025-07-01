import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

export const LoadingSpinner: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const borderColor = theme === 'light' ? 'border-[#B9375E]' : 'dark:border-teal-400';
  const textColor = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-400';

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 ${borderColor}`}></div>
      <p className={`mt-4 ${textColor}`}>{t('loadingSpinner.message')}</p>
    </div>
  );
};