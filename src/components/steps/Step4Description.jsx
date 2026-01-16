import React from 'react';
import { Sparkles } from 'lucide-react';
import Label from '../Label';
import Button from '../Button';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';

const Step4Description = React.memo(({ data, updateData, t, animDir, isGenerating, onGenerate }) => {
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
      <div>
        <Label>{t.labels.aiPrompt}</Label>
        <textarea
          maxLength={MAX_DESCRIPTION_LENGTH}
          className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none h-32 resize-none transition-all"
          placeholder={data.lang === 'ua' ? "тихий, охайний, любить спати" : "ruhig, sauber, schläft viel"}
          value={data.generatedText || data.keywords}
          onChange={e => updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
        />
        <div className="text-xs theme-text-muted mt-1">
          {(data.generatedText || data.keywords).length} / {MAX_DESCRIPTION_LENGTH} chars
        </div>
      </div>

      <Button
        variant="magic"
        className="w-full"
        onClick={onGenerate}
        disabled={!data.keywords || isGenerating}
      >
        {isGenerating ? (
          <Sparkles className="animate-spin mr-2" size={16} />
        ) : (
          <Sparkles className="mr-2" size={16} />
        )}
        {t.labels.aiBtn}
      </Button>

      {data.generatedText && (
        <div className="mt-3 fade-enter">
          <Label>{t.labels.aiResult}</Label>
          <div className="theme-card p-4 rounded-xl border theme-border shadow-sm text-sm leading-relaxed theme-text-secondary italic">
            {data.generatedText}
          </div>
        </div>
      )}
    </div>
  );
});

Step4Description.displayName = 'Step4Description';

export default Step4Description;
