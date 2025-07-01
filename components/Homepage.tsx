import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface HomepageProps {
  onGetStarted: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onGetStarted }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const heroTitleColor = theme === 'light' ? 'text-[#B9375E]' : 'dark:text-teal-300';
  const heroParagraphColor = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-400';
  const getStartedButtonBg = theme === 'light' ? 'bg-[#B9375E] hover:bg-[#a32f51]' : 'dark:bg-teal-500 dark:hover:bg-teal-600';
  
  const keyFeaturesTitleColor = theme === 'light' ? 'text-[#B9375E]' : 'dark:text-sky-400';
  const featureIconColor = theme === 'light' ? 'text-[#B9375E]' : ''; 
  const featureCardTitleColor = theme === 'light' ? 'text-slate-800' : 'dark:text-slate-300';
  const featureCardTextColor = theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400';
  
  const howToUseTitleColor = theme === 'light' ? 'text-[#B9375E]' : 'dark:text-teal-300';
  const howToUseSectionTextColor = theme === 'light' ? 'text-slate-900' : 'dark:text-slate-200';
  const howToUseListTextColor = theme === 'light' ? 'text-slate-700' : 'dark:text-slate-300';
  const exampleTitleColor = theme === 'light' ? 'text-[#B9375E]' : 'dark:text-teal-400';
  const exampleTextColor = theme === 'light' ? 'text-slate-600' : 'dark:text-slate-400';

  const cardBgColor = theme === 'light' ? 'bg-slate-50' : 'dark:bg-slate-800';
  const cardOuterTextColor = theme === 'light' ? 'text-slate-900' : 'dark:text-slate-200';

  // Cast to string[] as t() might return string | object if key is mistyped
  const usageInstructions = t('homepage.usageInstructions') as unknown as string[];


  return (
    <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center text-center">
      {/* Hero Section */}
      <section className="py-10 md:py-12 w-full">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${heroTitleColor} mb-4 animate-fade-in-down`}>
          {t('homepage.title')}
        </h1>
        <p className={`text-md sm:text-lg md:text-xl ${heroParagraphColor} mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-300`}>
          {t('homepage.subtitle')}
        </p>
        <button
          onClick={onGetStarted}
          className={`${getStartedButtonBg} text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg animate-bounce-custom animation-delay-600`}
          aria-label={t('homepage.getStarted')}
        >
          {t('homepage.getStarted')}
        </button>
      </section>

      {/* Key Features Section */}
      <section className="py-10 md:py-12 w-full max-w-5xl">
        <h2 className={`text-2xl sm:text-3xl font-bold ${keyFeaturesTitleColor} mb-8 sm:mb-10`}>{t('homepage.keyFeaturesTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Feature Card 1 */}
          <div className={`${cardBgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center ${cardOuterTextColor}`}>
            <div className={`text-4xl mb-3 ${featureIconColor || 'text-teal-500 dark:text-teal-400'}`} role="img" aria-label="Sparkles emoji">✨</div>
            <h3 className={`text-lg sm:text-xl font-semibold ${featureCardTitleColor} mb-2`}>{t('homepage.feature1Title')}</h3>
            <p className={`text-sm ${featureCardTextColor}`}>{t('homepage.feature1Text')}</p>
          </div>
          {/* Feature Card 2 */}
          <div className={`${cardBgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center ${cardOuterTextColor}`}>
            <div className={`text-4xl mb-3 ${featureIconColor || 'text-sky-500 dark:text-sky-400'}`} role="img" aria-label="Target emoji">🎯</div>
            <h3 className={`text-lg sm:text-xl font-semibold ${featureCardTitleColor} mb-2`}>{t('homepage.feature2Title')}</h3>
            <p className={`text-sm ${featureCardTextColor}`}>{t('homepage.feature2Text')}</p>
          </div>
          {/* Feature Card 3 */}
          <div className={`${cardBgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center ${cardOuterTextColor}`}>
            <div className={`text-4xl mb-3 ${featureIconColor || 'text-cyan-500 dark:text-cyan-400'}`} role="img" aria-label="Lightbulb emoji">💡</div>
            <h3 className={`text-lg sm:text-xl font-semibold ${featureCardTitleColor} mb-2`}>{t('homepage.feature3Title')}</h3>
            <p className={`text-sm ${featureCardTextColor}`}>{t('homepage.feature3Text')}</p>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className={`py-10 md:py-12 bg-teal-50 dark:bg-teal-900/30 w-full mt-8 ${howToUseSectionTextColor}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 id="how-to-use-title" className={`text-2xl sm:text-3xl font-bold ${howToUseTitleColor} mb-8`}>{t('homepage.howToUseTitle')}</h2>
          <div className={`${cardBgColor} p-6 md:p-8 rounded-xl shadow-lg text-left rtl:text-right`}>
            <div className="prose prose-md max-w-none dark:prose-invert">
              <ul className={`list-disc ps-5 rtl:pe-5 space-y-2 ${howToUseListTextColor}`}>
                {usageInstructions.map((instr: string, index: number) => (
                  <li key={index}>{instr}</li>
                ))}
              </ul>
              <h3 className={`text-xl font-semibold ${exampleTitleColor} mt-6 mb-3`}>{t('homepage.exampleInteractionTitle')}</h3>
              <p className={`whitespace-pre-line text-sm italic ${exampleTextColor}`}>{t('homepage.exampleInteraction')}</p>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
          opacity: 0; /* Start hidden */
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
        
        @keyframes bounceCustom {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0) scale(1.05);}
          40% {transform: translateY(-10px) scale(1.05);}
          60% {transform: translateY(-5px) scale(1.05);}
        }
        .animate-bounce-custom {
          animation: bounceCustom 2s infinite;
          animation-delay: 1s; /* Start bounce after initial fade-ins */
        }
      `}} />
    </main>
  );
};