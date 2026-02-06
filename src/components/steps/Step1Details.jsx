/**
 * Step1Details.jsx
 * 
 * ACTUAL STEP: 1 (in App.tsx: step === 1)
 * 
 * This component combines Owner and Pet information into a single form:
 * - Owner: name, address (street, house number, postal, city), email, phone
 * - Pet: type (dog/cat/other), name, breed, age, weight, gender
 * 
 * Note: The file name is correct - this is the first step in the wizard.
 */
import React from 'react';
import { Dog, Cat, Bird } from 'lucide-react';
import Label from '../Label';
import Input from '../Input';
import { useForm } from '../../contexts/FormContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../contexts/TranslationContext';

const Step1Details = React.memo(({ animDir, errors = {} }) => {
  const { data, updateData } = useForm();
  const { darkMode } = useTheme();
  const { t } = useTranslation();
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
    <div className={`page page-enter-${animDir} reveal fade-enter max-w-4xl mx-auto pb-32`}>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.labels.weight ?? 'Gewicht (kg)'}</Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  step="0.1"
                  value={data.weight}
                  onChange={e => updateData('weight', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>{t.labels.gender ?? 'Geschlecht'}</Label>
                <select
                  value={data.gender || ''}
                  onChange={e => updateData('gender', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 hand-drawn-border text-sm transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-500 text-white' 
                      : 'bg-white border-gray-300 text-text-main'
                  }`}
                >
                  <option value="">{t?.placeholders?.selectGender ?? 'Auswählen...'}</option>
                  <option value="male">{t?.labels?.male ?? 'Männlich'}</option>
                  <option value="female">{t?.labels?.female ?? 'Weiblich'}</option>
                </select>
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

      </div>
    </div>
  );
});

Step1Details.displayName = 'Step1Details';

export default Step1Details;
