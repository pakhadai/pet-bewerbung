import React from 'react';
import Label from '../Label';
import Input from '../Input';

const Step1OwnerInfo = React.memo(({ data, updateData, t, animDir, errors = {} }) => {
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label required>{t.labels.ownerName}</Label>
          <Input
            value={data.ownerName}
            onChange={e => updateData('ownerName', e.target.value)}
            placeholder="Max Mustermann"
            error={errors.ownerName}
          />
          {errors.ownerName && (
            <span className="text-red-500 text-xs mt-1">{t.validation?.ownerNameRequired || 'Name is required (min. 2 characters)'}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t.labels.street}</Label>
            <Input
              value={data.street}
              onChange={e => updateData('street', e.target.value)}
              placeholder="Bahnhofstrasse"
            />
          </div>
          <div>
            <Label>{t.labels.houseNumber}</Label>
            <Input
              value={data.houseNumber}
              onChange={e => updateData('houseNumber', e.target.value)}
              placeholder="12A"
            />
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
            {errors.postal && (
              <span className="text-red-500 text-xs mt-1">{t.validation?.postalInvalid || 'Postal code must be 4 digits'}</span>
            )}
          </div>
          <div>
            <Label>{t.labels.city}</Label>
            <Input
              value={data.city}
              onChange={e => updateData('city', e.target.value)}
              placeholder="St. Gallen"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{t.labels.email}</Label>
            <Input
              type="email"
              value={data.email}
              onChange={e => updateData('email', e.target.value)}
              error={errors.email}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">{t.validation?.emailInvalid || 'Invalid email address'}</span>
            )}
          </div>
          <div>
            <Label>{t.labels.phone}</Label>
            <Input
              type="tel"
              value={data.phone}
              onChange={e => updateData('phone', e.target.value)}
              error={errors.phone}
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1">{t.validation?.phoneInvalid || 'Invalid phone number'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Step1OwnerInfo.displayName = 'Step1OwnerInfo';

export default Step1OwnerInfo;
