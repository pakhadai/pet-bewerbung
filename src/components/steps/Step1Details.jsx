import React from 'react';
import { Dog, Cat, Bird } from 'lucide-react';
import Label from '../Label';
import Input from '../Input';

const Step1Details = React.memo(({ data, updateData, t, animDir, errors = {}, darkMode, onNext, canProceed = true }) => {
  const petTypes = [
    { id: 'dog', label: t.labels.dog, icon: Dog },
    { id: 'cat', label: t.labels.cat, icon: Cat },
    { id: 'other', label: t.labels.other, icon: Bird }
  ];

  const cardCl = darkMode
    ? 'bg-gray-800/60 border-gray-600'
    : 'bg-white/80 border-gray-300';
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter max-w-4xl mx-auto pb-24`}>
      <div className={`hand-drawn-border border-2 rounded-2xl p-6 md:p-8 ${cardCl} shadow-lg`}>
        <h2 className={`font-display font-bold text-2xl md:text-3xl mb-1 ${titleCl}`}>
          {t?.stepsNew?.step1?.title ?? 'Pet Owner & Pet Details'}
        </h2>
        <p className={`font-sans text-sm md:text-base mb-6 ${mutedCl}`}>
          {t?.stepsNew?.step1?.subtitle ?? "Let's start with the basics. This information will be used to generate your Pet's CV."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Owner */}
          <div className="space-y-4">
            <h3 className={`font-display font-bold text-lg ${titleCl}`}>
              {t?.step1Details?.ownerSection ?? 'Owner Information'}
            </h3>
            <div>
              <Label required>{t.labels.ownerName}</Label>
              <Input
                value={data.ownerName}
                onChange={e => updateData('ownerName', e.target.value)}
                placeholder={t?.placeholders?.ownerName ?? 'e.g. John Doe'}
                error={errors.ownerName}
              />
              {errors.ownerName && (
                <span className="text-red-500 text-xs mt-1">{t.validation?.ownerNameRequired ?? 'Name is required (min. 2 characters)'}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.street}</Label>
                <Input value={data.street} onChange={e => updateData('street', e.target.value)} placeholder={t?.placeholders?.street ?? 'e.g. Bahnhofstrasse'} />
              </div>
              <div>
                <Label>{t.labels.houseNumber}</Label>
                <Input value={data.houseNumber} onChange={e => updateData('houseNumber', e.target.value)} placeholder="12A" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.postal}</Label>
                <Input
                  value={data.postal}
                  onChange={e => updateData('postal', e.target.value)}
                  placeholder="9000"
                  error={errors.postal}
                />
                {errors.postal && <span className="text-red-500 text-xs mt-1">{t.validation?.postalInvalid ?? 'Invalid'}</span>}
              </div>
              <div>
                <Label>{t.labels.city}</Label>
                <Input value={data.city} onChange={e => updateData('city', e.target.value)} placeholder="St. Gallen" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.email}</Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={e => updateData('email', e.target.value)}
                  placeholder="email@example.com"
                  error={errors.email}
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{t.validation?.emailInvalid ?? 'Invalid'}</span>}
              </div>
              <div>
                <Label>{t.labels.phone}</Label>
                <Input
                  type="tel"
                  value={data.phone}
                  onChange={e => updateData('phone', e.target.value)}
                  placeholder="+41 79 123 45 67"
                  error={errors.phone}
                />
                {errors.phone && <span className="text-red-500 text-xs mt-1">{t.validation?.phoneInvalid ?? 'Invalid'}</span>}
              </div>
            </div>
          </div>

          {/* Pet */}
          <div className="space-y-4">
            <h3 className={`font-display font-bold text-lg ${titleCl}`}>
              {t?.step1Details?.petSection ?? 'Pet Information'}
            </h3>
            <div>
              <Label required>{t.labels.petType ?? 'Pet Type'}</Label>
              <div className={`grid grid-cols-3 gap-2 ${errors.petType ? 'ring-2 ring-red-500 rounded-xl p-1' : ''}`}>
                {petTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateData('petType', type.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all hand-drawn-border ${
                      data.petType === type.id ? 'border-primary bg-primary/10' : 'theme-border theme-card hover:theme-card-bg-hover'
                    }`}
                  >
                    <type.icon size={22} className="mb-1" />
                    <span className="text-xs font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.petType && <span className="text-red-500 text-xs">{t.validation?.petTypeRequired ?? 'Please select a pet type'}</span>}
            </div>
            <div>
              <Label required>{t.labels.petName}</Label>
              <Input
                value={data.name}
                onChange={e => updateData('name', e.target.value)}
                placeholder={t?.placeholders?.petName ?? 'e.g. Luna'}
                error={errors.name}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1">{t.validation?.petNameRequired ?? 'Required'}</span>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.breed}</Label>
                <Input
                  value={data.breed}
                  onChange={e => updateData('breed', e.target.value)}
                  placeholder={t?.placeholders?.breed ?? 'e.g. Beagle'}
                />
              </div>
              <div>
                <Label>{t.labels.age}</Label>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={data.age}
                  onChange={e => updateData('age', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-6 flex items-center gap-3 px-4 py-3 rounded-xl border-2 hand-drawn-border ${darkMode ? 'bg-green-900/20 border-green-600/50' : 'bg-green-50 border-green-200'}`}>
          <span className="material-symbols-outlined text-green-600 dark:text-green-400 sketch-icon-filled">verified_user</span>
          <span className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
            {t?.hero?.privacyDesc ?? 'Your data is private, stays in browser • No servers involved.'}
          </span>
        </div>

        {onNext && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={canProceed ? onNext : undefined}
              disabled={!canProceed}
              className={`font-display font-bold text-xl hand-drawn-button border-2 px-8 py-3 rounded-xl transition-all flex items-center gap-2 ${
                darkMode
                  ? 'border-primary bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'border-primary bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {t?.nav?.nextStep ?? t?.ui?.next ?? 'Next'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

Step1Details.displayName = 'Step1Details';

export default Step1Details;
