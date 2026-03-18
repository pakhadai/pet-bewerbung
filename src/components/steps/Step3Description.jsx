/**
 * Step3Description.jsx
 * AI-powered pet description generation + manual text editing
 */
import React, { useState } from 'react';
import { Lock, Sparkles, Info, X } from 'lucide-react';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';
import { useWizardContext } from '../../context/WizardContext';

const Step3Description = React.memo(({
  onGenerate,
  canGenerateAI = true,
  remainingGenerations = 1,
}) => {
  const { data, updateData, t, animDir, darkMode } = useWizardContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!onGenerate || isGenerating) return;
    setIsGenerating(true);
    try {
      await onGenerate();
    } finally {
      setIsGenerating(false);
    }
  };
  const [showAiDataInfo, setShowAiDataInfo] = useState(false);
  
  const canGenerate = !isGenerating && canGenerateAI && (data.name || data.petType || data.keywords);
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

          <div className="flex flex-col items-center gap-6 mt-4">
            <button
              type="button"
              onClick={handleGenerate}
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
                    {t?.labels?.aiLimitBtn ?? 'Limit erreicht – morgen wieder'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl sketch-icon-filled text-primary-dark group-hover:text-white">auto_awesome</span>
                    {t?.labels?.aiGenerateBtn ?? `Generate AI Description (${MAX_DESCRIPTION_LENGTH} chars)`}
                  </>
                )}
              </span>
            </button>
            
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
              <span className={`text-xs font-medium ${canGenerateAI ? (darkMode ? 'text-blue-300' : 'text-blue-700') : (darkMode ? 'text-amber-300' : 'text-amber-700')}`}>
                {canGenerateAI ? (t?.labels?.aiRemaining ?? `${remainingGenerations} KI-Generierung(en) übrig`) : (t?.labels?.aiLimitInfo ?? 'Limit erreicht – morgen wieder')}
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => setShowAiDataInfo(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-blue-900/20 border border-blue-600/30 hover:bg-blue-900/40' 
                  : 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Info size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              <span className={`text-xs font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                {t?.ai?.dataInfoButton ?? 'Welche Daten werden bei KI-Generierung gesendet?'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showAiDataInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowAiDataInfo(false)}>
          <div
            className={`relative max-w-lg w-full rounded-2xl border-2 hand-drawn-border shadow-xl ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <button
                type="button"
                onClick={() => setShowAiDataInfo(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Info size={24} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <h3 className={`font-display font-bold text-xl ${darkMode ? 'text-white' : 'text-text-main'}`}>
                  {t?.ai?.dataInfoTitle ?? 'KI-Datenschutz'}
                </h3>
              </div>

              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t?.ai?.dataInfoDesc ?? 'Bei der KI-Textgenerierung werden folgende Daten an unseren Server gesendet:'}
              </p>

              <ul className={`space-y-2.5 mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-center gap-2.5 text-sm">
                  <span className="material-symbols-outlined text-base text-primary">pets</span>
                  <span>{t?.ai?.dataPetName ?? 'Name des Tieres'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <span className="material-symbols-outlined text-base text-primary">category</span>
                  <span>{t?.ai?.dataPetType ?? 'Tierart (Hund/Katze/Andere)'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <span className="material-symbols-outlined text-base text-primary">genetics</span>
                  <span>{t?.ai?.dataBreed ?? 'Rasse'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <span className="material-symbols-outlined text-base text-primary">style</span>
                  <span>{t?.ai?.dataKeywords ?? 'Schlüsselwörter/Charaktereigenschaften'}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm">
                  <span className="material-symbols-outlined text-base text-primary">translate</span>
                  <span>{t?.ai?.dataLang ?? 'Gewählte Sprache'}</span>
                </li>
              </ul>

              <div className={`p-3.5 rounded-xl border-2 hand-drawn-border mb-5 ${darkMode ? 'bg-green-900/20 border-green-600/50' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 sketch-icon-filled flex-shrink-0">verified_user</span>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                    {t?.ai?.dataNoPersonal ?? 'Keine persönlichen Daten (Name, Adresse, Telefon) werden gesendet. Das generierte PDF wird lokal erstellt.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAiDataInfo(false)}
                className={`w-full py-3 rounded-xl font-display font-bold transition-all hand-drawn-button ${
                  darkMode
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {t?.ui?.understand ?? 'Verstanden'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

Step3Description.displayName = 'Step3Description';

export default Step3Description;
