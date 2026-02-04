import React from 'react';
import { ChevronLeft, ChevronRight, Download, Lock, Crown, CreditCard, Check, X } from 'lucide-react';
import SwissDocument from '../SwissDocument';
import ErrorBoundary from '../ErrorBoundary';
import { TEMPLATE_OPTIONS } from '../../constants';

const Step8Preview = React.memo(({ 
  data, 
  t, 
  animDir, 
  selectedTemplate, 
  darkMode, 
  onPrev, 
  onNext,
  isPremium = false,
  getTemplateInfo = () => ({ isPremium: false, price: 0, accessible: true }),
  onDownloadPDF,
  onBuyPremium,
  premiumPrice = 10
}) => {
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  
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
      // Also proceed to next step after download
      setTimeout(() => onNext?.(), 500);
    }
  };
  
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-5xl mx-auto pb-24`}>
      <div className="mb-4 text-center">
        <h2 className={`font-display font-bold text-2xl md:text-3xl ${titleCl}`}>
          {t?.stepsNew?.step5?.title ?? 'Preview'}
        </h2>
        <p className={`font-sans text-sm md:text-base mt-1 ${mutedCl}`}>
          {t?.stepsNew?.step5?.subtitle ?? 'Review template & check your info'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <div className="relative w-full flex justify-center overflow-auto py-4 border-2 rounded-2xl hand-drawn-border theme-bg-secondary theme-border p-4 shadow-lg">
            <div
              id="pdf-document"
              className="overflow-hidden border-2 rounded-lg shadow-2xl theme-card relative"
              style={{ width: '210mm', height: '292mm', flexShrink: 0 }}
            >
              <ErrorBoundary
                fallbackTitle={t.ui?.previewError || "Document Error"}
                fallbackMessage={t.ui?.previewErrorMessage || "Failed to render the document. Please try selecting a different template or check your data."}
              >
                <SwissDocument data={data} t={t} templateType={selectedTemplate} />
              </ErrorBoundary>
              
              {/* Watermark overlay for unpaid premium templates */}
              {needsPayment && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="transform -rotate-45 select-none">
                    <p className="text-7xl font-bold text-red-500/20 tracking-wider">PREVIEW</p>
                    <p className="text-xl font-bold text-red-500/25 tracking-wide text-center mt-2">MUSTER – NICHT BEZAHLT</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pricing/Download Panel */}
        <div className="lg:col-span-1">
          <div className={`sticky top-24 p-6 rounded-2xl border-2 hand-drawn-border ${darkMode ? 'bg-gray-800/80 border-gray-600' : 'bg-white border-gray-200'} shadow-xl`}>
            {/* Template info */}
            <div className="flex items-center gap-3 mb-4">
              {templateOption?.isPremium ? (
                <div className="p-2 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
                  <Crown size={20} className="text-white" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-green-500">
                  <Check size={20} className="text-white" />
                </div>
              )}
              <div>
                <p className={`font-display font-bold text-lg ${titleCl}`}>
                  {templateOption?.label ?? 'Template'}
                </p>
                <p className={`text-sm ${mutedCl}`}>
                  {templateOption?.isPremium 
                    ? (isPremium ? (t?.premium?.unlocked ?? 'Premium freigeschaltet') : (t?.premium?.premiumTemplate ?? 'Premium-Vorlage'))
                    : (t?.premium?.freeTemplate ?? 'Kostenlose Vorlage')
                  }
                </p>
              </div>
            </div>
            
            {/* Comparison box for premium templates */}
            {needsPayment && (
              <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-bold text-sm mb-3 ${titleCl}`}>
                  {t?.premium?.compareTitle ?? 'Was Sie erhalten:'}
                </p>
                
                {/* Free version */}
                <div className={`mb-3 p-3 rounded-lg ${darkMode ? 'bg-gray-800/80' : 'bg-white'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide ${mutedCl} mb-2`}>
                    {t?.premium?.freeVersion ?? 'Kostenlos (Classic)'}
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span className={mutedCl}>{t?.premium?.basicDesign ?? 'Einfaches Design'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <X size={14} className="text-red-400" />
                      <span className={mutedCl}>{t?.premium?.noWatermark ?? 'Kein Wasserzeichen'}</span>
                    </li>
                  </ul>
                </div>
                
                {/* Premium version */}
                <div className={`p-3 rounded-lg border-2 ${darkMode ? 'bg-amber-900/20 border-amber-500/50' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wide text-amber-600 mb-2`}>
                    PREMIUM ({premiumPrice} CHF)
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span className={titleCl}>{t?.premium?.proDesign ?? 'Professionelles Design'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span className={titleCl}>{t?.premium?.allTemplates ?? 'Alle 4 Vorlagen'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span className={titleCl}>{t?.premium?.unlimitedAIShort ?? 'Unbegrenzt KI-Texte'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-green-500" />
                      <span className={titleCl}>{t?.premium?.supportProject ?? 'Projekt unterstützen'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Price display for premium */}
            {needsPayment && (
              <div className="text-center mb-4">
                <p className={`text-4xl font-display font-bold ${titleCl}`}>
                  {premiumPrice} <span className="text-lg">CHF</span>
                </p>
                <p className={`text-sm ${mutedCl}`}>
                  {t?.premium?.oneTimePayment ?? 'Einmalige Zahlung'}
                </p>
              </div>
            )}
            
            {/* Action button */}
            <button
              type="button"
              onClick={handleAction}
              className={`w-full font-display font-bold hand-drawn-button border-2 px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-lg transition-all ${
                needsPayment
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400 text-white hover:from-amber-600 hover:to-yellow-600'
                  : 'border-primary bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {needsPayment ? (
                <>
                  <CreditCard size={22} />
                  {t?.premium?.buyAndDownload ?? 'Kaufen & herunterladen'}
                </>
              ) : (
                <>
                  <Download size={22} />
                  {t?.labels?.download ?? 'PDF herunterladen'}
                </>
              )}
            </button>
            
            {/* Security badge */}
            <div className={`mt-4 flex items-center justify-center gap-2 ${mutedCl}`}>
              <Lock size={14} />
              <span className="text-xs">{t?.premium?.securePayment ?? 'Sichere Zahlung via Stripe'}</span>
            </div>
            
            {/* Alternative: use free template */}
            {needsPayment && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className={`text-sm ${mutedCl}`}>
                  {t?.premium?.orUseFree ?? 'Oder'}{' '}
                  <button 
                    type="button"
                    onClick={() => window.history.back()}
                    className="text-primary hover:underline font-medium"
                  >
                    {t?.premium?.useFreeTemplate ?? 'kostenlose Vorlage verwenden'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      {(onPrev != null || (!needsPayment && onNext != null)) && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              className={`font-display font-bold hand-drawn-button border-2 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
                darkMode ? 'border-gray-400 text-gray-200 hover:bg-gray-700' : 'border-gray-500 text-text-main hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
              {t?.nav?.previousStep ?? t?.nav?.back ?? '← Vorheriger Schritt'}
            </button>
          )}
          {!needsPayment && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="font-display font-bold hand-drawn-button border-2 px-6 py-2.5 rounded-xl flex items-center gap-2 border-primary bg-primary text-white hover:bg-primary-dark transition-all ml-auto"
            >
              {t?.nav?.finalReview ?? 'Abschlussprüfung →'}
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
    </div>
  );
});

Step8Preview.displayName = 'Step8Preview';

export default Step8Preview;
