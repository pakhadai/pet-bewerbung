/**
 * Step3Description.jsx
 * 
 * STEP: 3 (in App.tsx: step === 3)
 * 
 * This component handles:
 * - AI-powered pet description generation
 * - Manual text editing
 * - Premium "Character Constructor" with sliders (Energy, Noise, Sociability)
 * - Premium tone selection (Official, Friendly, Cute)
 * - "Magic Rewrite" button for text improvement (Premium feature)
 */
import React, { useState, useCallback } from 'react';
import { Lock, Sparkles, Zap, Volume2, Users, Crown, Info, X } from 'lucide-react';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';

// Convert slider values to rich trait descriptions (5 levels per slider)
const slidersToTraits = (sliders) => {
  const traits = [];
  const e = sliders.energy;
  const n = sliders.noise;
  const s = sliders.sociability;

  // Energy (5 levels)
  if (e <= 20) traits.push('sehr ruhig, liebt es zu dösen, bevorzugt gemütliche Plätze');
  else if (e <= 40) traits.push('eher ruhig, geniesst kurze Spaziergänge, entspannt sich gerne');
  else if (e <= 60) traits.push('ausgeglichen, wechselt zwischen Aktivität und Ruhe');
  else if (e <= 80) traits.push('aktiv, liebt Spaziergänge und Spielzeit, gut ausgelastet');
  else traits.push('sehr energiegeladen, braucht viel Bewegung, liebt ausgedehnte Spaziergänge');

  // Noise (5 levels)
  if (n <= 20) traits.push('sehr leise, bellt praktisch nie, ideal für Mehrfamilienhäuser');
  else if (n <= 40) traits.push('ruhig, bellt nur bei Klingel, stört Nachbarn nicht');
  else if (n <= 60) traits.push('bellt selten, meldet sich nur bei ungewöhnlichen Geräuschen');
  else if (n <= 80) traits.push('wachsam, meldet Besucher kurz, beruhigt sich schnell');
  else traits.push('aufmerksam, meldet Besucher zuverlässig, gut erziehbar');

  // Sociability (5 levels)
  if (s <= 20) traits.push('eigenständig, braucht Rückzugsort, ruhiger Charakter');
  else if (s <= 40) traits.push('zurückhaltend bei Fremden, treu gegenüber Bezugspersonen');
  else if (s <= 60) traits.push('freundlich, kommt mit Menschen und Tieren gut aus');
  else if (s <= 80) traits.push('sehr sozial, liebt Gesellschaft, verträglich mit Nachbarn');
  else traits.push('äusserst menschenbezogen, liebt jeden Besuch, sehr verträglich');

  return traits.join('. ');
};

