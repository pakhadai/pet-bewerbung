/**
 * Step3Description - Template-based pet description generation
 * 100% local - no data sent to any server
 */
import React from 'react';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';
import { useWizardContext } from '../../context/WizardContext';
import { useFormStore } from '../../stores/formStore';
import FormInput from '../FormInput';

const Step3Description = React.memo(({ onGenerate }) => {
  const data = useFormStore((s) => s.data);
  const updateData = useFormStore((s) => s.updateData);
  const { t, animDir, darkMode } = useWizardContext();
  const canGenerate = data.name || data.petType || data.keywords;
  const len = (data.generatedText || '').length;
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const cardCl = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300';

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-2xl mx-auto pb-32`}>
      <div className={`p-8 lg:p-12 hand-drawn-border border-2 rounded-2xl ${cardCl} shadow-lg relative`}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end flex-wrap gap-2">
              <label htmlFor="pet-description" className={`text-3xl font-display font-bold ${titleCl}`}>
                {t?.labels?.tellUsAboutPet ?? 'Erzählen Sie uns von Ihrem Tier'}
              </label>
              <span className={`text-sm font-medium px-2 py-0.5 hand-drawn-border rounded ${mutedCl} ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'}`}>
                {len} / {MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <p className={`text-sm ${mutedCl}`}>
              {t?.labels?.descriptionHint ?? 'Persönlichkeit, Lieblingsspielzeug oder Eigenheiten.'}
            </p>
          </div>

          <div className="relative">
            <textarea
              id="pet-description"
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={8}
              placeholder={t?.labels?.descriptionPlaceholder ?? "Buddy ist ein temperamentvoller..."}
              className={`w-full p-6 text-lg font-medium hand-drawn-border border-2 rounded-xl resize-none outline-none transition-all placeholder:opacity-60
                ${darkMode ? 'bg-gray-800/80 border-gray-600 text-white focus:border-primary' : 'bg-white/90 border-gray-400 text-text-main focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              value={data.generatedText || ''}
              onChange={e => updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            />
          </div>

          {/* Keywords input — feeds into template text generation */}
          <div className="flex flex-col gap-2">
            <label htmlFor="pet-keywords" className={`text-sm font-medium ${mutedCl}`}>
              {t?.labels?.aiPrompt ?? 'Stichworte (z.B. ruhig, stubenrein)'}
            </label>
            <FormInput
              id="pet-keywords"
              value={data.keywords || ''}
              onChange={v => updateData('keywords', v)}
              placeholder="ruhig, stubenrein, verspielt, kinderlieb..."
              className={`w-full p-3 hand-drawn-border border-2 rounded-xl outline-none transition-all text-sm
                ${darkMode ? 'bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white/90 border-gray-400 text-text-main placeholder:text-gray-400'}`}
            />
          </div>

          <div className="flex flex-col items-center gap-4 mt-2">
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className={`group relative px-8 py-4 text-xl font-bold font-display hand-drawn-button w-full md:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${darkMode ? 'text-gray-100 bg-primary/80 hover:bg-primary border-primary' : 'text-white bg-primary hover:bg-primary-dark border-primary'}`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-2xl">edit_note</span>
                {t?.labels?.aiGenerateBtn ?? 'Text automatisch generieren'}
              </span>
            </button>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-600/30' : 'bg-green-50 border border-green-200'}`}>
              <span className="material-symbols-outlined text-green-500 text-lg sketch-icon-filled">verified_user</span>
              <span className={`text-xs font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                {t?.labels?.localPrivacy ?? 'Lokale Erzeugung • Datenschutz'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Step3Description.displayName = 'Step3Description';
export default Step3Description;
