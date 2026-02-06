/**
 * Step5TemplateSelect.jsx
 * 
 * STEP: 5 (in App.tsx: step === 5)
 * 
 * This component handles ONLY template selection.
 * Shows large template previews for better visual comparison.
 * Separated from photo upload for better UX.
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Lock, Crown, Sparkles, Palette } from 'lucide-react';
import { TEMPLATE_OPTIONS } from '../../constants';

const SwissDocument = lazy(() => import('../SwissDocument'));

/** Display names for template cards */
const TEMPLATE_LABELS = {
  modern: 'The Modern',
  classic: 'The Classic',
  compact: 'The Playful',
  swiss: 'The Minimal'
};

const TemplateSkeleton = () => (
  <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center rounded-md">
    <span className="material-symbols-outlined text-4xl text-gray-600 animate-pulse">description</span>
  </div>
);

const Step5TemplateSelect = React.memo(({
  data,
  t,
  animDir,
  selectedTemplate,
  onSelectTemplate,
  showToast,
  darkMode,
  isPremium = false,
  getTemplateInfo = (id) => ({ isPremium: false, price: 0, accessible: true })
}) => {
  const [visibleTemplates, setVisibleTemplates] = useState([]);

  useEffect(() => {
    let m = true;
    const load = async () => {
      // Load first 2 templates immediately
      if (m) setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 2).map(x => x.id));
      await new Promise(r => setTimeout(r, 100));
      // Then load the rest
      if (m) setVisibleTemplates(TEMPLATE_OPTIONS.map(x => x.id));
    };
    load();
    return () => { m = false; };
  }, []);

  const textMain = darkMode ? 'text-white' : 'text-text-main';
  const textMuted = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const cardCl = darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-white/80 border-gray-300';

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-6xl mx-auto pb-32`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
          <Palette size={32} className="text-primary" />
        </div>
        <h2 className={`font-display font-bold text-2xl md:text-4xl mb-2 ${textMain}`}>
          {t?.stepsNew?.step5?.title ?? 'Design wählen'}
        </h2>
        <p className={`font-sans text-sm md:text-lg max-w-xl mx-auto ${textMuted}`}>
          {t?.stepsNew?.step5?.subtitle ?? 'Wählen Sie ein Design, das zur Persönlichkeit Ihres Tieres passt'}
        </p>
      </div>

      {/* Photo preview badge - shows current photo */}
      {data.photo && (
        <div className={`mb-6 flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 hand-drawn-border ${cardCl}`}>
          <img 
            src={data.photo} 
            alt="Pet" 
            className="w-12 h-16 rounded-lg object-cover border-2 border-primary"
          />
          <span className={`text-sm font-medium ${textMuted}`}>
            {t?.step5?.photoPreview ?? 'Ihr Foto wird in den Vorlagen angezeigt'}
          </span>
        </div>
      )}

      {/* Template Grid - Large cards for visual comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATE_OPTIONS.map((opt) => {
          const templateInfo = getTemplateInfo(opt.id);
          const isLocked = opt.isPremium && !isPremium;
          const isSelected = selectedTemplate === opt.id;
          
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => { 
                onSelectTemplate(opt.id); 
                if (isLocked) {
                  showToast?.(t?.premium?.templateSelected ?? 'Premium-Vorlage gewählt – Zahlung vor Download nötig', 'info');
                } else {
                  showToast?.(t?.ui?.templateSelected ?? 'Vorlage ausgewählt', 'success'); 
                }
              }}
              className={`group template-card p-3 md:p-4 flex flex-col gap-3 text-left relative transition-all duration-300 
                ${isSelected ? 'active ring-2 ring-primary ring-offset-2' : ''} 
                ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-lg'}
                ${opt.isPremium && !isPremium 
                  ? 'hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:border-amber-400/60' 
                  : opt.isPremium && isPremium 
                    ? 'hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-400/60'
                    : 'hover:border-primary/50'
                }
              `}
            >
              {/* FREE / PREMIUM Badge */}
              <div className="absolute top-3 left-3 z-10">
                {opt.isPremium ? (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg ${
                    isPremium 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
                  }`}>
                    {isPremium ? (
                      <>
                        <Sparkles size={10} />
                        {t?.premium?.unlocked ?? 'Freigeschaltet'}
                      </>
                    ) : (
                      <>
                        <Crown size={10} />
                        PREMIUM
                      </>
                    )}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-500 text-white shadow-lg">
                    FREE
                  </span>
                )}
              </div>
              
              {/* Template Preview */}
              <div className="aspect-[3/4] rounded-lg overflow-hidden relative border border-white/10 bg-neutral-800">
                {visibleTemplates.includes(opt.id) ? (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 overflow-hidden">
                    <Suspense fallback={<TemplateSkeleton />}>
                      <div
                        style={{ 
                          width: '210mm', 
                          height: '297mm', 
                          transform: 'scale(0.32)', 
                          transformOrigin: 'center', 
                          flexShrink: 0 
                        }}
                        className="shadow-2xl"
                      >
                        <SwissDocument data={data} t={t} templateType={opt.id} />
                      </div>
                    </Suspense>
                  </div>
                ) : (
                  <TemplateSkeleton />
                )}
                
                {/* Lock overlay for premium templates when not purchased */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none backdrop-blur-[1px]">
                    <div className="bg-black/70 rounded-full p-4 shadow-xl">
                      <Lock size={28} className="text-amber-400" />
                    </div>
                  </div>
                )}
                
                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 bg-primary rounded-full p-1 shadow-lg">
                    <span className="material-symbols-outlined text-white text-xl">check</span>
                  </div>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
              </div>
              
              {/* Template name and price */}
              <div className="flex justify-between items-center px-1 mt-1">
                <span className={`text-lg md:text-xl font-display font-bold ${textMain}`}>
                  {TEMPLATE_LABELS[opt.id] ?? opt.label}
                </span>
                {isSelected ? (
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${isLocked ? 'text-amber-500' : 'text-primary'}`}>
                    {isLocked ? (t?.premium?.needsPayment ?? 'Zahlung nötig') : (t?.ui?.selected ?? 'Gewählt')}
                  </span>
                ) : opt.isPremium && !isPremium && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">
                    {opt.price} CHF
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info box about premium templates */}
      {!isPremium && (
        <div className={`mt-8 p-4 rounded-xl border-2 hand-drawn-border ${
          darkMode ? 'bg-amber-900/20 border-amber-600/50' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <Crown size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className={`text-sm font-bold ${darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                {t?.step5?.premiumInfo ?? 'Premium-Vorlagen können gewählt und in der Vorschau angezeigt werden.'}
              </p>
              <p className={`text-xs mt-1 ${darkMode ? 'text-amber-200/70' : 'text-amber-700'}`}>
                {t?.step5?.premiumInfoSub ?? 'Die Zahlung erfolgt erst beim Download.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Step5TemplateSelect.displayName = 'Step5TemplateSelect';

export default Step5TemplateSelect;