const Step3Description = React.memo(({
  data,
  updateData,
  t,
  animDir,
  darkMode,
  isGenerating,
  onGenerate,
  isPremium = false,
  canGenerateAI = true,
  remainingGenerations = 1,
  premiumToken = null,
  deviceId = null,
  onMagicRewrite
}) => {
  // Premium character sliders
  const [sliders, setSliders] = useState({
    energy: 50,
    noise: 30,
    sociability: 70,
  });
  const [tone, setTone] = useState('formal');
  const [showSliders, setShowSliders] = useState(isPremium);
  const [isRewriting, setIsRewriting] = useState(false);
  const [showAiDataInfo, setShowAiDataInfo] = useState(false);
  
  // Handle slider change
  const handleSliderChange = useCallback((name, value) => {
    setSliders(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  }, []);
  
  // Generate with sliders data
  const handleGenerateWithSliders = useCallback(() => {
    // Update keywords with slider traits before generating
    const traits = slidersToTraits(sliders);
    updateData('keywords', traits);
    updateData('aiTone', tone);
    // Call the original generate function
    onGenerate?.();
  }, [sliders, tone, updateData, onGenerate]);
  
  // Magic Rewrite - improve existing text
  const handleMagicRewrite = useCallback(async () => {
    if (!data.generatedText || data.generatedText.length < 20) return;
    if (!premiumToken || !deviceId) return;
    
    setIsRewriting(true);
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.generatedText,
          tone,
          premiumToken,
          deviceId
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.improvedText) {
        updateData('generatedText', result.improvedText);
        onMagicRewrite?.('success');
      } else {
        onMagicRewrite?.('error', result.error || 'Failed to improve text');
      }
    } catch (err) {
      onMagicRewrite?.('error', err.message);
    } finally {
      setIsRewriting(false);
    }
  }, [data.generatedText, tone, premiumToken, deviceId, updateData, onMagicRewrite]);
  
  const canGenerate = !isGenerating && canGenerateAI && (data.name || data.petType || data.keywords);
  const len = (data.generatedText || '').length;
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const cardCl = darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-white/80 border-gray-300';
  
  // Slider component
  const Slider = ({ name, icon: Icon, label, lowLabel, highLabel, value }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
          <span className={`text-sm font-medium ${titleCl}`}>{label}</span>
        </div>
        <span className={`text-xs ${mutedCl}`}>{value}%</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => handleSliderChange(name, e.target.value)}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer
            ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-purple-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
          `}
        />
      </div>
      <div className="flex justify-between">
        <span className={`text-xs ${mutedCl}`}>{lowLabel}</span>
        <span className={`text-xs ${mutedCl}`}>{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-2xl mx-auto pb-32`}>
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

          {/* Premium Character Constructor */}
          {isPremium && (
            <div className={`p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-purple-500/50 bg-purple-900/20' : 'border-purple-300 bg-purple-50/50'}`}>
              <button
                type="button"
                onClick={() => setShowSliders(!showSliders)}
                className={`w-full flex items-center justify-between ${titleCl}`}
              >
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-purple-500" />
                  <span className="font-bold">{t?.premium?.characterBuilder ?? 'Premium: Charakter-Konstruktor'}</span>
                </div>
                <span className="material-symbols-outlined text-purple-500 transition-transform" style={{ transform: showSliders ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>
              
              {showSliders && (
                <div className="mt-4 space-y-6">
                  {/* Sliders */}
                  <div className="grid gap-6">
                    <Slider
                      name="energy"
                      icon={Zap}
                      label={t?.premium?.sliders?.energy ?? 'Energie'}
                      lowLabel={t?.premium?.sliders?.energyLow ?? 'Gemütlich'}
                      highLabel={t?.premium?.sliders?.energyHigh ?? 'Energiegeladen'}
                      value={sliders.energy}
                    />
                    <Slider
                      name="noise"
                      icon={Volume2}
                      label={t?.premium?.sliders?.noise ?? 'Lautstärke'}
                      lowLabel={t?.premium?.sliders?.noiseLow ?? 'Leise'}
                      highLabel={t?.premium?.sliders?.noiseHigh ?? 'Bellfreudig'}
                      value={sliders.noise}
                    />
                    <Slider
                      name="sociability"
                      icon={Users}
                      label={t?.premium?.sliders?.sociability ?? 'Geselligkeit'}
                      lowLabel={t?.premium?.sliders?.sociabilityLow ?? 'Einzelgänger'}
                      highLabel={t?.premium?.sliders?.sociabilityHigh ?? 'Liebt alle'}
                      value={sliders.sociability}
                    />
                  </div>
                  
                  {/* Tone Selector */}
                  <div className="space-y-2">
                    <span className={`text-sm font-medium ${titleCl}`}>
                      {t?.premium?.toneLabel ?? 'Schreibstil'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'formal', label: t?.premium?.tones?.formal ?? 'Offiziell' },
                        { id: 'humorous', label: t?.premium?.tones?.humorous ?? 'Mit Humor' },
                        { id: 'cute', label: t?.premium?.tones?.cute ?? 'Niedlich' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTone(option.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${tone === option.id
                              ? 'bg-purple-500 text-white'
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
            
            {/* Magic Rewrite button for premium users with existing text */}
            {isPremium && data.generatedText && data.generatedText.length >= 20 && (
              <button
                type="button"
                onClick={handleMagicRewrite}
                disabled={isRewriting}
                className={`absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all
                  ${isRewriting ? 'opacity-50 cursor-not-allowed' : ''}
                  ${darkMode 
                    ? 'bg-purple-600/80 text-white hover:bg-purple-500' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                  }`}
              >
                {isRewriting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    {t?.premium?.rewriting ?? 'Verbessere...'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">auto_fix_high</span>
                    {t?.premium?.magicRewrite ?? 'Text verbessern'}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Generate AI + Privacy badge */}
          <div className="flex flex-col items-center gap-6 mt-4">
            <button
              type="button"
              onClick={isPremium && showSliders ? handleGenerateWithSliders : onGenerate}
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
            
            {/* AI generations limit info */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isPremium
                ? (darkMode ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-purple-50 border border-purple-200')
                : canGenerateAI
                  ? (darkMode ? 'bg-blue-900/20 border border-blue-600/30' : 'bg-blue-50 border border-blue-200')
                  : (darkMode ? 'bg-amber-900/20 border border-amber-600/30' : 'bg-amber-50 border border-amber-200')
            }`}>
              {isPremium ? (
                <Sparkles size={16} className="text-purple-500" />
              ) : canGenerateAI ? (
                <Sparkles size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              ) : (
                <Lock size={16} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />
              )}
              <span className={`text-xs font-medium ${
                isPremium
                  ? (darkMode ? 'text-purple-300' : 'text-purple-700')
                  : canGenerateAI
                    ? (darkMode ? 'text-blue-300' : 'text-blue-700')
                    : (darkMode ? 'text-amber-300' : 'text-amber-700')
              }`}>
                {canGenerateAI
                  ? (t?.premium?.aiRemaining ?? `${remainingGenerations} KI-Generierung(en) übrig`)
                  : (t?.premium?.aiLimitInfo ?? 'Premium für unbegrenzte KI-Texte')
                }
              </span>
            </div>
            
            {/* AI Data Info - shows what data is sent */}
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

      {/* AI Data Info Modal */}
      {showAiDataInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAiDataInfo(false)}>
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
