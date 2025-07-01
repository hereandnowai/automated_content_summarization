import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { translations, LocaleTranslations, Translations } from '../translations';

type LanguageCode = keyof typeof translations;
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  changeLanguage: (langCode: LanguageCode) => void;
  t: (key: string, replacements?: Record<string, string>) => string | string[]; // Updated return type
  direction: Direction;
  availableLanguages: LocaleTranslations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'summarizationAppLanguage';

const getInitialLanguage = (): LanguageCode => {
  try {
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode;
    if (storedLang && translations[storedLang]) {
      return storedLang;
    }
    // Fallback to browser preference if available and supported
    const browserLang = navigator.language.split('-')[0] as LanguageCode;
    if (translations[browserLang]) {
      return browserLang;
    }
  } catch (error) {
    console.error("Error reading language from localStorage", error);
  }
  return 'en'; // Default language
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(getInitialLanguage());
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    const newDirection: Direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = newDirection;
    setDirection(newDirection);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    } catch (error) {
      console.error("Error saving language to localStorage", error);
    }
  }, [currentLanguage]);

  const changeLanguage = useCallback((langCode: LanguageCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
    } else {
      console.warn(`Language code "${langCode}" not found in translations. Defaulting to 'en'.`);
      setCurrentLanguage('en');
    }
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string>): string | string[] => {
    const langStrings = translations[currentLanguage]?.strings || translations.en.strings;
    const fallbackStrings = translations.en.strings;
    const pathKeys = key.split('.');

    let textNode: any = langStrings;
    for (const pKey of pathKeys) {
        if (textNode && typeof textNode === 'object' && pKey in textNode) {
            textNode = textNode[pKey];
        } else {
            textNode = undefined;
            break;
        }
    }

    if (textNode === undefined) {
        let fallbackNode: any = fallbackStrings;
        for (const pKey of pathKeys) {
            if (fallbackNode && typeof fallbackNode === 'object' && pKey in fallbackNode) {
                fallbackNode = fallbackNode[pKey];
            } else {
                fallbackNode = undefined;
                break;
            }
        }
        textNode = fallbackNode;
    }

    if (typeof textNode === 'string') {
        let resultString = textNode;
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                resultString = resultString.replace(`{${placeholder}}`, replacements[placeholder]);
            });
        }
        return resultString;
    } else if (Array.isArray(textNode) && textNode.every(item => typeof item === 'string')) {
        // Replacements are typically not applied to array items by a simple t function.
        // If needed, each item would have to be processed or a different t_array function used.
        return textNode as string[];
    }
    
    // Fallback: if not a string or string[], or if it's undefined, return the key itself.
    // This handles cases where the key points to a deeper object (partial key) or is missing.
    return key;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, direction, availableLanguages: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};