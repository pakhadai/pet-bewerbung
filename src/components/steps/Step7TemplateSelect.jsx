import React, { useState, useEffect, lazy, Suspense } from 'react';
import Button from '../Button';
import { TEMPLATE_OPTIONS } from '../../constants';

// Lazy load SwissDocument for better performance
const SwissDocument = lazy(() => import('../SwissDocument'));

// Loading placeholder for template preview
const TemplateSkeleton = () => (
  <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 animate-pulse flex items-center justify-center rounded-lg">
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
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

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
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-8 text-center max-w-6xl mx-auto pb-20`}>
      {/* Template Grid - 4 columns, clean previews */}
      <div className="grid grid-cols-4 gap-6 mx-auto px-4">
        {TEMPLATE_OPTIONS.map((tplOption, index) => (
          <div
            key={tplOption.id}
            className="flex flex-col items-center space-y-3"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
            onMouseEnter={() => setHoveredTemplate(tplOption.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            {/* Template Preview - with button in center */}
            <div className="relative w-full aspect-[1/1.4] overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {visibleTemplates.includes(tplOption.id) ? (
                  <Suspense fallback={<TemplateSkeleton />}>
                    <div style={{ width: '210mm', transform: 'scale(0.42)', transformOrigin: 'center' }}>
                      <SwissDocument data={data} t={t} templateType={tplOption.id} />
                    </div>
                  </Suspense>
                ) : (
                  <TemplateSkeleton />
                )}
              </div>

              {/* Select Button - centered on preview, appears with animation */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                  hoveredTemplate === tplOption.id 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <Button
                  variant="primary"
                  className="px-6 py-2.5 text-sm shadow-xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(tplOption.id);
                    showToast('Template selected', 'info');
                  }}
                >
                  {t.ui.select}
                </Button>
              </div>

              {/* Dark overlay on hover */}
              <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                hoveredTemplate === tplOption.id ? 'opacity-30' : 'opacity-0'
              }`}></div>
            </div>

            {/* Template Name */}
            <div className="text-sm font-semibold theme-text">
              {tplOption.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

Step7TemplateSelect.displayName = 'Step7TemplateSelect';

export default Step7TemplateSelect;
