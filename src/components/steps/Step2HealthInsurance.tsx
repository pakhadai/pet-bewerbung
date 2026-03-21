/**
 * Step2HealthInsurance - Vet, insurance, behavior, references
 */
import React, { useEffect, useState } from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import MaterialIcon from '../MaterialIcon';
import Label from '../Label';
import Input from '../Input';
import { useWizardContext } from '../../context/WizardContext';
import { useFormStore } from '../../stores/formStore';
import type { FormData } from '../../types/form';
import { getShowAdvancedHealthInfo } from '../../utils/getShowAdvancedHealthInfo';

const INSURANCE_AFFILIATE_LINK = import.meta.env.VITE_INSURANCE_AFFILIATE_LINK || '';
const MEDICAL_CONDITIONS_MAX_LENGTH = 200;

const Step2HealthInsurance: React.FC = () => {
  const data = useFormStore((s) => s.data) as FormData;
  const updateData = useFormStore((s) => s.updateData);
  const { t, animDir, darkMode } = useWizardContext();
  const [showMore, setShowMore] = useState<boolean>(() => getShowAdvancedHealthInfo(data));

  // Backward compatibility for drafts created before the toggle existed.
  useEffect(() => {
    if (typeof data.showAdvancedHealthInfo !== 'boolean') {
      updateData('showAdvancedHealthInfo', showMore);
    }
  }, [data.showAdvancedHealthInfo, showMore, updateData]);

  const cardCl = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300';
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';
  const statusOptions = [
    { id: 'isNeutered', label: t?.labels?.neutered ?? 'Kastriert' },
    { id: 'hasVaccination', label: t?.labels?.vaccination ?? 'Geimpft' },
    { id: 'hasRegistration', label: t?.labels?.registration ?? 'Registriert' },
    { id: 'willingToPayDeposit', label: t?.labels?.willingToPayDeposit ?? 'Bereit für Tierkaution' },
  ] as const satisfies ReadonlyArray<{
    id: 'isNeutered' | 'hasVaccination' | 'hasRegistration' | 'willingToPayDeposit';
    label: string;
  }>;

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter max-w-3xl mx-auto pb-32`}>
      <div className={`hand-drawn-border border-2 rounded-2xl p-6 md:p-8 ${cardCl} shadow-lg`}>
        <h2 className={`font-display font-bold text-2xl md:text-3xl mb-1 ${titleCl}`}>
          {t?.stepsNew?.step2?.title ?? 'Emergency Info'}
        </h2>
        <p className={`font-sans text-sm md:text-base mb-6 ${mutedCl}`}>
          {t?.stepsNew?.step2?.subtitle ?? 'Vet & contacts'}
        </p>

        <div className="space-y-4">
          <h3 className={`font-display font-bold text-lg flex items-center gap-2 ${titleCl}`}>
            <MaterialIcon name="medical_services" className="text-primary" />
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
        </div>

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
              onClick={() => {
                const next = !showMore;
                updateData('showAdvancedHealthInfo', next);
                setShowMore(next);
              }}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 hand-drawn-border transition-colors ${
                showMore ? 'bg-primary border-primary' : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-400'
              }`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition translate-y-0.5 ${showMore ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {showMore && (
            <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-3">
                <h4 className={`font-display font-bold text-base ${titleCl}`}>{t?.labels?.insurance ?? 'Versicherung'}</h4>
                <Input value={data.insuranceProvider ?? ''} onChange={(e) => updateData('insuranceProvider', e.target.value)} placeholder="z.B. AXA, Mobiliar" />
                {INSURANCE_AFFILIATE_LINK && (!data.insuranceProvider || String(data.insuranceProvider).length < 3) && (
                  <div className={`mt-2 p-3 rounded-xl flex items-start gap-3 ${darkMode ? 'bg-blue-900/30 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-800 text-blue-300' : 'bg-white text-blue-600'}`}>
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                        {t?.affiliate?.insuranceTitle ?? 'Noch keine Haftpflichtversicherung?'}
                      </p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                        {t?.affiliate?.insuranceDesc ?? 'Vermieter verlangen oft einen Nachweis. Schützen Sie sich und Ihr Tier ab 5 CHF/Monat.'}
                      </p>
                      <a
                        href={INSURANCE_AFFILIATE_LINK}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {t?.affiliate?.insuranceCta ?? 'Angebote vergleichen'} <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
                <div>
                  <Label>{t?.labels?.chipId ?? 'Chip-Nr.'}</Label>
                  <Input value={data.chipId ?? ''} onChange={(e) => updateData('chipId', e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  {statusOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between p-3 rounded-xl border-2 hand-drawn-border theme-card cursor-pointer hover:theme-card-bg-hover transition-colors">
                      <span className="text-sm font-medium theme-text">{opt.label}</span>
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={Boolean(data[opt.id])}
                        onChange={(e) => updateData(opt.id, e.target.checked)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className={`font-display font-bold text-base ${titleCl}`}>{t?.labels?.behaviorTitle ?? 'Verhalten & Routine'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-3">
                <h4 className={`font-display font-bold text-base ${titleCl}`}>{t?.labels?.referenceTitle ?? 'Referenzen & Notfallkontakt'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <Label>{t?.step2Emergency?.displayMedical ?? 'Allergien / Medikamente'}</Label>
                <textarea
                  value={data.medicalConditions ?? ''}
                  onChange={(e) => updateData('medicalConditions', e.target.value.slice(0, MEDICAL_CONDITIONS_MAX_LENGTH))}
                  placeholder={t?.step2Emergency?.medicalHint ?? 'z.B. Pollenallergie, Medikament X'}
                  maxLength={MEDICAL_CONDITIONS_MAX_LENGTH}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 hand-drawn-border text-sm resize-y theme-input mt-1"
                />
                <div className={`mt-1 text-right text-xs ${mutedCl}`}>
                  {(data.medicalConditions ?? '').length} / {MEDICAL_CONDITIONS_MAX_LENGTH}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2HealthInsurance;
