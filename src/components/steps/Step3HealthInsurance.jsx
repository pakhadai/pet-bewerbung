import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Label from '../Label';
import Input from '../Input';

const Step3HealthInsurance = React.memo(({ data, updateData, t, animDir, darkMode, onPrev, onNext }) => {
  const [showMore, setShowMore] = useState(
    !!(data.insuranceProvider || data.chipId || data.medicalConditions || data.previousLandlordName || data.emergencyContactName)
  );

  const cardCl = darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-white/80 border-gray-300';
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const statusOptions = [
    { id: 'isNeutered', label: t?.labels?.neutered ?? 'Kastriert' },
    { id: 'hasVaccination', label: t?.labels?.vaccination ?? 'Geimpft' },
    { id: 'hasRegistration', label: t?.labels?.registration ?? 'Registriert' }
  ];

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter max-w-3xl mx-auto pb-24`}>
      <div className={`mb-4 flex items-center gap-3 px-4 py-3 rounded-xl border-2 hand-drawn-border ${darkMode ? 'bg-primary/10 border-primary/50' : 'bg-primary/5 border-primary/30'}`}>
        <span className="material-symbols-outlined text-primary sketch-icon-filled">lock</span>
        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-text-main'}`}>
          {t?.step2Emergency?.privacyText ?? 'Private & Secure: Your emergency contacts are only stored locally in this browser session.'}
        </span>
      </div>

      <div className={`hand-drawn-border border-2 rounded-2xl p-6 md:p-8 ${cardCl} shadow-lg`}>
        <h2 className={`font-display font-bold text-2xl md:text-3xl mb-1 ${titleCl}`}>
          {t?.stepsNew?.step2?.title ?? 'Emergency Info'}
        </h2>
        <p className={`font-sans text-sm md:text-base mb-6 ${mutedCl}`}>
          {t?.stepsNew?.step2?.subtitle ?? 'Vet & contacts'}
        </p>

        {/* Emergency contacts – завжди видно */}
        <div className="space-y-4">
          <h3 className={`font-display font-bold text-lg flex items-center gap-2 ${titleCl}`}>
            <span className="material-symbols-outlined text-primary">medical_services</span>
            {t?.step2Emergency?.emergencyContacts ?? 'Emergency contacts'}
          </h3>
          <div>
            <Label>{t?.step2Emergency?.vetName ?? t?.labels?.vet ?? 'Vet name'}</Label>
            <Input value={data.vetName ?? ''} onChange={(e) => updateData('vetName', e.target.value)} placeholder="z.B. Dr. Muster" />
          </div>
          <div>
            <Label>{t?.step2Emergency?.vetClinicPhone ?? 'Telefon Tierarzt'}</Label>
            <Input value={data.vetPhone ?? ''} onChange={(e) => updateData('vetPhone', e.target.value)} placeholder="+41 79 123 45 67" type="tel" />
          </div>
          <div>
            <Label>{t?.step2Emergency?.secondaryContact ?? 'Zweiter Notfallkontakt'}</Label>
            <Input value={data.secondaryEmergencyContact ?? ''} onChange={(e) => updateData('secondaryEmergencyContact', e.target.value)} placeholder={t?.step2Emergency?.secondaryContact ?? 'Name & Tel. (z.B. Nachbar, Familie)'} />
          </div>
        </div>

        {/* Перемикач: показувати додаткові поля */}
        <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-400/50 dark:border-gray-500/50">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className={`font-display font-bold text-base ${titleCl}`}>
                {t?.step2Emergency?.showMore ?? 'Weitere Angaben anzeigen'}
              </p>
              <p className={`text-sm mt-1 ${mutedCl}`}>
                {t?.step2Emergency?.showMoreHint ?? 'Versicherung, Chip, Verhalten, Referenzen usw.'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showMore}
              onClick={() => setShowMore(!showMore)}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 hand-drawn-border transition-colors ${
                showMore ? 'bg-primary border-primary' : (darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-400')
              }`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition translate-y-0.5 ${showMore ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {showMore && (
            <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Versicherung & Chip */}
              <div className="space-y-3">
                <h4 className={`font-display font-bold text-base ${titleCl}`}>{t?.labels?.insurance ?? 'Versicherung'}</h4>
                <Input value={data.insuranceProvider ?? ''} onChange={(e) => updateData('insuranceProvider', e.target.value)} placeholder="z.B. AXA, Mobiliar" />
                <div>
                  <Label>{t?.labels?.chipId ?? 'Chip-Nr.'}</Label>
                  <Input value={data.chipId ?? ''} onChange={(e) => updateData('chipId', e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  {statusOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between p-3 rounded-xl border-2 hand-drawn-border theme-card cursor-pointer hover:theme-card-bg-hover transition-colors">
                      <span className="text-sm font-medium theme-text">{opt.label}</span>
                      <input type="checkbox" className="w-5 h-5" checked={!!data[opt.id]} onChange={(e) => updateData(opt.id, e.target.checked)} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Verhalten & Routine */}
              <div className="space-y-3">
                <h4 className={`font-display font-bold text-base ${titleCl}`}>{t?.labels?.behaviorTitle ?? 'Verhalten & Routine'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t?.labels?.noiseLevel ?? 'Lautstärke'}</Label>
                    <select className="theme-input w-full p-3 border-2 hand-drawn-border rounded-xl text-sm" value={data.noiseLevel ?? 'low'} onChange={(e) => updateData('noiseLevel', e.target.value)}>
                      <option value="low">{t?.labels?.noiseLow ?? 'Ruhig'}</option>
                      <option value="medium">{t?.labels?.noiseMedium ?? 'Mittel'}</option>
                      <option value="high">{t?.labels?.noiseHigh ?? 'Laut'}</option>
                    </select>
                  </div>
                  <div>
                    <Label>{t?.labels?.aloneTime ?? 'Alleine (h)'}</Label>
                    <Input type="number" min="0" max="24" value={data.aloneTime ?? ''} onChange={(e) => updateData('aloneTime', e.target.value)} placeholder="0–24" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>{t?.labels?.activeHours ?? 'Aktivste Zeiten'}</Label>
                    <Input value={data.activeHours ?? ''} onChange={(e) => updateData('activeHours', e.target.value)} placeholder="07:00–09:00, 18:00–20:00" />
                  </div>
                  <div>
                    <Label>{t?.labels?.behaviorWithChildren ?? 'Verhalten mit Kindern'}</Label>
                    <select className="theme-input w-full p-3 border-2 hand-drawn-border rounded-xl text-sm" value={data.behaviorWithChildren ?? ''} onChange={(e) => updateData('behaviorWithChildren', e.target.value)}>
                      <option value="">—</option>
                      <option value="good">{t?.labels?.behaviorGood ?? 'Gut'}</option>
                      <option value="neutral">{t?.labels?.behaviorNeutral ?? 'Neutral'}</option>
                      <option value="avoid">{t?.labels?.behaviorAvoid ?? 'Vermeiden'}</option>
                    </select>
                  </div>
                  <div>
                    <Label>{t?.labels?.behaviorWithPets ?? 'Verhalten mit anderen Tieren'}</Label>
                    <select className="theme-input w-full p-3 border-2 hand-drawn-border rounded-xl text-sm" value={data.behaviorWithPets ?? ''} onChange={(e) => updateData('behaviorWithPets', e.target.value)}>
                      <option value="">—</option>
                      <option value="good">{t?.labels?.behaviorGood ?? 'Gut'}</option>
                      <option value="neutral">{t?.labels?.behaviorNeutral ?? 'Neutral'}</option>
                      <option value="avoid">{t?.labels?.behaviorAvoid ?? 'Vermeiden'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Referenzen & Notfallkontakt */}
              <div className="space-y-3">
                <h4 className={`font-display font-bold text-base ${titleCl}`}>{t?.labels?.referenceTitle ?? 'Referenzen & Notfallkontakt'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>{t?.labels?.previousLandlordName ?? 'Name Vermieter'}</Label>
                    <Input value={data.previousLandlordName ?? ''} onChange={(e) => updateData('previousLandlordName', e.target.value)} />
                  </div>
                  <div>
                    <Label>{t?.labels?.previousDuration ?? 'Dauer'}</Label>
                    <Input value={data.previousDuration ?? ''} onChange={(e) => updateData('previousDuration', e.target.value)} placeholder="3 Jahre" />
                  </div>
                  <div>
                    <Label>{t?.labels?.previousLandlordPhone ?? 'Tel. Vermieter'}</Label>
                    <Input value={data.previousLandlordPhone ?? ''} onChange={(e) => updateData('previousLandlordPhone', e.target.value)} placeholder="+41 XX XXX XX XX" />
                  </div>
                  <div>
                    <Label>{t?.labels?.previousLandlordEmail ?? 'E-Mail Vermieter'}</Label>
                    <Input type="email" value={data.previousLandlordEmail ?? ''} onChange={(e) => updateData('previousLandlordEmail', e.target.value)} />
                  </div>
                  <div>
                    <Label>{t?.labels?.emergencyContactName ?? 'Notfall Name'}</Label>
                    <Input value={data.emergencyContactName ?? ''} onChange={(e) => updateData('emergencyContactName', e.target.value)} />
                  </div>
                  <div>
                    <Label>{t?.labels?.emergencyContactRelation ?? 'Beziehung'}</Label>
                    <Input value={data.emergencyContactRelation ?? ''} onChange={(e) => updateData('emergencyContactRelation', e.target.value)} placeholder="Freund, Familie" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>{t?.labels?.emergencyContactPhone ?? 'Notfall Tel.'}</Label>
                    <Input value={data.emergencyContactPhone ?? ''} onChange={(e) => updateData('emergencyContactPhone', e.target.value)} placeholder="+41 XX XXX XX XX" />
                  </div>
                </div>
              </div>

              {/* Medizinische Angaben (Allergien/Medikamente) */}
              <div>
                <Label>{t?.step2Emergency?.displayMedical ?? 'Allergien / Medikamente'}</Label>
                <textarea
                  value={data.medicalConditions ?? ''}
                  onChange={(e) => updateData('medicalConditions', e.target.value)}
                  placeholder={t?.step2Emergency?.medicalHint ?? 'z.B. Pollenallergie, Medikament X'}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 hand-drawn-border text-sm resize-y theme-input mt-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <button type="button" onClick={onPrev} className={`font-display font-bold hand-drawn-button border-2 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${darkMode ? 'border-gray-400 text-gray-200 hover:bg-gray-700' : 'border-gray-500 text-text-main hover:bg-gray-100'}`}>
            <ChevronLeft size={20} strokeWidth={2.5} />
            {t?.nav?.back ?? 'Back'}
          </button>
          <button type="button" onClick={onNext} className="font-display font-bold hand-drawn-button border-2 px-6 py-2.5 rounded-xl flex items-center gap-2 border-primary bg-primary text-white hover:bg-primary-dark transition-all">
            {t?.nav?.nextPhotos ?? 'Weiter: Fotos'}
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
});

Step3HealthInsurance.displayName = 'Step3HealthInsurance';

export default Step3HealthInsurance;
