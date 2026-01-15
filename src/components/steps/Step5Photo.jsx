import React from 'react';
import { Camera } from 'lucide-react';

const Step5Photo = ({ data, onFileChange, t, animDir }) => {
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 text-center max-w-lg mx-auto`}>
      <div className="relative group cursor-pointer inline-block w-full">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`aspect-square w-full max-w-[240px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
          data.photo
            ? 'border-primary p-2'
            : 'theme-border theme-bg-secondary hover:theme-card-bg-hover hover:scale-105'
        }`}>
          {data.photo ? (
            <img
              src={data.photo}
              className="w-full h-full object-cover rounded-xl shadow-sm"
              alt="Pet"
            />
          ) : (
            <>
              <div className="w-14 h-14 theme-bg-secondary rounded-full flex items-center justify-center mb-3 theme-text-muted">
                <Camera size={28} />
              </div>
              <span className="theme-text font-medium">{t.labels.photo}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5Photo;
