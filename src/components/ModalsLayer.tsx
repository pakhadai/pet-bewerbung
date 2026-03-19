/**
 * ModalsLayer - Renders all app modals in one place
 * FaqModal, LegalPages, PreviewModal
 */
import React, { Suspense } from 'react';
import { X, Camera } from 'lucide-react';
import FaqModal from './FaqModal';
import LegalPages from './LegalPages';
import ErrorBoundary from './ErrorBoundary';
import { lazyRetry } from '../utils/lazyRetry';
import type { TranslationObject } from '../types/template';

const SwissDocument = lazyRetry(() => import('./SwissDocument'));

export interface ModalsLayerProps {
  t: TranslationObject;
  darkMode: boolean;
  faqOpen: boolean;
  setFaqOpen: (open: boolean) => void;
  legalPage: string | null;
  setLegalPage: (page: string | null) => void;
  previewOpen: boolean;
  previewTemplate: string;
  closePreview: () => void;
  data: Record<string, unknown>;
  /** When false (e.g. step 7 ThankYou), hide LegalPages */
  showLayoutModals?: boolean;
}

const ModalsLayer: React.FC<ModalsLayerProps> = ({
  t,
  darkMode,
  faqOpen,
  setFaqOpen,
  legalPage,
  setLegalPage,
  previewOpen,
  previewTemplate,
  closePreview,
  data,
  showLayoutModals = true,
}) => (
  <>
    <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} t={t} darkMode={darkMode} />

    {showLayoutModals && <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />}

    {previewOpen && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 print:hidden">
        <div className="relative bg-transparent w-full h-full flex flex-col items-center justify-center" onClick={closePreview}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closePreview();
            }}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <X size={32} />
          </button>

          <div
            className="text-white mb-4 font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Camera size={18} /> {t?.ui?.previewMode} — {previewTemplate}
          </div>

          <div
            className="w-full max-w-4xl h-full overflow-auto flex justify-center items-start pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 shadow-2xl">
              <ErrorBoundary
                fallbackTitle="Preview Error"
                fallbackMessage="Failed to render document preview. Please check your data and try again."
                onReset={closePreview}
              >
                <Suspense fallback={<div className="bg-white p-8 rounded-lg">Loading preview...</div>}>
                  <SwissDocument data={data} t={t} templateType={previewTemplate} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    )}

    {showLayoutModals && (
      null
    )}
  </>
);
export default ModalsLayer;
