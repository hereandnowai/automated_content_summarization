import React, { useState } from 'react';
import { COMPANY_LOGO_URL } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
  showBackButton: boolean;
  onBackToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBackButton, onBackToHome }) => {
  const { theme, toggleTheme } = useTheme();
  const { t, currentLanguage, changeLanguage, availableLanguages, direction } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 dark:from-teal-700 dark:via-cyan-700 dark:to-sky-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2 sm:mb-0">
          <img src={COMPANY_LOGO_URL} alt={t('companyName')} className="h-12 w-12 rounded-full border-2 border-white" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t('companyName')}</h1>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {showBackButton && (
            <button
              onClick={onBackToHome}
              title={t('header.backToHome')}
              aria-label={t('header.backToHome')}
              className="p-2 px-3 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium flex items-center space-x-2 rtl:space-x-reverse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${direction === 'rtl' ? 'transform scale-x-[-1]' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span>{t('header.home')}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title={t('header.languageSelectorLabel')}
              aria-label={t('header.languageSelectorLabel')}
              aria-haspopup="true"
              aria-expanded={langDropdownOpen}
              className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.289 7.5 15.5 7.5c1.21 0 2.32-.439 3.166-.936V3M9 21v-1.5M12 11.25C10.818 10.152 9.24 9.563 7.5 9.563S4.182 10.152 3 11.25m9 0a4.509 4.509 0 003.75 1.518c2.086 0 3.841-.894 4.128-2.146M12 11.25L9.75 9m3 2.25L14.25 9" />
              </svg>
            </button>
            {langDropdownOpen && (
              <div className={`absolute ${direction === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5`}>
                {Object.entries(availableLanguages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      changeLanguage(code as keyof typeof availableLanguages);
                      setLangDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === code 
                        ? (theme === 'light' ? 'bg-teal-100 text-teal-700' : 'bg-teal-700 text-white')
                        : (theme === 'light' ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-slate-700')
                    }`}
                    role="menuitem"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            title={theme === 'light' ? t('header.switchToDarkMode') : t('header.switchToLightMode')}
            aria-label={theme === 'light' ? t('header.switchToDarkMode') : t('header.switchToLightMode')}
            className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};