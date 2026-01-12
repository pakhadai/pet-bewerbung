import React from 'react';
import { PawPrint, Camera, Dog, Cat, Bird, Phone, Mail } from 'lucide-react';
import StatusItem from './StatusItem';

const SwissDocument = ({ data, t, templateType = 'classic' }) => {
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

  const variantClasses = {
    classic: 'p-[20mm] text-sm',
    modern: 'p-[16mm] text-sm leading-relaxed',
    compact: 'p-[12mm] text-xs'
  };

  // 🎨 CLASSIC TEMPLATE - Мінімалістичний Swiss Design
  if (templateType === 'classic') {
    return (
      <div className="w-[210mm] h-[297mm] bg-white text-slate-900 p-[20mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 text-white p-2"><PawPrint size={24} /></div>
              <div className="text-xs font-bold tracking-[0.3em] uppercase text-slate-500">Pet Dossier</div>
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">{today}</div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 text-slate-900">{t.doc.title}</h1>
          <div className="border-b-4 border-slate-900 pb-2">
            <span className="text-sm font-medium text-slate-500">{t.doc.subtitle}</span>
          </div>
        </div>

        <div className="flex gap-12 grow">
          <div className="w-[35%] flex flex-col gap-8">
            <div className="aspect-[3/4] w-full bg-slate-100 flex items-center justify-center overflow-hidden relative rounded-none border-4 border-slate-900">
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover grayscale" alt="Pet" />
              ) : (
                <div className="text-slate-300 text-center">
                  <Camera size={32} className="mx-auto mb-2 opacity-50" />
                  <span className="text-xs">NO IMAGE</span>
                </div>
              )}
              <div className="absolute top-0 right-0 bg-slate-900 text-white p-3">
                {data.petType === 'dog' ? <Dog size={20}/> : data.petType === 'cat' ? <Cat size={20}/> : <Bird size={20}/>}
              </div>
            </div>

            <div>
              <h3 className="font-black uppercase tracking-wider text-xs mb-4 border-b-2 border-slate-900 pb-2">{t.doc.sectionOwner}</h3>
              <div className="space-y-2">
                <p className="font-bold text-lg leading-tight">{data.ownerName || '—'}</p>
                <p className="text-slate-600 text-sm leading-tight">{(data.street || '') + (data.houseNumber ? ' ' + data.houseNumber : '')}</p>
                <p className="text-slate-600 text-sm leading-tight">{(data.postal ? data.postal + ' ' : '') + (data.city || '')}</p>
                <div className="pt-4 space-y-2 text-slate-500 text-xs">
                  <p className="flex items-center gap-2"><Phone size={12}/> {data.phone || '—'}</p>
                  <p className="flex items-center gap-2"><Mail size={12}/> {data.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[65%] flex flex-col gap-8">
            <div>
              <h3 className="font-black uppercase tracking-wider text-xs mb-4 border-b-2 border-slate-900 pb-2">{t.doc.sectionPet}</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold">{t.labels.petName}</span>
                  <span className="font-black text-2xl">{data.name || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold">{t.labels.breed}</span>
                  <span className="text-base font-medium">{data.breed || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold">{t.labels.gender} / {t.labels.age}</span>
                  <span className="text-base font-medium">{data.gender === 'm' ? t.labels.m : t.labels.f}, {data.age}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold">{t.labels.weight}</span>
                  <span className="text-base font-medium">{data.weight || '—'}</span>
                </div>
              </div>
            </div>

            <div className="grow">
              <h3 className="font-black uppercase tracking-wider text-xs mb-4 border-b-2 border-slate-900 pb-2">{t.doc.sectionAbout}</h3>
              <div className="text-base leading-relaxed text-slate-700 text-justify">
                {data.generatedText || <span className="text-slate-300 italic">No description available</span>}
              </div>
            </div>

            <div className="bg-stone-50 p-6 border-2 border-slate-200">
              <h3 className="font-black uppercase tracking-wider text-xs mb-4 text-slate-600">{t.doc.sectionLegal}</h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold">{t.labels.chipId}</span>
                  <span className="font-mono bg-white px-2 py-1 border border-slate-200 inline-block">{data.chipId || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase tracking-wide mb-1 font-bold">{t.labels.insurance}</span>
                  <span className="font-medium">{data.insuranceProvider || '—'}</span>
                </div>
                <div className="col-span-2 flex flex-wrap gap-6 mt-2 pt-4 border-t-2 border-slate-200">
                  <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                  <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                  <StatusItem label={t.labels.registration} active={data.hasRegistration} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t-2 border-slate-900 flex justify-between items-end">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            <p className="font-bold">{t.doc.footer}</p>
          </div>
          <div className="w-64 border-t-2 border-slate-900 pt-2">
            <p className="text-[10px] uppercase font-black tracking-wider">{t.doc.sign}</p>
          </div>
        </div>
      </div>
    );
  }

  // 🌸 MODERN TEMPLATE - Пастельні відтінки, сучасний дизайн
  if (templateType === 'modern') {
    return (
      <div className="w-[210mm] h-[297mm] bg-gradient-to-br from-rose-50 via-white to-pink-50 text-slate-800 p-[16mm] text-sm leading-relaxed font-sans relative box-border flex flex-col shadow-none mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-rose-400 to-pink-400 text-white p-3 rounded-2xl shadow-lg"><PawPrint size={28} /></div>
            <div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-rose-500">Swiss Pet CV</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{today}</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-800">{t.doc.title}</h1>
          <div className="border-b-2 border-rose-300 pb-3">
            <span className="text-sm font-medium text-slate-600">{t.doc.subtitle}</span>
          </div>
        </div>

        <div className="flex gap-10 grow">
          <div className="w-[40%] flex flex-col gap-8">
            <div className="aspect-square w-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden relative rounded-2xl shadow-xl border-4 border-white">
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover" alt="Pet" />
              ) : (
                <div className="text-rose-200 text-center">
                  <Camera size={36} className="mx-auto mb-2" />
                  <span className="text-xs">Photo</span>
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-gradient-to-br from-rose-400 to-pink-400 text-white p-3 rounded-2xl shadow-lg">
                {data.petType === 'dog' ? <Dog size={22}/> : data.petType === 'cat' ? <Cat size={22}/> : <Bird size={22}/>}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold tracking-wide text-sm mb-4 text-rose-500">{t.doc.sectionOwner}</h3>
              <div className="space-y-2">
                <p className="font-bold text-lg leading-tight text-slate-800">{data.ownerName || '—'}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{(data.street || '') + (data.houseNumber ? ' ' + data.houseNumber : '')}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{(data.postal ? data.postal + ' ' : '') + (data.city || '')}</p>
                <div className="pt-3 space-y-2 text-slate-500 text-xs">
                  <p className="flex items-center gap-2"><Phone size={12} className="text-rose-400"/> {data.phone || '—'}</p>
                  <p className="flex items-center gap-2"><Mail size={12} className="text-rose-400"/> {data.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[60%] flex flex-col gap-8">
            <div>
              <h3 className="font-bold tracking-wide text-sm mb-4 text-rose-500">{t.doc.sectionPet}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <span className="block text-[10px] text-rose-500 uppercase tracking-wide mb-2 font-bold">{t.labels.petName}</span>
                  <span className="font-bold text-xl text-slate-800">{data.name || '—'}</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <span className="block text-[10px] text-rose-500 uppercase tracking-wide mb-2 font-bold">{t.labels.breed}</span>
                  <span className="text-base font-medium">{data.breed || '—'}</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <span className="block text-[10px] text-rose-500 uppercase tracking-wide mb-2 font-bold">{t.labels.gender} / {t.labels.age}</span>
                  <span className="text-base font-medium">{data.gender === 'm' ? t.labels.m : t.labels.f}, {data.age}</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <span className="block text-[10px] text-rose-500 uppercase tracking-wide mb-2 font-bold">{t.labels.weight}</span>
                  <span className="text-base font-medium">{data.weight || '—'}</span>
                </div>
              </div>
            </div>

            <div className="grow bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold tracking-wide text-sm mb-4 text-rose-500">{t.doc.sectionAbout}</h3>
              <div className="text-sm leading-relaxed text-slate-700">
                {data.generatedText || <span className="text-slate-300 italic">No description</span>}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl shadow-md border-l-4 border-rose-300">
              <h3 className="font-bold tracking-wide text-sm mb-4 text-rose-500">{t.doc.sectionLegal}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-[10px] text-rose-500 uppercase tracking-wide mb-2 font-bold">{t.labels.chipId}</span>
                  <span className="font-mono bg-white px-3 py-2 rounded-lg border border-rose-200 inline-block shadow-sm">{data.chipId || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-rose-500 uppercase tracking-wide mb-2 font-bold">{t.labels.insurance}</span>
                  <span className="font-medium">{data.insuranceProvider || '—'}</span>
                </div>
                <div className="col-span-2 flex flex-wrap gap-4 mt-2">
                  <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                  <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                  <StatusItem label={t.labels.registration} active={data.hasRegistration} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-rose-200 flex justify-between items-center">
          <div className="text-[10px] text-slate-400 tracking-wide">
            <p className="font-medium">{t.doc.footer}</p>
          </div>
          <div className="w-48 border-t border-rose-300 pt-2">
            <p className="text-[10px] uppercase font-bold tracking-wider text-rose-500">{t.doc.sign}</p>
          </div>
        </div>
      </div>
    );
  }

  // 🌿 COMPACT TEMPLATE - Зелені пастельні тони, nature-inspired
  return (
    <div className="w-[210mm] h-[297mm] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-slate-700 p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto">
      {/* Centered Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-400 text-white p-2.5 rounded-full shadow-lg"><PawPrint size={22} /></div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-slate-700">{t.doc.title}</h1>
        <div className="border-b-3 border-emerald-300 pb-2 mx-auto max-w-md">
          <span className="text-xs font-medium text-slate-600">{t.doc.subtitle}</span>
        </div>
        <div className="text-[9px] text-slate-400 uppercase tracking-wider mt-2">{today}</div>
      </div>

      {/* Photo + Basic Info in one row */}
      <div className="flex gap-6 mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center overflow-hidden relative rounded-full shadow-lg border-4 border-white shrink-0">
          {data.photo ? (
            <img src={data.photo} className="w-full h-full object-cover" alt="Pet" />
          ) : (
            <Camera size={28} className="text-emerald-200" />
          )}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-emerald-400 to-teal-400 text-white p-2 rounded-full shadow-lg">
            {data.petType === 'dog' ? <Dog size={16}/> : data.petType === 'cat' ? <Cat size={16}/> : <Bird size={16}/>}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <span className="block text-[9px] text-emerald-600 uppercase tracking-wide mb-1 font-bold">{t.labels.petName}</span>
            <span className="font-bold text-lg text-slate-700">{data.name || '—'}</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <span className="block text-[9px] text-emerald-600 uppercase tracking-wide mb-1 font-bold">{t.labels.breed}</span>
            <span className="text-sm font-medium">{data.breed || '—'}</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <span className="block text-[9px] text-emerald-600 uppercase tracking-wide mb-1 font-bold">{t.labels.gender}</span>
            <span className="text-sm font-medium">{data.gender === 'm' ? t.labels.m : t.labels.f}</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <span className="block text-[9px] text-emerald-600 uppercase tracking-wide mb-1 font-bold">{t.labels.age} / {t.labels.weight}</span>
            <span className="text-sm font-medium">{data.age} / {data.weight || '—'}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
        <h3 className="font-bold tracking-wide text-xs mb-3 text-emerald-600 uppercase">{t.doc.sectionAbout}</h3>
        <div className="text-xs leading-relaxed text-slate-700">
          {data.generatedText || <span className="text-slate-300 italic">No description</span>}
        </div>
      </div>

      {/* Owner Info + Legal in two columns */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="font-bold tracking-wide text-xs mb-3 text-emerald-600 uppercase">{t.doc.sectionOwner}</h3>
          <div className="space-y-1.5">
            <p className="font-bold text-sm leading-tight text-slate-700">{data.ownerName || '—'}</p>
            <p className="text-slate-600 text-xs leading-relaxed">{(data.street || '') + (data.houseNumber ? ' ' + data.houseNumber : '')}</p>
            <p className="text-slate-600 text-xs leading-relaxed">{(data.postal ? data.postal + ' ' : '') + (data.city || '')}</p>
            <div className="pt-2 space-y-1 text-slate-500 text-[10px]">
              <p className="flex items-center gap-1.5"><Phone size={10} className="text-emerald-500"/> {data.phone || '—'}</p>
              <p className="flex items-center gap-1.5"><Mail size={10} className="text-emerald-500"/> {data.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border-2 border-emerald-200 rounded-xl shadow-md">
          <h3 className="font-bold tracking-wide text-xs mb-3 text-emerald-600 uppercase">{t.doc.sectionLegal}</h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="block text-[9px] text-emerald-600 uppercase tracking-wide mb-1 font-bold">{t.labels.chipId}</span>
              <span className="font-mono bg-white px-2 py-1.5 rounded border border-emerald-200 inline-block text-[10px] shadow-sm">{data.chipId || '—'}</span>
            </div>
            <div>
              <span className="block text-[9px] text-emerald-600 uppercase tracking-wide mb-1 font-bold">{t.labels.insurance}</span>
              <span className="font-medium text-xs">{data.insuranceProvider || '—'}</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <StatusItem label={t.labels.neutered} active={data.isNeutered} />
              <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
              <StatusItem label={t.labels.registration} active={data.hasRegistration} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-emerald-200 flex justify-between items-center text-[9px]">
        <div className="text-slate-400 tracking-wide">
          <p className="font-medium">{t.doc.footer}</p>
        </div>
        <div className="w-40 border-t border-emerald-300 pt-1.5">
          <p className="uppercase font-bold tracking-wider text-emerald-600 text-right">{t.doc.sign}</p>
        </div>
      </div>
    </div>
  );
};

export default SwissDocument;
