import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MaterialIcon from '../components/MaterialIcon';
import { WizardProvider } from '../context/WizardContext';
import { useThemeContext, useToastContext, useTranslationContext } from '../context/WizardProviders';
import { useFormStore } from '../stores/formStore';
import { useTemplateSelection } from '../hooks';
import {
  Step1Details,
  Step2HealthInsurance,
  Step3Description,
  Step4Photo,
  Step5TemplateSelect,
} from '../components/steps/index';

const SwissDocument = lazy(() => import('../components/SwissDocument'));

type Props = {
  onGenerateText: () => void;
};

const noopAsync = async () => undefined;
const noop = () => undefined;

export default function BuilderRoute({ onGenerateText }: Props) {
  const navigate = useNavigate();
  const data = useFormStore((s) => s.data);
  const resetForm = useFormStore((s) => s.resetForm);
  const { t, lang, setLang } = useTranslationContext();
  const { darkMode, toggleTheme, setDarkMode } = useThemeContext();
  const { showToast } = useToastContext();

  const { selectedTemplate, setSelectedTemplate } = useTemplateSelection();

  const openPrint = useCallback(() => {
    const w = window.open(`/${lang}/print`, '_blank', 'noopener,noreferrer');
    if (!w) {
      showToast(t?.ui?.popupBlocked ?? 'Please allow popups to open the print view.', 'warning');
    }
  }, [lang, showToast, t]);

  const onLangChange = useCallback(
    (nextLang: string) => {
      setLang(nextLang as any);
      useFormStore.getState().updateData('lang', nextLang as any);
      navigate(`/${nextLang}/builder`, { replace: true });
    },
    [navigate, setLang]
  );

  const wizardContextValue = useMemo(
    () => ({
      t,
      darkMode,
      step: 1,
      animDir: 'right' as const,
      validationErrors: {},
      onDownloadPDF: async () => openPrint(),
      onDownloadAllTemplates: noopAsync,
      goToStep: noop,
      setLang: (l: string) => onLangChange(l),
      setDarkMode,
      showToast,
      resetForm,
    }),
    [t, darkMode, openPrint, onLangChange, setDarkMode, showToast, resetForm]
  );

  return (
    <>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleTheme}
        lang={lang}
        onLangChange={onLangChange}
        onLogoClick={() => navigate(`/${lang}/`, { replace: false })}
        t={t}
      />

      <WizardProvider value={wizardContextValue}>
        <main className="w-full pt-[92px] px-4 md:px-8 pb-20 print:hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className={`font-display font-bold text-2xl md:text-3xl ${darkMode ? 'text-white' : 'text-text-main'}`}>
                  {t?.builder?.title ?? 'Pet-CV Builder'}
                </h2>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
                  {t?.builder?.subtitle ?? 'Edit fields and preview the A4 document live.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openPrint}
                  className="theme-button-primary btn-press cta-glow px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                >
                  <MaterialIcon name="print" className="text-xl" />
                  <span>{t?.ui?.print ?? 'PDF / Print'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Form sections */}
              <div className="space-y-6">
                <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Step1Details />
                </div>
                <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Step2HealthInsurance />
                </div>
                <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Step3Description onGenerate={onGenerateText} />
                </div>
                <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Step4Photo onNavigationVisibilityChange={noop} showToast={showToast} />
                </div>
                <div className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <Step5TemplateSelect selectedTemplate={selectedTemplate as any} onSelectTemplate={setSelectedTemplate as any} />
                </div>
              </div>

              {/* Live preview */}
              <div className="lg:sticky lg:top-24">
                <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`px-4 py-3 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-text-main'}`}>
                      {t?.ui?.preview ?? 'Preview'}
                    </div>
                  </div>
                  <div className="overflow-auto flex justify-center bg-gray-100 dark:bg-gray-900/50" style={{ height: '72vh' }}>
                    <div className="py-6">
                      <div
                        className="bg-white shadow-2xl rounded-sm relative"
                        style={{
                          width: '210mm',
                          height: '297mm',
                          flexShrink: 0,
                          transform: 'scale(0.55)',
                          transformOrigin: 'top center',
                        }}
                      >
                        <Suspense fallback={<div className="bg-white p-8 rounded-lg">Loading preview...</div>}>
                          <SwissDocument data={data as any} t={t as any} templateType={selectedTemplate as any} />
                        </Suspense>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </WizardProvider>
    </>
  );
}

