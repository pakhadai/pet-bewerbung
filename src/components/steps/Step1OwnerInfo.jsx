import React from 'react';
import Label from '../Label';
import Input from '../Input';

const Step1OwnerInfo = React.memo(({ data, updateData, t, animDir }) => {
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label>{t.labels.ownerName}</Label>
          <Input
            value={data.ownerName}
            onChange={e => updateData('ownerName', e.target.value)}
            placeholder="Max Mustermann"
          />
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
            />
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
            />
          </div>
          <div>
            <Label>{t.labels.phone}</Label>
            <Input
              type="tel"
              value={data.phone}
              onChange={e => updateData('phone', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Step1OwnerInfo.displayName = 'Step1OwnerInfo';

export default Step1OwnerInfo;
