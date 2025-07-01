import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-600 dark:text-red-300 px-4 py-3 rounded-md relative" role="alert">
      <strong className="font-bold">{t('errorMessage.prefix')}</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};