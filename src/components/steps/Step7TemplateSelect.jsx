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
    const loadTemplates = async () => {
      // Load first 3 immediately
      setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 3).map(t => t.id));

      // Load next 3 after short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 6).map(t => t.id));

      // Load remaining after another delay
      await new Promise(resolve => setTimeout(resolve, 100));
      setVisibleTemplates(TEMPLATE_OPTIONS.map(t => t.id));
    };

    loadTemplates();
  }, []);

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 text-center max-w-5xl mx-auto pb-20`}>
      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto px-4">
        {TEMPLATE_OPTIONS.map((tplOption) => (
          <div
            key={tplOption.id}
            className="group relative p-3 border-2 theme-border rounded-2xl theme-card hover:border-primary hover:shadow-lg hover:shadow-strong transition-all duration-300 flex flex-col items-center cursor-pointer card-lift"
            onClick={() => {
              onSelectTemplate(tplOption.id);
              showToast('Template selected', 'info');
            }}
          >
            {/* Template Label */}
            <div className="absolute top-3 left-0 right-0 text-center">
              <span className="inline-block px-2 py-0.5 rounded-full theme-bg-secondary theme-text-muted text-[10px] font-bold uppercase tracking-widest group-hover:bg-primary-light group-hover:text-primary transition-colors">
                {tplOption.label}
              </span>
            </div>

            {/* Template Preview */}
            <div className="mt-8 w-full aspect-[1/1.4] overflow-hidden rounded-lg border theme-border theme-bg-secondary group-hover:theme-card transition-colors relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
                {visibleTemplates.includes(tplOption.id) ? (
                  <Suspense fallback={<TemplateSkeleton />}>
                    <div style={{ width: '210mm', transform: 'scale(0.29)', transformOrigin: 'center' }} className="shadow-lg">
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
            <div className="mt-3 flex gap-2 w-full">
              <Button
                variant="ghost"
                className="flex-1 text-xs py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(tplOption.id);
                }}
              >
                <Camera size={12} className="mr-1" /> {t.ui.preview}
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
