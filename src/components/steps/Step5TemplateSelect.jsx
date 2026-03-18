/**
 * Step5TemplateSelect.jsx
 * Template selection - 3 free templates
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Palette } from 'lucide-react';
import { TEMPLATE_OPTIONS } from '../../constants';
import { useWizardContext } from '../../context/WizardContext';

const SwissDocument = lazy(() => import('../SwissDocument'));

const TEMPLATE_LABELS = {
  classic: 'Classic',
  modern: 'Modern',
  compact: 'Compact'
};

const TemplateSkeleton = () => (
  <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center rounded-md">
    <span className="material-symbols-outlined text-4xl text-gray-600 animate-pulse">description</span>
  </div>
);

const Step5TemplateSelect = React.memo(({
  selectedTemplate,
  onSelectTemplate,
  showToast,
}) => {
  const { data, t, animDir, darkMode } = useWizardContext();
  const [visibleTemplates, setVisibleTemplates] = useState([]);

  useEffect(() => {
    let m = true;
    const load = async () => {
      if (m) setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 2).map(x => x.id));
      await new Promise(r => setTimeout(r, 100));
      if (m) setVisibleTemplates(TEMPLATE_OPTIONS.map(x => x.id));
    };
    load();
    return () => { m = false; };
  }, []);

  const textMain = darkMode ? 'text-white' : 'text-text-main';
  const textMuted = darkMode ? 'text-gray-400' : 'text-text-secondary';

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-6xl mx-auto pb-32`}>
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
          <Palette size={32} className="text-primary" />
        </div>
        <h2 className={`font-display font-bold text-2xl md:text-4xl mb-2 ${textMain}`}>
          {t?.stepsNew?.step5?.title ?? 'Design wählen'}
        </h2>
        <p className={`font-sans text-sm md:text-lg max-w-xl mx-auto ${textMuted}`}>
          {t?.stepsNew?.step5?.subtitle ?? 'Wählen Sie ein Design für Ihr Pet-Dossier'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATE_OPTIONS.map((opt) => {
          const isSelected = selectedTemplate === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectTemplate(opt.id);
                showToast?.(t?.ui?.templateSelected ?? 'Vorlage ausgewählt', 'success');
              }}
              className={`group template-card p-3 md:p-4 flex flex-col gap-3 text-left relative transition-all duration-300 
                ${isSelected ? 'active ring-2 ring-primary ring-offset-2' : ''} 
                ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:shadow-lg'}
                hover:border-primary/50
              `}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden relative border border-white/10 bg-neutral-800">
                {visibleTemplates.includes(opt.id) ? (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 overflow-hidden">
                    <Suspense fallback={<TemplateSkeleton />}>
                      <div
                        style={{ width: '210mm', height: '297mm', transform: 'scale(0.32)', transformOrigin: 'center', flexShrink: 0 }}
                        className="shadow-2xl"
                      >
                        <SwissDocument data={data} t={t} templateType={opt.id} />
                      </div>
                    </Suspense>
                  </div>
                ) : (
                  <TemplateSkeleton />
                )}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 bg-primary rounded-full p-1 shadow-lg">
                    <span className="material-symbols-outlined text-white text-xl">check</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center px-1 mt-1">
                <span className={`text-lg md:text-xl font-display font-bold ${textMain}`}>
                  {TEMPLATE_LABELS[opt.id] ?? opt.label}
                </span>
                {isSelected && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                    {t?.ui?.selected ?? 'Gewählt'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

Step5TemplateSelect.displayName = 'Step5TemplateSelect';

export default Step5TemplateSelect;
