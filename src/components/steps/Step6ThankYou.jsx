/**
 * Step6ThankYou.jsx
 * Thank you page after document creation
 * Uses WizardContext - no prop drilling
 */
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import LegalPages from '../LegalPages';
import { useWizardContext } from '../../context/WizardContext';

const Step6ThankYou = React.memo(({ onFaqClick: onFaqClickProp }) => {
  const { data, t, darkMode, setDarkMode, setLang, updateData, goToStep, onDownloadPDF, showToast, resetForm } = useWizardContext();
  const [legalPage, setLegalPage] = useState(null);
  const onFaqClick = onFaqClickProp ?? (() => showToast(t?.footer?.faqComingSoon ?? 'FAQ — coming soon.', 'info'));

  const handleLangChange = (v) => {
    updateData('lang', v);
    setLang(v);
  };

  return (
    <div className="min-h-screen font-sans antialiased pb-6 print:bg-white print:p-0 flex flex-col theme-bg theme-text">
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        lang={data.lang}
        onLangChange={handleLangChange}
        onLogoClick={() => goToStep(0)}
        t={t}
      />

      <main className="flex-grow flex flex-col items-center justify-center relative pt-32 pb-20 px-4">
        <div className="absolute top-[20%] left-[10%] opacity-20 pointer-events-none hidden lg:block animate-bounce select-none" style={{ animationDuration: '4s' }}>
          <span className="material-symbols-outlined text-7xl rotate-12 text-primary">celebration</span>
        </div>
        <div className="absolute bottom-[20%] right-[10%] opacity-20 pointer-events-none hidden lg:block animate-pulse select-none">
          <span className="material-symbols-outlined text-8xl -rotate-12 text-accent-pink dark:text-pink-400">pets</span>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center text-center z-10 gap-8">
          <div className="relative">
            <div className="size-32 sm:size-40 bg-primary/20 blob-accent flex items-center justify-center hand-drawn-border border-primary">
              <span className="material-symbols-outlined text-7xl sm:text-8xl text-primary animate-pulse sketch-icon-filled">check_circle</span>
            </div>
            <span className={`absolute -top-4 -right-4 px-3 py-1 font-display font-bold text-xl rounded-full rotate-12 hand-drawn-border ${darkMode ? 'bg-accent-pink text-[#121212] border-[#121212]' : 'bg-accent-pink text-gray-900 border-gray-200'}`}>
              {t?.thankYou?.purrPerfect ?? 'Purr-fect!'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2 className={`text-6xl sm:text-8xl font-bold font-display leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t?.thankYou?.allSet ?? t?.thankYou?.title ?? "You're All Set!"}
            </h2>
            <p className={`text-xl sm:text-2xl max-w-lg leading-relaxed font-medium italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t?.thankYou?.subtitle ?? t?.thankYou?.msg ?? "Your pet's professional resume has been generated and is ready for the world to see."}
            </p>
          </div>

          <div className="w-full max-w-md mt-4">
            {onDownloadPDF && (
              <button
                type="button"
                onClick={onDownloadPDF}
                className={`group relative w-full px-10 py-6 text-3xl sm:text-4xl font-bold font-display hand-drawn-button bg-primary hover:bg-primary-dark transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(179,157,219,0.2)] ${darkMode ? 'text-white' : 'text-[#121212]'}`}
              >
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">download_for_offline</span>
                {t?.thankYou?.downloadPdf ?? t?.labels?.download ?? 'DOWNLOAD PDF'}
                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-dashed border-primary/40 -z-10 rounded-xl pointer-events-none" aria-hidden />
              </button>
            )}
            <p className="mt-4 text-sm text-gray-500 font-medium">
              {t?.thankYou?.privacyLocal ?? "Your data was processed locally and is never stored on our servers."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
                type="button"
                onClick={() => goToStep(6)}
                className={`flex items-center gap-2 px-6 py-3 text-lg font-bold font-display hand-drawn-button border-2 transition-all ${
                  darkMode 
                    ? 'border-gray-500 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-400 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft size={20} />
                {t?.nav?.backToPreview ?? 'Zurück zur Vorschau'}
              </button>
            <button
                type="button"
                onClick={() => {
                  if (window.confirm(t?.ui?.confirmReset ?? t?.validation?.confirmReset ?? 'Are you sure? All data will be permanently deleted.')) {
                    Promise.resolve(resetForm?.()).then(() => goToStep(0));
                  }
                }}
                className={`text-primary transition-colors font-display text-xl ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
              >
                {t?.thankYou?.createAnother ?? t?.nav?.createAnother ?? 'Create another one'}
              </button>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={onFaqClick} />
      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  );
});

Step6ThankYou.displayName = 'Step6ThankYou';

export default Step6ThankYou;
