import React from 'react';
import { ShieldCheck, Volume2, Phone } from 'lucide-react';
import Label from '../Label';
import Input from '../Input';

const Step3HealthInsurance = React.memo(({ data, updateData, t, animDir, darkMode }) => {
  const statusOptions = [
    { id: 'isNeutered', label: t.labels.neutered },
    { id: 'hasVaccination', label: t.labels.vaccination },
    { id: 'hasRegistration', label: t.labels.registration }
  ];

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 max-w-3xl mx-auto pb-24`}>
      {/* Insurance Section */}
      <div className="theme-card rounded-2xl p-5 border theme-border">
        <div className="p-3 theme-info-box rounded-xl text-sm flex gap-3 leading-relaxed border mb-5">
          <ShieldCheck className="shrink-0 mt-0.5" size={18} />
          <span>{data.petType === 'dog' ? t.ui.insuranceInfoDog : t.ui.insuranceInfoCat}</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>{t.labels.insurance}</Label>
            <Input
              value={data.insuranceProvider}
              onChange={e => updateData('insuranceProvider', e.target.value)}
              placeholder="z.B. AXA, Mobiliar"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t.labels.chipId}</Label>
              <Input
                value={data.chipId}
                onChange={e => updateData('chipId', e.target.value)}
              />
            </div>
            <div>
              <Label>{t.labels.vet}</Label>
              <Input
                value={data.vetName}
                onChange={e => updateData('vetName', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          {statusOptions.map(opt => (
            <label
              key={opt.id}
              className="flex items-center justify-between p-3 theme-border rounded-xl cursor-pointer hover:theme-card-bg-hover transition-colors theme-card hover-glass"
            >
              <span className="text-sm font-medium theme-text">{opt.label}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                data[opt.id] ? 'theme-radio-selected' : 'theme-border'
              }`}>
                {data[opt.id] && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={data[opt.id]}
                onChange={e => updateData(opt.id, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Behavior & Daily Routine Section */}
      <div className="theme-card rounded-2xl p-5 border theme-border">
        <h3 className="text-base font-bold theme-text mb-4 flex items-center gap-2">
          <Volume2 size={18} />
          {t.labels.behaviorTitle || 'Verhalten & Routine'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t.labels.noiseLevel}</Label>
            <select
              className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all"
              value={data.noiseLevel}
              onChange={e => updateData('noiseLevel', e.target.value)}
            >
              <option value="low">{t.labels.noiseLow}</option>
              <option value="medium">{t.labels.noiseMedium}</option>
              <option value="high">{t.labels.noiseHigh}</option>
            </select>
          </div>
          <div>
            <Label>{t.labels.aloneTime}</Label>
            <Input
              type="number"
              min="0"
              max="24"
              value={data.aloneTime}
              onChange={e => updateData('aloneTime', e.target.value)}
              placeholder="0-24"
            />
          </div>
          <div className="md:col-span-2">
            <Label>{t.labels.activeHours}</Label>
            <Input
              value={data.activeHours}
              onChange={e => updateData('activeHours', e.target.value)}
              placeholder="07:00-09:00, 18:00-20:00"
            />
          </div>
          <div>
            <Label>{t.labels.behaviorWithChildren}</Label>
            <select
              className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all"
              value={data.behaviorWithChildren}
              onChange={e => updateData('behaviorWithChildren', e.target.value)}
            >
              <option value="">{t.labels.behaviorNeutral}</option>
              <option value="good">{t.labels.behaviorGood}</option>
              <option value="neutral">{t.labels.behaviorNeutral}</option>
              <option value="avoid">{t.labels.behaviorAvoid}</option>
            </select>
          </div>
          <div>
            <Label>{t.labels.behaviorWithPets}</Label>
            <select
              className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all"
              value={data.behaviorWithPets}
              onChange={e => updateData('behaviorWithPets', e.target.value)}
            >
              <option value="">{t.labels.behaviorNeutral}</option>
              <option value="good">{t.labels.behaviorGood}</option>
              <option value="neutral">{t.labels.behaviorNeutral}</option>
              <option value="avoid">{t.labels.behaviorAvoid}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reference & Emergency Contact Section */}
      <div className="theme-card rounded-2xl p-5 border theme-border">
        <h3 className="text-base font-bold theme-text mb-4 flex items-center gap-2">
          <Phone size={18} />
          {t.labels.referenceTitle || 'Referenzen & Notfallkontakt'}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="pb-4 border-b theme-border">
            <Label className="text-sm font-semibold mb-2 block">{t.labels.previousLandlord}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.previousLandlordName}</Label>
                <Input
                  value={data.previousLandlordName}
                  onChange={e => updateData('previousLandlordName', e.target.value)}
                />
              </div>
              <div>
                <Label>{t.labels.previousDuration}</Label>
                <Input
                  value={data.previousDuration}
                  onChange={e => updateData('previousDuration', e.target.value)}
                  placeholder="3 Jahre"
                />
              </div>
              <div>
                <Label>{t.labels.previousLandlordPhone}</Label>
                <Input
                  value={data.previousLandlordPhone}
                  onChange={e => updateData('previousLandlordPhone', e.target.value)}
                  placeholder="+41 XX XXX XX XX"
                />
              </div>
              <div>
                <Label>{t.labels.previousLandlordEmail}</Label>
                <Input
                  type="email"
                  value={data.previousLandlordEmail}
                  onChange={e => updateData('previousLandlordEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold mb-2 block">{t.labels.emergencyContact}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.emergencyContactName}</Label>
                <Input
                  value={data.emergencyContactName}
                  onChange={e => updateData('emergencyContactName', e.target.value)}
                />
              </div>
              <div>
                <Label>{t.labels.emergencyContactRelation}</Label>
                <Input
                  value={data.emergencyContactRelation}
                  onChange={e => updateData('emergencyContactRelation', e.target.value)}
                  placeholder="Freund, Familie"
                />
              </div>
              <div className="md:col-span-2">
                <Label>{t.labels.emergencyContactPhone}</Label>
                <Input
                  value={data.emergencyContactPhone}
                  onChange={e => updateData('emergencyContactPhone', e.target.value)}
                  placeholder="+41 XX XXX XX XX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Step3HealthInsurance.displayName = 'Step3HealthInsurance';

export default Step3HealthInsurance;
