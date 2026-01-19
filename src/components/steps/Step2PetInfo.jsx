import React from 'react';
import { Dog, Cat, Bird } from 'lucide-react';
import Label from '../Label';
import Input from '../Input';

const Step2PetInfo = React.memo(({ data, updateData, t, animDir, errors = {} }) => {
  const petTypes = [
    { id: 'dog', label: t.labels.dog, icon: Dog },
    { id: 'cat', label: t.labels.cat, icon: Cat },
    { id: 'other', label: t.labels.other, icon: Bird }
  ];

  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
      <div>
        <Label required>{t.labels.petType || t.labels.type || 'Pet Type'}</Label>
        <div className={`grid grid-cols-3 gap-2 mb-2 ${errors.petType ? 'ring-2 ring-red-500 rounded-xl p-1' : ''}`}>
          {petTypes.map(type => (
            <button
              key={type.id}
              onClick={() => updateData('petType', type.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover-glass ${
                data.petType === type.id ? 'theme-radio-selected' : 'theme-radio theme-border'
              }`}
            >
              <type.icon size={24} className="mb-2" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
        {errors.petType && (
          <span className="text-red-500 text-xs">{t.validation?.petTypeRequired || 'Please select a pet type'}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Label required>{t.labels.petName}</Label>
          <Input
            value={data.name}
            onChange={e => updateData('name', e.target.value)}
            error={errors.name}
          />
          {errors.name && (
            <span className="text-red-500 text-xs mt-1">{t.validation?.petNameRequired || 'Name is required'}</span>
          )}
        </div>
        <div>
          <Label>{t.labels.breed}</Label>
          <Input
            value={data.breed}
            onChange={e => updateData('breed', e.target.value)}
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
          />
        </div>
        <div>
          <Label>{t.labels.weight}</Label>
          <Input
            value={data.weight}
            onChange={e => updateData('weight', e.target.value)}
          />
        </div>
        <div>
          <Label>{t.labels.gender}</Label>
          <div className="flex gap-2 h-[46px]">
            {['m', 'f'].map(g => (
              <label
                key={g}
                className={`flex items-center justify-center gap-2 cursor-pointer border rounded-lg flex-1 transition-colors ${
                  data.gender === g
                    ? 'theme-radio-selected'
                    : 'theme-radio theme-border hover:theme-card-bg-hover'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  checked={data.gender === g}
                  onChange={() => updateData('gender', g)}
                  className="hidden"
                />
                <span className="text-sm font-medium">
                  {g === 'm' ? t.labels.m : t.labels.f}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

Step2PetInfo.displayName = 'Step2PetInfo';

export default Step2PetInfo;
