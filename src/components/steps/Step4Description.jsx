import React from 'react';
import { ChevronLeft, ChevronRight, Lock, Sparkles } from 'lucide-react';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';

const Step4Description = React.memo(({
  data,
  updateData,
  t,
  animDir,
  darkMode,
  isGenerating,
  onGenerate,
  onPrev,
  onNext,
  isPremium = false,
  canGenerateAI = true,
  remainingGenerations = 1
}) => {
  const canGenerate = !isGenerating && (data.name || data.petType || data.keywords);
  const len = (data.generatedText || '').length;
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const cardCl = darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-white/80 border-gray-300';

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-2xl mx-auto pb-24`}>
      <div className={`p-8 lg:p-12 hand-drawn-border border-2 rounded-2xl ${cardCl} shadow-lg relative`}>
        <div className="flex flex-col gap-6">
          {/* Tell us about your pet */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end flex-wrap gap-2">
              <label htmlFor="pet-description" className={`text-3xl font-display font-bold ${titleCl}`}>
                {t?.labels?.tellUsAboutPet ?? 'Tell us about your pet'}
              </label>
              <span className={`text-sm font-medium px-2 py-0.5 hand-drawn-border rounded ${mutedCl} ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'}`}>
                {len} / {MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <p className={`text-sm ${mutedCl}`}>
              {t?.labels?.descriptionHint ?? 'Share their personality, favorite toys, or funny quirks.'}
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              id="pet-description"
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={8}
              placeholder={t?.labels?.descriptionPlaceholder ?? "Buddy is a high-energy Golden Retriever who loves belly rubs and chasing squirrels..."}
              className={`w-full p-6 text-lg font-medium hand-drawn-border border-2 rounded-xl resize-none outline-none transition-all placeholder:opacity-60
                ${darkMode ? 'bg-gray-800/80 border-gray-600 text-white placeholder-gray-500 focus:border-primary' : 'bg-white/90 border-gray-400 text-text-main placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
              value={data.generatedText || ''}
              onChange={e => updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            />
            <div className={`absolute -top-3 -right-3 pointer-events-none opacity-30 ${darkMode ? 'text-primary' : 'text-primary'}`} aria-hidden>
              <span className="material-symbols-outlined text-4xl rotate-12">stylus</span>
            </div>
          </div>

          {/* Generate AI + Privacy badge */}
          <div className="flex flex-col items-center gap-6 mt-4">
            <button
              type="button"
              onClick={onGenerate}
              disabled={!canGenerate}
              className={`group relative px-8 py-4 text-2xl font-bold font-display hand-drawn-button w-full md:w-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed
                ${darkMode ? 'text-gray-100 bg-lavender/30 hover:bg-primary border-gray-500 hover:border-primary' : 'text-text-main bg-lavender hover:bg-primary hover:text-white border-gray-400 hover:border-primary'}`}
            >
              <span className="flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                    {t?.labels?.generating ?? 'Generating...'}
                  </>
                ) : !canGenerateAI ? (
                  <>
                    <Lock size={24} className="text-amber-500" />
                    {t?.premium?.aiLimitBtn ?? 'Limit erreicht – Premium für mehr'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl sketch-icon-filled text-primary-dark group-hover:text-white">auto_awesome</span>
                    {t?.labels?.aiGenerateBtn ?? `Generate AI Description (${MAX_DESCRIPTION_LENGTH} chars)`}
                  </>
                )}
              </span>
            </button>
            
            {/* AI generations limit info for free users */}
            {!isPremium && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                canGenerateAI 
                  ? (darkMode ? 'bg-blue-900/20 border border-blue-600/30' : 'bg-blue-50 border border-blue-200')
                  : (darkMode ? 'bg-amber-900/20 border border-amber-600/30' : 'bg-amber-50 border border-amber-200')
              }`}>
                {canGenerateAI ? (
                  <Sparkles size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                ) : (
                  <Lock size={16} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
                )}
                <span className={`text-xs font-medium ${
                  canGenerateAI 
                    ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                    : (darkMode ? 'text-amber-300' : 'text-amber-700')
                }`}>
                  {canGenerateAI 
                    ? (t?.premium?.aiRemaining ?? `${remainingGenerations} KI-Generierung(en) übrig`)
                    : (t?.premium?.aiLimitInfo ?? 'Premium für unbegrenzte KI-Texte')
                  }
                </span>
              </div>
            )}
            
            {/* Premium badge */}
            {isPremium && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                <Sparkles size={16} className="text-purple-500" />
                <span className={`text-xs font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                  {t?.premium?.unlimitedAI ?? 'Premium – Unbegrenzte KI-Generierungen'}
                </span>
              </div>
            )}
            
            <div className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 ${darkMode ? 'bg-green-900/20 border-green-600/30' : 'bg-mint/50 border-gray-300'}`}>
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl sketch-icon-filled">verified_user</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-green-300' : 'text-text-secondary'}`}>
                {t?.labels?.localPrivacy ?? 'Local Generation • Privacy Focused'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Back / Continue */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-10">
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className={`flex items-center gap-2 px-6 py-2 font-display font-bold text-xl hand-drawn-button transition-colors ${mutedCl} hover:opacity-100`}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
            {t?.nav?.previousStep ?? t?.nav?.back ?? 'Back'}
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className={`flex items-center gap-2 px-10 py-2 font-display font-bold text-xl hand-drawn-button ml-auto ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-500' : 'bg-text-main text-white hover:bg-gray-800 border-text-main'}`}
          >
            {t?.nav?.next ?? 'Continue'}
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
});

Step4Description.displayName = 'Step4Description';

export default Step4Description;
