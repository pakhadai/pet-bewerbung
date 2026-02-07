/**
 * Step5Preview.jsx
 *
 * STEP: 6 (in App.tsx: step === 6)
 *
 * Clean, professional document preview with:
 * - Full-width document preview
 * - Minimal action panel
 * - Premium purchase flow
 * - Visual Editor access (Premium feature)
 */
import React, { useState } from 'react';
import { Download, Lock, Crown, CreditCard, Check, FileArchive, Maximize2, Minimize2, Layout, Sparkles } from 'lucide-react';
import SwissDocument from '../SwissDocument';
import ErrorBoundary from '../ErrorBoundary';
import { TEMPLATE_OPTIONS } from '../../constants';

/** Display names for templates */
const TEMPLATE_LABELS = {
  classic: 'The Classic',
  modern: 'The Modern',
  compact: 'The Playful',
  swiss: 'The Minimal',
  professional: 'The Professional',
  emergency: 'Emergency Card',
  friendly: 'The Friendly',
  grid: 'Swiss Grid'
};

const Step5Preview = React.memo(({
  data,
  t,
  animDir,
  selectedTemplate,
  darkMode,
  isPremium = false,
  getTemplateInfo = () => ({ isPremium: false, price: 0, accessible: true }),
  onDownloadPDF,
  onBuyPremium,
  premiumPrice = 10,
  onDownloadAllTemplates,
  onSelectFreeTemplate,
  updateData,
  onOpenBuilder
}) => {
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const cardBg = darkMode ? 'bg-gray-800/60' : 'bg-white';
  const borderCl = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Preview size state
  const [isEnlarged, setIsEnlarged] = useState(false);

  // Check if selected template requires payment
  const templateInfo = getTemplateInfo(selectedTemplate);
  const needsPayment = templateInfo.isPremium && !isPremium;
  const templateOption = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate);

  // Handle download or purchase
  const handleAction = () => {
    if (needsPayment) {
      onBuyPremium?.();
    } else {
      onDownloadPDF?.();
    }
  };

  // Preview scale
  const previewScale = isEnlarged ? 0.85 : 0.55;

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter max-w-7xl mx-auto pb-32`}>

      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`font-display font-bold text-2xl md:text-3xl ${titleCl}`}>
            {t?.stepsNew?.step6?.title ?? 'Vorschau & Download'}
          </h2>
          <p className={`text-sm mt-1 ${mutedCl}`}>
            {t?.stepsNew?.step6?.subtitle ?? 'Überprüfen Sie Ihr Dokument und laden Sie es herunter'}
          </p>
        </div>

        {/* Template badge */}
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${cardBg} border ${borderCl}`}>
          {templateOption?.isPremium ? (
            <Crown size={16} className={isPremium ? 'text-purple-500' : 'text-amber-500'} />
          ) : (
            <Check size={16} className="text-green-500" />
          )}
          <span className={`font-medium text-sm ${titleCl}`}>
            {TEMPLATE_LABELS[selectedTemplate] ?? templateOption?.label}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={`grid gap-6 ${isEnlarged ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>

        {/* Document Preview */}
        <div className={isEnlarged ? 'col-span-1' : 'lg:col-span-2'}>
          <div className={`relative rounded-2xl border ${borderCl} ${cardBg} overflow-hidden`}>

            {/* Preview Controls */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${borderCl}`}>
              <div className="flex items-center gap-3">
                {/* Visual Editor - Premium */}
                {onOpenBuilder && (
                  <button
                    type="button"
                    onClick={onOpenBuilder}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isPremium
                        ? 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
                        : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} hover:opacity-80`
                    }`}
                  >
                    <Layout size={14} />
                    <span className="hidden sm:inline">{t?.builder?.title ?? 'Editor'}</span>
                    {!isPremium && <Lock size={12} className="text-amber-500" />}
                    {isPremium && <Sparkles size={12} />}
                  </button>
                )}
              </div>

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

            {/* Document Container */}
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
                    <SwissDocument data={data} t={t} templateType={selectedTemplate} />
                  </ErrorBoundary>

                  {/* Watermark for unpaid premium */}
                  {needsPayment && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="transform -rotate-45 select-none opacity-60">
                        <p className="text-6xl font-bold text-red-500/30 tracking-widest">VORSCHAU</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className={isEnlarged ? 'hidden' : 'lg:col-span-1'}>
          <div className={`sticky top-24 rounded-2xl border ${borderCl} ${cardBg} overflow-hidden`}>

            {/* Template Status */}
            <div className={`p-5 border-b ${borderCl}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  templateOption?.isPremium
                    ? isPremium ? 'bg-purple-500/20' : 'bg-amber-500/20'
                    : 'bg-green-500/20'
                }`}>
                  {templateOption?.isPremium ? (
                    <Crown size={18} className={isPremium ? 'text-purple-500' : 'text-amber-500'} />
                  ) : (
                    <Check size={18} className="text-green-500" />
                  )}
                </div>
                <div>
                  <p className={`font-display font-bold ${titleCl}`}>
                    {TEMPLATE_LABELS[selectedTemplate] ?? templateOption?.label}
                  </p>
                  <p className={`text-xs ${mutedCl}`}>
                    {templateOption?.isPremium
                      ? isPremium
                        ? (t?.premium?.unlocked ?? 'Premium aktiv')
                        : (t?.premium?.premiumTemplate ?? 'Premium')
                      : (t?.premium?.freeTemplate ?? 'Kostenlos')
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Price (for premium templates) */}
            {needsPayment && (
              <div className={`p-5 border-b ${borderCl} text-center`}>
                <p className={`text-3xl font-display font-bold ${titleCl}`}>
                  {premiumPrice} <span className="text-lg font-normal">CHF</span>
                </p>
                <p className={`text-xs mt-1 ${mutedCl}`}>
                  {t?.premium?.includes ?? '2 Stunden Premium-Zugang'}
                </p>
              </div>
            )}

            {/* Premium Benefits */}
            {needsPayment && (
              <div className={`p-5 border-b ${borderCl}`}>
                <p className={`text-sm font-bold mb-3 ${titleCl}`}>
                  {t?.premium?.includes ?? '2 Stunden Premium-Zugang umfasst:'}
                </p>
                <ul className="space-y-2.5 text-sm">
                  {[
                    t?.premium?.benefit1 ?? 'Alle 8 Premium-Vorlagen',
                    t?.premium?.benefit2 ?? 'Visueller Design-Editor',
                    t?.premium?.benefit3 ?? 'Unbegrenzte KI-Textgenerierung',
                    t?.premium?.benefit4 ?? 'ZIP-Download aller Designs',
                    t?.premium?.benefit5 ?? 'Charakterkonstruktor mit Schiebereglern'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check size={14} className="text-green-500 flex-shrink-0" />
                      <span className={mutedCl}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-5 space-y-3">
              {/* Download button only shown when not needing payment */}
              {!needsPayment && (
                <button
                  type="button"
                  onClick={handleAction}
                  className="w-full font-display font-bold px-5 py-4 rounded-xl flex items-center justify-center gap-3 transition-all bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25"
                >
                  <Download size={20} />
                  {t?.labels?.downloadPdf ?? 'PDF herunterladen'}
                </button>
              )}

              {/* ZIP Download - Premium only */}
              {isPremium && onDownloadAllTemplates && (
                <button
                  type="button"
                  onClick={onDownloadAllTemplates}
                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <FileArchive size={16} />
                  {t?.premium?.downloadAllZip ?? 'Alle als ZIP'}
                </button>
              )}

              {/* Use free template link */}
              {needsPayment && onSelectFreeTemplate && (
                <button
                  type="button"
                  onClick={onSelectFreeTemplate}
                  className={`w-full text-center text-sm ${mutedCl} hover:underline py-2`}
                >
                  {t?.premium?.useFreeInstead ?? 'Kostenlose Vorlage verwenden'}
                </button>
              )}
            </div>

            {/* Security Note */}
            <div className={`px-5 pb-5`}>
              <div className={`flex items-center justify-center gap-2 text-xs ${mutedCl}`}>
                <Lock size={12} />
                <span>{t?.premium?.stripeSecure ?? 'Sichere Zahlung via Stripe'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Step5Preview.displayName = 'Step5Preview';

export default Step5Preview;
