/**
 * Step5Preview.jsx
 * 
 * STEP: 5 (in App.tsx: step === 5)
 * 
 * This component handles:
 * - Live document preview with selected template
 * - PDF download functionality
 * - Premium purchase flow (payment modal)
 * - Visual Editor access (Premium feature)
 * - Download all templates as ZIP (Premium feature)
 * - Template switching
 */
import React, { useState } from 'react';
import { Download, Lock, Crown, CreditCard, Check, X, FileArchive, Maximize2, Minimize2, Layout, Sparkles } from 'lucide-react';
import SwissDocument from '../SwissDocument';
import ErrorBoundary from '../ErrorBoundary';
import { TEMPLATE_OPTIONS } from '../../constants';

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
  
  // Preview size state - enlarged view
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
      // Also proceed to next step after download
      setTimeout(() => onNext?.(), 500);
    }
  };
  
  // Preview scale calculation for better visibility
  const previewScale = isEnlarged ? 1 : 0.48;
  
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 ${isEnlarged ? 'max-w-7xl' : 'max-w-6xl'} mx-auto pb-32 transition-all duration-300`}>
      <div className="mb-4 text-center">
        <h2 className={`font-display font-bold text-2xl md:text-3xl ${titleCl}`}>
          {t?.stepsNew?.step5?.title ?? 'Preview'}
        </h2>
        <p className={`font-sans text-sm md:text-base mt-1 ${mutedCl}`}>
          {t?.stepsNew?.step5?.subtitle ?? 'Review template & check your info'}
        </p>
      </div>
      
      <div className={`grid gap-6 ${isEnlarged ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-5'}`}>
        {/* Document Preview - Larger */}
        <div className={isEnlarged ? 'col-span-1' : 'xl:col-span-3'}>
          <div className={`relative w-full border-2 rounded-2xl hand-drawn-border theme-bg-secondary theme-border shadow-lg transition-all duration-300 ${isEnlarged ? 'p-6' : 'p-4'}`}>
            {/* Preview controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              {/* Visual Editor button - Premium feature */}
              {onOpenBuilder && (
                <button
                  type="button"
                  onClick={onOpenBuilder}
                  className={`px-3 py-2 rounded-lg border-2 transition-all flex items-center gap-2 font-medium text-sm ${
                    isPremium 
                      ? darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400/50 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-300 text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg shadow-purple-500/30'
                      : darkMode 
                        ? 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={t?.premium?.openBuilder ?? 'Visueller Editor'}
                >
                  <Layout size={16} />
                  <span className="hidden sm:inline">
                    {isPremium 
                      ? (t?.builder?.title ?? 'Visual Editor') 
                      : (t?.premium?.openBuilder ?? 'Editor')
                    }
                  </span>
                  {!isPremium && <Lock size={14} className="text-amber-500" />}
                  {isPremium && <Sparkles size={14} className="text-amber-300" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEnlarged(!isEnlarged)}
                className={`p-2 rounded-lg border-2 transition-all ${darkMode 
                  ? 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                title={isEnlarged ? 'Verkleinern' : 'Vergrößern'}
              >
                {isEnlarged ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            </div>
            
            {/* Scrollable container for the document */}
            <div className={`overflow-auto flex justify-center ${isEnlarged ? 'py-6' : 'py-4'}`} 
                 style={{ maxHeight: isEnlarged ? '85vh' : '70vh' }}>
              <div
                id="pdf-document"
                className="overflow-hidden border-2 rounded-lg shadow-2xl theme-card relative bg-white"
                style={{ 
                  width: '210mm', 
                  height: '297mm', 
                  flexShrink: 0,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top center'
                }}
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
            
            {/* Zoom indicator */}
            <div className={`text-center mt-2 text-xs ${mutedCl}`}>
              {isEnlarged ? '100%' : '48%'} – {isEnlarged ? t?.ui?.clickToShrink ?? 'Klicken zum Verkleinern' : t?.ui?.clickToEnlarge ?? 'Klicken zum Vergrößern'}
            </div>
          </div>
        </div>
        
        {/* Pricing/Download Panel */}
        <div className={isEnlarged ? 'hidden' : 'xl:col-span-2'}>
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
            
            {/* ZIP Download - Premium Feature */}
            {isPremium && onDownloadAllTemplates && (
              <button
                type="button"
                onClick={onDownloadAllTemplates}
                className={`w-full mt-3 font-display font-bold hand-drawn-button border-2 px-6 py-3 rounded-xl flex items-center justify-center gap-3 text-base transition-all
                  ${darkMode 
                    ? 'border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/40' 
                    : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
              >
                <FileArchive size={20} />
                {t?.premium?.downloadAll ?? 'Alle Vorlagen als ZIP'}
              </button>
            )}
            
            {/* Security badge */}
            <div className={`mt-4 flex items-center justify-center gap-2 ${mutedCl}`}>
              <Lock size={14} />
              <span className="text-xs">{t?.premium?.securePayment ?? 'Sichere Zahlung via Stripe'}</span>
            </div>
            
            {/* Alternative: use free template */}
            {needsPayment && onSelectFreeTemplate && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 text-center">
                <p className={`text-sm ${mutedCl}`}>
                  {t?.premium?.orUseFree ?? 'Oder'}{' '}
                  <button 
                    type="button"
                    onClick={onSelectFreeTemplate}
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

    </div>
  );
});

Step5Preview.displayName = 'Step5Preview';

export default Step5Preview;
