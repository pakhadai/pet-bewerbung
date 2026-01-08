import React from 'react';
import { PawPrint, Camera, Dog, Cat, Bird, Phone, Mail } from 'lucide-react';
import StatusItem from './StatusItem';

const SwissDocument = ({ data, t }) => {
  const getLocale = (lang) => {
    switch(lang) {
      case 'de': return 'de-CH';
      case 'fr': return 'fr-CH';
      case 'it': return 'it-CH';
      case 'rm': return 'de-CH';
      case 'ua': return 'uk-UA';
      default: return 'en-GB';
    }
  };
  const today = new Date().toLocaleDateString(getLocale(data.lang));

  return (
    <div className="w-[210mm] h-[297mm] bg-white text-[#111] p-[20mm] font-sans text-sm relative box-border flex flex-col shadow-none mx-auto">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-black text-white p-2 rounded"><PawPrint size={24} /></div>
           <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Swiss Standard Pet CV</div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">{t.doc.title}</h1>
        <div className="flex justify-between items-end border-b-4 border-black pb-4">
           <span className="text-base font-medium text-gray-500">{t.doc.subtitle}</span>
           <span className="text-xs font-mono text-gray-400">ID: {Math.floor(Math.random()*1000000)}</span>
        </div>
      </div>

      <div className="flex gap-12 grow">
        <div className="w-[35%] flex flex-col gap-10">
           <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden relative rounded-sm">
             {data.photo ? (
               <img src={data.photo} className="w-full h-full object-cover grayscale" alt="Pet" />
             ) : (
               <div className="text-gray-300 text-center">
                 <Camera size={32} className="mx-auto mb-2 opacity-50" />
                 NO IMAGE
               </div>
             )}
             <div className="absolute bottom-0 right-0 bg-black text-white p-3">
               {data.petType === 'dog' ? <Dog size={20}/> : data.petType === 'cat' ? <Cat size={20}/> : <Bird size={20}/>}
             </div>
           </div>

           <div>
             <h3 className="font-bold uppercase tracking-wider text-xs mb-4 border-b border-gray-200 pb-1">{t.doc.sectionOwner}</h3>
             <div className="space-y-2">
               <p className="font-bold text-lg leading-tight">{data.ownerName || '—'}</p>
               <p className="text-gray-600 leading-tight">{data.address || '—'}</p>
               <div className="pt-4 space-y-2 text-gray-500 text-xs">
                 <p className="flex items-center gap-2"><Phone size={12}/> {data.phone || '—'}</p>
                 <p className="flex items-center gap-2"><Mail size={12}/> {data.email || '—'}</p>
               </div>
             </div>
           </div>
        </div>

        <div className="w-[65%] flex flex-col gap-10">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-xs mb-4 border-b border-gray-200 pb-1">{t.doc.sectionPet}</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.petName}</span>
                <span className="font-bold text-xl">{data.name || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.breed}</span>
                <span className="text-base">{data.breed || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.gender} / {t.labels.age}</span>
                <span className="text-base">{data.gender === 'm' ? t.labels.m : t.labels.f}, {data.age}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.weight}</span>
                <span className="text-base">{data.weight || '—'}</span>
              </div>
            </div>
          </div>

          <div className="grow">
            <h3 className="font-bold uppercase tracking-wider text-xs mb-4 border-b border-gray-200 pb-1">{t.doc.sectionAbout}</h3>
            <div className="text-base leading-relaxed text-gray-800 text-justify">
              {data.generatedText || (
                <span className="text-gray-300 italic">Keine Beschreibung verfügbar...</span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
             <h3 className="font-bold uppercase tracking-wider text-xs mb-4 text-gray-500">{t.doc.sectionLegal}</h3>
             <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">{t.labels.chipId}</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">{data.chipId || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">{t.labels.insurance}</span>
                  <span className="font-medium">{data.insuranceProvider || '—'}</span>
                </div>
                <div className="col-span-2 flex flex-wrap gap-6 mt-2 pt-4 border-t border-gray-200">
                   <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                   <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                   <StatusItem label={t.labels.registration} active={data.hasRegistration} />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-200 flex justify-between items-end">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">
          <p>{t.doc.footer}</p>
          <p>{today}</p>
        </div>
        <div className="w-64 border-t border-black pt-2">
          <p className="text-[10px] uppercase font-bold tracking-wider">{t.doc.sign}</p>
        </div>
      </div>
    </div>
  );
};

export default SwissDocument;
