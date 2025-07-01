import { useLanguage } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { t, currentLanguage, direction, changeLanguage, availableLanguages } = useLanguage();
  return { t, currentLanguage, direction, changeLanguage, availableLanguages };
};
