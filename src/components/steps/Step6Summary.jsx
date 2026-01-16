import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const Step6Summary = React.memo(({ data, t, animDir }) => {
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-2xl mx-auto`}>
      <div className="theme-card rounded-2xl p-5 theme-border border space-y-3 scale-hover">
        <div className="grid grid-cols-2 gap-3 text-sm slide-up-stagger">
          <div>
            <span className="theme-text-muted font-medium">{t.summary.owner}:</span>
            <p className="theme-text font-semibold">{data.ownerName || '—'}</p>
          </div>
          <div>
            <span className="theme-text-muted font-medium">{t.summary.address}:</span>
            <p className="theme-text">{data.street} {data.houseNumber}, {data.postal} {data.city}</p>
          </div>
          <div>
            <span className="theme-text-muted font-medium">{t.summary.petName}:</span>
            <p className="theme-text font-semibold">{data.name || '—'}</p>
          </div>
          <div>
            <span className="theme-text-muted font-medium">{t.summary.breed}:</span>
            <p className="theme-text">{data.breed || '—'}</p>
          </div>
          <div>
            <span className="theme-text-muted font-medium">{t.summary.ageWeight}:</span>
            <p className="theme-text">{data.age || '—'} / {data.weight || '—'}</p>
          </div>
          <div>
            <span className="theme-text-muted font-medium">{t.summary.gender}:</span>
            <p className="theme-text">{data.gender === 'm' ? t.labels.m : t.labels.f}</p>
          </div>

          {data.noiseLevel && (
            <div>
              <span className="theme-text-muted font-medium">{t.labels.noiseLevel}:</span>
              <p className="theme-text">
                {data.noiseLevel === 'low' ? t.labels.noiseLow :
                 data.noiseLevel === 'medium' ? t.labels.noiseMedium : t.labels.noiseHigh}
              </p>
            </div>
          )}

          {data.aloneTime && (
            <div>
              <span className="theme-text-muted font-medium">{t.labels.aloneTime}:</span>
              <p className="theme-text">{data.aloneTime}h</p>
            </div>
          )}

          {data.behaviorWithChildren && (
            <div>
              <span className="theme-text-muted font-medium">{t.labels.behaviorWithChildren}:</span>
              <p className="theme-text">
                {data.behaviorWithChildren === 'good' ? t.labels.behaviorGood :
                 data.behaviorWithChildren === 'neutral' ? t.labels.behaviorNeutral : t.labels.behaviorAvoid}
              </p>
            </div>
          )}

          {data.previousLandlordName && (
            <div>
              <span className="theme-text-muted font-medium">{t.labels.previousLandlord}:</span>
              <p className="theme-text">{data.previousLandlordName}</p>
            </div>
          )}

          {data.emergencyContactName && (
            <div>
              <span className="theme-text-muted font-medium">{t.labels.emergencyContact}:</span>
              <p className="theme-text">{data.emergencyContactName}</p>
            </div>
          )}
        </div>

        {data.generatedText && (
          <div className="pt-3 border-t theme-border">
            <span className="theme-text-muted font-medium text-sm">{t.summary.description}:</span>
            <p className="theme-text-secondary text-sm mt-1 leading-relaxed italic">
              {data.generatedText}
            </p>
          </div>
        )}

        {data.photo && (
          <div className="pt-3 border-t theme-border flex justify-center">
            <img src={data.photo} alt="Pet" className="w-28 h-28 object-cover rounded-xl shadow-sm" />
          </div>
        )}
      </div>

      <div className="theme-info-box rounded-xl p-3 text-sm text-center">
        <CheckCircle2 size={18} className="inline mr-2" />
        {t.summary.confirmation}
      </div>
    </div>
  );
});

Step6Summary.displayName = 'Step6Summary';

export default Step6Summary;
