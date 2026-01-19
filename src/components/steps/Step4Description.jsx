import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import Label from '../Label';
import Button from '../Button';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';

const Step4Description = React.memo(({ data, updateData, t, animDir, isGenerating, onGenerate }) => {
  // Check if we have enough pet data to generate (at least pet name or type)
  const canGenerate = !isGenerating && (data.petName || data.petType || data.keywords);
  
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
      {/* Keywords/Traits Input */}
      <div>
        <Label>{t.labels.aiPrompt}</Label>
        <input
          type="text"
          className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all"
          placeholder={data.lang === 'ua' ? "тихий, охайний, любить спати..." : "ruhig, sauber, verspielt..."}
          value={data.keywords || ''}
          onChange={e => updateData('keywords', e.target.value)}
        />
        <div className="text-xs theme-text-muted mt-1">
          {t.labels?.keywordsHint || 'Charaktereigenschaften, getrennt durch Komma'}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        variant="magic"
        className="w-full"
        onClick={onGenerate}
        disabled={!canGenerate}
      >
        {isGenerating ? (
          <>
            <Sparkles className="animate-spin mr-2" size={16} />
            {t.labels?.generating || 'Generiere...'}
          </>
        ) : (
          <>
            <Wand2 className="mr-2" size={16} />
            {t.labels.aiBtn}
          </>
        )}
      </Button>
      
      {/* Pet Info Summary (helps user see what AI will use) */}
      {(data.petName || data.petType || data.breed) && (
        <div className="text-xs theme-text-muted p-2 rounded-lg theme-bg-secondary">
          🐾 {t.labels?.aiWillUse || 'AI verwendet'}: {[
            data.petName,
            data.petType,
            data.breed,
            data.age && `${data.age} ${t.labels?.years || 'Jahre'}`,
            data.gender,
          ].filter(Boolean).join(', ')}
        </div>
      )}

      {/* Generated Text Result */}
      <div>
        <Label>{t.labels.aiResult || 'Beschreibung'}</Label>
        <textarea
          maxLength={MAX_DESCRIPTION_LENGTH}
          className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none h-40 resize-none transition-all"
          placeholder={t.labels?.descriptionPlaceholder || 'Hier erscheint der generierte Text oder schreiben Sie selbst...'}
          value={data.generatedText || ''}
          onChange={e => updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
        />
        <div className="text-xs theme-text-muted mt-1 flex justify-between">
          <span>{(data.generatedText || '').length} / {MAX_DESCRIPTION_LENGTH}</span>
          {data.generatedText && (
            <button 
              onClick={() => updateData('generatedText', '')}
              className="text-red-500 hover:underline"
            >
              {t.labels?.clear || 'Löschen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

Step4Description.displayName = 'Step4Description';

export default Step4Description;
