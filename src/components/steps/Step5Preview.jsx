/**
 * Step5Preview.jsx
 * Document preview and download
 */
import React, { useState, lazy, Suspense } from 'react';
import { Download, Check, FileArchive, Maximize2, Minimize2 } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary';
import { TEMPLATE_OPTIONS } from '../../constants';
import { useWizardContext } from '../../context/WizardContext';

const SwissDocument = lazy(() => import('../SwissDocument'));

const TEMPLATE_LABELS = {
  classic: 'Classic',
  modern: 'Modern',
  compact: 'Compact'
};

const Step5Preview = React.memo(({ selectedTemplate }) => {
  const { data, t, animDir, darkMode, onDownloadPDF, onDownloadAllTemplates } = useWizardContext();
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderCl = darkMode ? 'border-gray-700' : 'border-gray-200';

  const [isEnlarged, setIsEnlarged] = useState(false);
  const templateOption = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate);
  const previewScale = isEnlarged ? 0.85 : 0.55;

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter max-w-7xl mx-auto pb-32`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`font-display font-bold text-2xl md:text-3xl ${titleCl}`}>
            {t?.stepsNew?.step6?.title ?? 'Vorschau & Download'}
          </h2>
          <p className={`text-sm mt-1 ${mutedCl}`}>
            {t?.stepsNew?.step6?.subtitle ?? 'Überprüfen Sie Ihr Dokument und laden Sie es herunter'}
          </p>
        </div>
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${cardBg} border ${borderCl}`}>
          <Check size={16} className="text-green-500" />
          <span className={`font-medium text-sm ${titleCl}`}>
            {TEMPLATE_LABELS[selectedTemplate] ?? templateOption?.label}
          </span>
        </div>
      </div>

      <div className={`grid gap-6 ${isEnlarged ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
        <div className={isEnlarged ? 'col-span-1' : 'lg:col-span-2'}>
          <div className={`relative rounded-2xl border ${borderCl} ${cardBg} overflow-hidden`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${borderCl}`}>
              <div className="flex items-center gap-3" />
              <button
                type="button"
                onClick={() => setIsEnlarged(!isEnlarged)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isEnlarged ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                <span className="hidden sm:inline">{isEnlarged ? 'Verkleinern' : 'Vergrößern'}</span>
              </button>
            </div>

            <div
              className="overflow-auto flex justify-center bg-gray-100 dark:bg-gray-900/50"
              style={{ height: isEnlarged ? '80vh' : '65vh' }}
            >
              <div className="py-6">
                <div
                  id="pdf-document"
                  className="bg-white shadow-2xl rounded-sm relative"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    flexShrink: 0,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top center'
                  }}
                >
                  <ErrorBoundary
                    fallbackTitle={t?.ui?.previewError || "Fehler"}
                    fallbackMessage={t?.ui?.previewErrorMessage || "Dokument konnte nicht geladen werden."}
                  >
                    <Suspense fallback={<div className="bg-white p-8 rounded-lg">Loading preview...</div>}>
                      <SwissDocument data={data} t={t} templateType={selectedTemplate} />
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={isEnlarged ? 'hidden' : 'lg:col-span-1'}>
          <div className={`sticky top-24 rounded-2xl border ${borderCl} ${cardBg} overflow-hidden`}>
            <div className={`p-5 border-b ${borderCl}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20">
                  <Check size={18} className="text-green-500" />
                </div>
                <div>
                  <p className={`font-display font-bold ${titleCl}`}>
                    {TEMPLATE_LABELS[selectedTemplate] ?? templateOption?.label}
                  </p>
                  <p className={`text-xs ${mutedCl}`}>{t?.labels?.freeTemplate ?? 'Kostenlos'}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <button
                type="button"
                onClick={onDownloadPDF}
                className="w-full font-display font-bold px-5 py-4 rounded-xl flex items-center justify-center gap-3 transition-all bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25"
              >
                <Download size={20} />
                {t?.labels?.downloadPdf ?? 'PDF herunterladen'}
              </button>

              {onDownloadAllTemplates && (
                <button
                  type="button"
                  onClick={onDownloadAllTemplates}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    darkMode ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <FileArchive size={16} />
                  {t?.labels?.downloadAllZip ?? 'Alle als ZIP'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Step5Preview.displayName = 'Step5Preview';

export default Step5Preview;
