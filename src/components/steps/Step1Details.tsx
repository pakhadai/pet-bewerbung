/**
 * Step1Details - Owner & Pet information
 * Step 1 in the wizard
 */
import React, { useState, useCallback } from 'react';
import { Dog, Cat, Bird } from 'lucide-react';
import Label from '../Label';
import FormInput from '../FormInput';
import { useWizardContext } from '../../context/WizardContext';
import { useFormStore } from '../../stores/formStore';
import type { FormData } from '../../types/form';

const Step1Details: React.FC = () => {
  const data = useFormStore((s) => s.data) as FormData;
  const updateData = useFormStore((s) => s.updateData);
  const { t, animDir, darkMode, validationErrors = {} } = useWizardContext();
  const errors = validationErrors;
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = useCallback((field: string) => setTouched((prev) => ({ ...prev, [field]: true })), []);
  const petTypes = [
    { id: 'dog', label: t?.labels?.dog ?? 'Hund', icon: Dog },
    { id: 'cat', label: t?.labels?.cat ?? 'Katze', icon: Cat },
    { id: 'other', label: t?.labels?.other ?? 'Anderes', icon: Bird },
  ];

  const cardCl = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300';
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

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className={`font-display font-bold text-lg ${titleCl}`}>
              {t?.step1Details?.ownerSection ?? 'Owner Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label required>{t?.labels?.ownerName}</Label>
                <FormInput
                  value={data.ownerName ?? ''}
                  onChange={(val) => updateData('ownerName', val)}
                  onBlur={() => markTouched('ownerName')}
                  placeholder={t?.placeholders?.ownerName ?? 'e.g. John Doe'}
                  error={touched.ownerName && errors?.ownerName}
                />
                {touched.ownerName && errors?.ownerName && (
                  <span className="text-red-500 text-xs mt-1 block">{t?.validation?.ownerNameRequired ?? 'Name is required (min. 2 characters)'}</span>
                )}
              </div>
              <div>
                <Label>{t?.labels?.street}</Label>
                <FormInput value={data.street ?? ''} onChange={(val) => updateData('street', val)} placeholder={t?.placeholders?.street ?? 'e.g. Bahnhofstrasse'} />
              </div>
              <div>
                <Label>{t?.labels?.houseNumber}</Label>
                <FormInput value={data.houseNumber ?? ''} onChange={(val) => updateData('houseNumber', val)} placeholder="12A" />
              </div>
              <div>
                <Label>{t?.labels?.postal}</Label>
                <FormInput
                  value={data.postal ?? ''}
                  onChange={(val) => updateData('postal', val)}
                  onBlur={() => markTouched('postal')}
                  placeholder="9000"
                  error={touched.postal && errors?.postal}
                />
                {touched.postal && errors?.postal && <span className="text-red-500 text-xs mt-1 block">{t?.validation?.postalInvalid ?? 'Invalid'}</span>}
              </div>
              <div>
                <Label>{t?.labels?.city}</Label>
                <FormInput value={data.city ?? ''} onChange={(val) => updateData('city', val)} placeholder="St. Gallen" />
              </div>
              <div>
                <Label>{t?.labels?.email}</Label>
                <FormInput
                  type="email"
                  value={data.email ?? ''}
                  onChange={(val) => updateData('email', val)}
                  onBlur={() => markTouched('email')}
                  placeholder="email@example.com"
                  error={touched.email && errors?.email}
                />
                {touched.email && errors?.email && <span className="text-red-500 text-xs mt-1 block">{t?.validation?.emailInvalid ?? 'Invalid'}</span>}
              </div>
              <div>
                <Label>{t?.labels?.phone}</Label>
                <FormInput
                  type="tel"
                  value={data.phone ?? ''}
                  onChange={(val) => updateData('phone', val)}
                  onBlur={() => markTouched('phone')}
                  placeholder="+41 79 123 45 67"
                  error={touched.phone && errors?.phone}
                />
                {touched.phone && errors?.phone && <span className="text-red-500 text-xs mt-1 block">{t?.validation?.phoneInvalid ?? 'Invalid'}</span>}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t-2 border-dashed border-gray-400/50 dark:border-gray-500/50">
            <h3 className={`font-display font-bold text-lg ${titleCl}`}>
              {t?.step1Details?.petSection ?? 'Pet Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label required>{t?.labels?.petType ?? 'Pet Type'}</Label>
                <div className={`grid grid-cols-3 gap-3 ${touched.petType && errors?.petType ? 'ring-2 ring-red-500 rounded-xl p-1' : ''}`}>
                  {petTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        updateData('petType', type.id);
                        markTouched('petType');
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hand-drawn-border ${
                        data.petType === type.id ? 'border-primary bg-primary/10' : 'theme-border theme-card hover:theme-card-bg-hover'
                      }`}
                    >
                      <type.icon size={24} className="mb-2" />
                      <span className="text-sm font-semibold">{type.label}</span>
                    </button>
                  ))}
                </div>
                {touched.petType && errors?.petType && <span className="text-red-500 text-xs mt-1 block">{t?.validation?.petTypeRequired ?? 'Please select a pet type'}</span>}
              </div>
              <div className="md:col-span-2">
                <Label required>{t?.labels?.petName}</Label>
                <FormInput
                  value={data.name ?? ''}
                  onChange={(val) => updateData('name', val)}
                  onBlur={() => markTouched('name')}
                  placeholder={t?.placeholders?.petName ?? 'e.g. Luna'}
                  error={touched.name && errors?.name}
                />
                {touched.name && errors?.name && <span className="text-red-500 text-xs mt-1 block">{t?.validation?.petNameRequired ?? 'Required'}</span>}
              </div>
              <div>
                <Label>{t?.labels?.breed}</Label>
                <FormInput value={data.breed ?? ''} onChange={(val) => updateData('breed', val)} placeholder={t?.placeholders?.breed ?? 'e.g. Beagle'} />
              </div>
              <div>
                <Label>{t?.labels?.age}</Label>
                <FormInput type="number" min="0" max="30" value={data.age ?? ''} onChange={(val) => updateData('age', val)} placeholder="0" />
              </div>
              <div>
                <Label>{t?.labels?.weight ?? 'Gewicht (kg)'}</Label>
                <FormInput type="number" min="0" max="200" step="0.1" value={data.weight ?? ''} onChange={(val) => updateData('weight', val)} placeholder="0" />
              </div>
              <div>
                <Label>{t?.labels?.gender ?? 'Geschlecht'}</Label>
                <select
                  value={data.gender ?? ''}
                  onChange={(e) => updateData('gender', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 hand-drawn-border text-sm transition-colors ${
                    darkMode ? 'bg-gray-700 border-gray-500 text-white' : 'bg-white border-gray-300 text-text-main'
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

      </div>
    </div>
  );
};

export default Step1Details;
