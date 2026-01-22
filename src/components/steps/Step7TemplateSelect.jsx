import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TEMPLATE_OPTIONS } from '../../constants';

// Lazy load SwissDocument for better performance
const SwissDocument = lazy(() => import('../SwissDocument'));

// Loading placeholder for template preview
const TemplateSkeleton = () => (
  <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 animate-pulse flex items-center justify-center">
    <div className="text-slate-400 text-xs">Loading...</div>
  </div>
);

const Step7TemplateSelect = React.memo(({
  data,
  t,
  animDir,
  onSelectTemplate,
  onPreview,
  showToast
}) => {
  const [visibleTemplates, setVisibleTemplates] = useState([]);

  // Progressive loading - load templates in batches
  useEffect(() => {
    let mounted = true;
    const loadTemplates = async () => {
      // Load first 3 immediately
      if (mounted) {
        setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 3).map(t => t.id));
      }

      // Load next 3 after short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      if (mounted) {
        setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 6).map(t => t.id));
      }

      // Load remaining after another delay
      await new Promise(resolve => setTimeout(resolve, 100));
      if (mounted) {
        setVisibleTemplates(TEMPLATE_OPTIONS.map(t => t.id));
      }
    };

    loadTemplates();
    return () => { mounted = false; };
  }, []);

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 text-center max-w-6xl mx-auto pb-20`}>
      {/* Template Grid - 4 columns, just previews without blocks */}
      <div className="grid grid-cols-4 gap-4 mx-auto px-4">
        {TEMPLATE_OPTIONS.map((tplOption) => (
          <div
            key={tplOption.id}
            className="group relative w-full aspect-[1/1.4] overflow-hidden rounded-lg border-2 theme-border hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => {
              onSelectTemplate(tplOption.id);
              showToast('Template selected', 'info');
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {visibleTemplates.includes(tplOption.id) ? (
                <Suspense fallback={<TemplateSkeleton />}>
                  <div style={{ width: '210mm', transform: 'scale(0.42)', transformOrigin: 'center' }} className="shadow-lg">
                    <SwissDocument data={data} t={t} templateType={tplOption.id} />
                  </div>
                </Suspense>
              ) : (
                <TemplateSkeleton />
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity theme-card px-4 py-2 rounded-lg shadow-lg font-medium theme-text text-sm">
                {t.ui.select}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

Step7TemplateSelect.displayName = 'Step7TemplateSelect';

export default Step7TemplateSelect;
