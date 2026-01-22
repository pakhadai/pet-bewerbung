import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Camera } from 'lucide-react';
import Button from '../Button';
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
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 text-center max-w-5xl mx-auto pb-20`}>
      {/* Template Grid - 4 columns in one row, responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mx-auto px-4">
        {TEMPLATE_OPTIONS.map((tplOption) => (
          <div
            key={tplOption.id}
            className="group relative p-2 border-2 theme-border rounded-xl theme-card hover:border-primary hover:shadow-lg hover:shadow-strong transition-all duration-300 flex flex-col items-center cursor-pointer card-lift"
            onClick={() => {
              onSelectTemplate(tplOption.id);
              showToast('Template selected', 'info');
            }}
          >
            {/* Template Label */}
            <div className="absolute top-2 left-0 right-0 text-center z-10">
              <span className="inline-block px-1.5 py-0.5 rounded-full theme-bg-secondary theme-text-muted text-[9px] font-bold uppercase tracking-wider group-hover:bg-primary-light group-hover:text-primary transition-colors">
                {tplOption.label}
              </span>
            </div>

            {/* Template Preview - larger image inside smaller block */}
            <div className="mt-6 w-full aspect-[1/1.4] overflow-hidden rounded-lg border theme-border theme-bg-secondary group-hover:theme-card transition-colors relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-0.5">
                {visibleTemplates.includes(tplOption.id) ? (
                  <Suspense fallback={<TemplateSkeleton />}>
                    <div style={{ width: '210mm', transform: 'scale(0.35)', transformOrigin: 'center' }} className="shadow-lg">
                      <SwissDocument data={data} t={t} templateType={tplOption.id} />
                    </div>
                  </Suspense>
                ) : (
                  <TemplateSkeleton />
                )}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 theme-card px-3 py-1.5 rounded-lg shadow-lg font-medium theme-text text-sm">
                  {t.ui.select}
                </div>
              </div>
            </div>

            {/* Preview Button */}
            <div className="mt-2 flex gap-1.5 w-full">
              <Button
                variant="ghost"
                className="flex-1 text-[10px] py-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(tplOption.id);
                }}
              >
                <Camera size={10} className="mr-1" /> {t.ui.preview}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

Step7TemplateSelect.displayName = 'Step7TemplateSelect';

export default Step7TemplateSelect;
