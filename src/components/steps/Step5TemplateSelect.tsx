/**
 * Step5TemplateSelect - Template selection (3 free templates)
 */
import React, { lazy, Suspense } from 'react';
import { Palette } from 'lucide-react';
import MaterialIcon from '../MaterialIcon';
import { TEMPLATE_OPTIONS } from '../../constants';
import { useWizardContext } from '../../context/WizardContext';
import { useFormStore } from '../../stores/formStore';
import type { FormData } from '../../types/form';
import type { TemplateType } from '../../types/form';
import { trackUmamiEvent } from '../../utils/umami';

const SwissDocument = lazy(() => import('../SwissDocument'));

const TEMPLATE_LABELS: Record<string, string> = {
  classic: 'Classic',
  modern: 'Modern',
  compact: 'Compact',
};

const TemplateSkeleton: React.FC = () => (
  <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center rounded-md">
    <MaterialIcon name="description" className="text-4xl text-gray-600 animate-pulse" />
  </div>
);

interface Step5TemplateSelectProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (id: TemplateType) => void;
}

const Step5TemplateSelect: React.FC<Step5TemplateSelectProps> = ({ selectedTemplate, onSelectTemplate }) => {
  const data = useFormStore((s) => s.data) as FormData;
  const { t, animDir, darkMode } = useWizardContext();
  const visibleTemplates = TEMPLATE_OPTIONS.map((x) => x.id);

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
                onSelectTemplate(opt.id as TemplateType);
                trackUmamiEvent('Template_Changed', { template: opt.id });
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
                    <MaterialIcon name="check" className="text-white text-xl" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center px-1 mt-1">
                <span className={`text-lg md:text-xl font-display font-bold ${textMain}`}>{TEMPLATE_LABELS[opt.id] ?? opt.label}</span>
                {isSelected && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-primary">{t?.ui?.selected ?? 'Gewählt'}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Step5TemplateSelect;
