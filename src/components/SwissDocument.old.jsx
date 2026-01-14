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

  // ✨ ELEGANT TEMPLATE - Золотисті акценти, розкішний
  if (templateType === 'elegant') {
    return (
      <div className="w-[210mm] h-[297mm] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-slate-800 p-[18mm] text-sm font-serif relative box-border flex flex-col shadow-none mx-auto border-8 border-amber-400">
        <div className="mb-8 text-center border-b-4 border-amber-400 pb-6">
          <div className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-3 rounded-full mb-4"><PawPrint size={28} /></div>
          <h1 className="text-5xl font-bold text-amber-700 mb-2">{t.doc.title}</h1>
          <p className="text-sm text-amber-600 italic">{t.doc.subtitle}</p>
          <p className="text-xs text-slate-400 mt-2">{today}</p>
        </div>

        <div className="flex gap-8 grow">
          <div className="w-1/3">
            {data.photo ? (
              <img src={data.photo} className="w-full aspect-[3/4] object-cover rounded-2xl border-4 border-amber-300 shadow-xl" alt="Pet" />
            ) : (
              <div className="w-full aspect-[3/4] bg-amber-100 rounded-2xl border-4 border-amber-300 flex items-center justify-center"><Camera size={40} className="text-amber-300" /></div>
            )}
            <div className="mt-6 p-4 bg-white rounded-xl border-2 border-amber-200">
              <h3 className="font-bold text-amber-700 mb-3 text-lg">{t.doc.sectionOwner}</h3>
              <p className="font-bold text-base">{data.ownerName}</p>
              <p className="text-sm text-slate-600">{data.street} {data.houseNumber}</p>
              <p className="text-sm text-slate-600">{data.postal} {data.city}</p>
              <p className="text-xs text-slate-500 mt-2">{data.phone}</p>
              <p className="text-xs text-slate-500">{data.email}</p>
            </div>
          </div>

          <div className="w-2/3 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-amber-200">
              <h3 className="font-bold text-amber-700 mb-4 text-xl border-b-2 border-amber-300 pb-2">{t.doc.sectionPet}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-amber-600 font-semibold block">{t.labels.petName}</span><span className="text-2xl font-bold">{data.name}</span></div>
                <div><span className="text-xs text-amber-600 font-semibold block">{t.labels.breed}</span><span className="text-base">{data.breed}</span></div>
                <div><span className="text-xs text-amber-600 font-semibold block">{t.labels.age}</span><span className="text-base">{data.age} years</span></div>
                <div><span className="text-xs text-amber-600 font-semibold block">{t.labels.weight}</span><span className="text-base">{data.weight} kg</span></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-amber-200 grow">
              <h3 className="font-bold text-amber-700 mb-3 text-lg border-b-2 border-amber-300 pb-2">{t.doc.sectionAbout}</h3>
              <p className="text-sm leading-relaxed text-justify">{data.generatedText || '—'}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-amber-200">
              <h3 className="font-bold text-amber-700 mb-3">{t.doc.sectionLegal}</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                <StatusItem label={t.labels.registration} active={data.hasRegistration} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-amber-300 text-center text-xs text-amber-600">
          <p>{t.doc.footer}</p>
        </div>
      </div>
    );
  }

  // ⚫ MINIMAL TEMPLATE - Мінімалістичний чорно-білий
  if (templateType === 'minimal') {
    return (
      <div className="w-[210mm] h-[297mm] bg-white text-black p-[24mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto">
        <div className="mb-12">
          <PawPrint size={32} className="mb-6" />
          <h1 className="text-6xl font-light tracking-tight mb-2">{data.name || 'Pet'}</h1>
          <p className="text-lg text-gray-500">{data.breed}</p>
          <div className="w-16 h-1 bg-black mt-4"></div>
        </div>

        <div className="flex gap-12 grow">
          <div className="w-1/3">
            {data.photo && <img src={data.photo} className="w-full aspect-square object-cover" alt="Pet" />}
            <div className="mt-8 space-y-2 text-xs">
              <p className="font-bold">Owner</p>
              <p>{data.ownerName}</p>
              <p className="text-gray-500">{data.street} {data.houseNumber}</p>
              <p className="text-gray-500">{data.postal} {data.city}</p>
            </div>
          </div>

          <div className="w-2/3 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">About</h3>
              <p className="text-sm leading-relaxed text-justify">{data.generatedText || '—'}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Age</span><br/>{data.age} years</div>
                <div><span className="text-gray-500">Weight</span><br/>{data.weight} kg</div>
                <div><span className="text-gray-500">Gender</span><br/>{data.gender === 'm' ? t.labels.m : t.labels.f}</div>
                <div><span className="text-gray-500">Chip</span><br/>{data.chipId || '—'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3">Status</h3>
              <div className="flex gap-4 text-xs">
                {data.isNeutered && <span>✓ Neutered</span>}
                {data.hasVaccination && <span>✓ Vaccinated</span>}
                {data.hasRegistration && <span>✓ Registered</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 text-xs text-gray-400">
          <p>{t.doc.footer} • {today}</p>
        </div>
      </div>
    );
  }

  // 🌈 COLORFUL TEMPLATE - Яскравий барвистий
  if (templateType === 'colorful') {
    return (
      <div className="w-[210mm] h-[297mm] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-slate-800 p-[16mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto">
        <div className="mb-6 bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-2xl"><PawPrint size={24} /></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t.doc.title}</h1>
                <p className="text-xs text-slate-500">{t.doc.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">{today}</p>
          </div>
        </div>

        <div className="flex gap-6 grow">
          <div className="w-1/3 space-y-4">
            {data.photo ? (
              <img src={data.photo} className="w-full aspect-[3/4] object-cover rounded-3xl shadow-xl border-4 border-white" alt="Pet" />
            ) : (
              <div className="w-full aspect-[3/4] bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl flex items-center justify-center"><Camera size={40} className="text-white" /></div>
            )}

            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-pink-600 mb-2">Owner</h3>
              <p className="font-bold text-sm">{data.ownerName}</p>
              <p className="text-xs text-slate-600">{data.street} {data.houseNumber}</p>
              <p className="text-xs text-slate-600">{data.postal} {data.city}</p>
              <p className="text-xs text-slate-500 mt-2">{data.phone}</p>
            </div>
          </div>

          <div className="w-2/3 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-purple-600 mb-4 text-lg">Pet Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-xl">
                  <span className="text-xs text-purple-600 font-semibold block">Name</span>
                  <span className="text-xl font-bold">{data.name}</span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl">
                  <span className="text-xs text-blue-600 font-semibold block">Breed</span>
                  <span className="text-base">{data.breed}</span>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl">
                  <span className="text-xs text-green-600 font-semibold block">Age</span>
                  <span className="text-base">{data.age} y</span>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl">
                  <span className="text-xs text-orange-600 font-semibold block">Weight</span>
                  <span className="text-base">{data.weight} kg</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg grow">
              <h3 className="font-bold text-blue-600 mb-3">About</h3>
              <p className="text-sm leading-relaxed">{data.generatedText || '—'}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex gap-3 text-xs">
                <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                <StatusItem label={t.labels.registration} active={data.hasRegistration} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          <p>{t.doc.footer}</p>
        </div>
      </div>
    );
  }

  // 🎯 PROFESSIONAL TEMPLATE - Темний професійний
  if (templateType === 'professional') {
    return (
      <div className="w-[210mm] h-[297mm] bg-slate-900 text-white p-[20mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto">
        <div className="mb-8 pb-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg"><PawPrint size={28} /></div>
              <div>
                <h1 className="text-3xl font-bold">{t.doc.title}</h1>
                <p className="text-sm text-slate-400">{t.doc.subtitle}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{today}</p>
          </div>
        </div>

        <div className="flex gap-8 grow">
          <div className="w-1/3">
            {data.photo ? (
              <img src={data.photo} className="w-full aspect-[3/4] object-cover rounded-xl" alt="Pet" />
            ) : (
              <div className="w-full aspect-[3/4] bg-slate-800 rounded-xl flex items-center justify-center"><Camera size={40} className="text-slate-600" /></div>
            )}

            <div className="mt-6 p-4 bg-slate-800 rounded-xl">
              <h3 className="font-bold text-blue-400 mb-3">Contact</h3>
              <p className="font-semibold">{data.ownerName}</p>
              <p className="text-sm text-slate-400">{data.street} {data.houseNumber}</p>
              <p className="text-sm text-slate-400">{data.postal} {data.city}</p>
              <p className="text-xs text-slate-500 mt-2">{data.phone}</p>
              <p className="text-xs text-slate-500">{data.email}</p>
            </div>
          </div>

          <div className="w-2/3 flex flex-col gap-6">
            <div className="bg-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-blue-400 mb-4">Pet Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-slate-500">Name</span><br/><span className="text-xl font-bold">{data.name}</span></div>
                <div><span className="text-xs text-slate-500">Breed</span><br/><span>{data.breed}</span></div>
                <div><span className="text-xs text-slate-500">Age</span><br/><span>{data.age} years</span></div>
                <div><span className="text-xs text-slate-500">Weight</span><br/><span>{data.weight} kg</span></div>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl grow">
              <h3 className="font-bold text-blue-400 mb-3">Description</h3>
              <p className="text-sm leading-relaxed text-slate-300">{data.generatedText || '—'}</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="font-bold text-blue-400 mb-3">Status</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                <StatusItem label={t.labels.registration} active={data.hasRegistration} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700 text-xs text-slate-500">
          <p>{t.doc.footer}</p>
        </div>
      </div>
    );
  }

  // 🎨 PLAYFUL TEMPLATE - Ігривий з округлими формами
  if (templateType === 'playful') {
    return (
      <div className="w-[210mm] h-[297mm] bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 text-slate-800 p-[16mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-block bg-gradient-to-r from-orange-400 to-red-400 text-white p-4 rounded-full mb-4 shadow-lg">
            <PawPrint size={32} />
          </div>
          <h1 className="text-4xl font-black text-orange-600 mb-2">{data.name || 'Pet'}</h1>
          <p className="text-lg text-orange-500">{data.breed}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="bg-white px-4 py-1 rounded-full text-xs font-bold">{data.age} years</span>
            <span className="bg-white px-4 py-1 rounded-full text-xs font-bold">{data.weight} kg</span>
          </div>
        </div>

        <div className="flex gap-6 grow">
          <div className="w-2/5">
            {data.photo ? (
              <img src={data.photo} className="w-full aspect-square object-cover rounded-3xl shadow-2xl border-8 border-white" alt="Pet" />
            ) : (
              <div className="w-full aspect-square bg-orange-200 rounded-3xl flex items-center justify-center border-8 border-white"><Camera size={48} className="text-white" /></div>
            )}

            <div className="mt-6 bg-white rounded-3xl p-5 shadow-lg">
              <h3 className="font-black text-orange-600 mb-3 text-lg">👤 Owner</h3>
              <p className="font-bold">{data.ownerName}</p>
              <p className="text-sm text-slate-600 mt-2">{data.street} {data.houseNumber}</p>
              <p className="text-sm text-slate-600">{data.postal} {data.city}</p>
              <p className="text-xs text-slate-500 mt-3">📞 {data.phone}</p>
              <p className="text-xs text-slate-500">✉️ {data.email}</p>
            </div>
          </div>

          <div className="w-3/5 flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg grow">
              <h3 className="font-black text-red-600 mb-3 text-lg">💬 About Me</h3>
              <p className="text-sm leading-relaxed">{data.generatedText || '—'}</p>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg">
              <h3 className="font-black text-yellow-600 mb-3">✨ My Status</h3>
              <div className="flex flex-wrap gap-2">
                {data.isNeutered && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">✓ Neutered</span>}
                {data.hasVaccination && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">✓ Vaccinated</span>}
                {data.hasRegistration && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">✓ Registered</span>}
              </div>
              {data.insuranceProvider && (
                <p className="mt-3 text-xs text-slate-600">🛡️ Insurance: {data.insuranceProvider}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">{t.doc.footer} • {today}</p>
        </div>
      </div>
    );
  }

  // 🇨🇭 SWISS TEMPLATE - Швейцарський з червоними акцентами
  if (templateType === 'swiss') {
    return (
      <div className="w-[210mm] h-[297mm] bg-white text-slate-900 p-[20mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto border-t-8 border-red-600">
        <div className="mb-8 flex items-center justify-between border-b-2 border-red-600 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 text-white p-3"><PawPrint size={28} /></div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{t.doc.title}</h1>
              <p className="text-sm text-red-600 font-semibold">{t.doc.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">{today}</p>
            <p className="text-xs text-red-600 font-bold mt-1">🇨🇭 SWISS STANDARD</p>
          </div>
        </div>

        <div className="flex gap-10 grow">
          <div className="w-1/3">
            {data.photo ? (
              <img src={data.photo} className="w-full aspect-[3/4] object-cover border-4 border-red-600" alt="Pet" />
            ) : (
              <div className="w-full aspect-[3/4] bg-red-50 border-4 border-red-600 flex items-center justify-center"><Camera size={40} className="text-red-300" /></div>
            )}

            <div className="mt-6 p-4 border-2 border-red-600">
              <h3 className="font-bold text-red-600 mb-3 uppercase tracking-wide">{t.doc.sectionOwner}</h3>
              <p className="font-bold text-lg">{data.ownerName}</p>
              <p className="text-sm text-slate-700 mt-2">{data.street} {data.houseNumber}</p>
              <p className="text-sm text-slate-700">{data.postal} {data.city}</p>
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-slate-600">{data.phone}</p>
                <p className="text-xs text-slate-600">{data.email}</p>
              </div>
            </div>
          </div>

          <div className="w-2/3 flex flex-col gap-6">
            <div className="border-2 border-red-600 p-6">
              <h3 className="font-bold text-red-600 mb-4 uppercase tracking-wide border-b border-red-300 pb-2">{t.doc.sectionPet}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-red-600 font-bold uppercase">{t.labels.petName}</span><br/><span className="text-2xl font-bold">{data.name}</span></div>
                <div><span className="text-xs text-red-600 font-bold uppercase">{t.labels.breed}</span><br/><span className="text-base">{data.breed}</span></div>
                <div><span className="text-xs text-red-600 font-bold uppercase">{t.labels.age}</span><br/><span>{data.age} years</span></div>
                <div><span className="text-xs text-red-600 font-bold uppercase">{t.labels.weight}</span><br/><span>{data.weight} kg</span></div>
              </div>
            </div>

            <div className="border-2 border-red-600 p-6 grow">
              <h3 className="font-bold text-red-600 mb-3 uppercase tracking-wide">{t.doc.sectionAbout}</h3>
              <p className="text-sm leading-relaxed text-justify">{data.generatedText || '—'}</p>
            </div>

            <div className="border-2 border-red-600 p-4">
              <h3 className="font-bold text-red-600 mb-3 uppercase tracking-wide text-xs">{t.doc.sectionLegal}</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                <StatusItem label={t.labels.registration} active={data.hasRegistration} />
              </div>
              {data.insuranceProvider && (
                <p className="mt-3 text-xs text-slate-600">Insurance: {data.insuranceProvider}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t-2 border-red-600 flex justify-between items-center">
          <p className="text-xs text-slate-500">{t.doc.footer}</p>
          <div className="border-t-2 border-red-600 pt-2 w-40">
            <p className="text-xs font-bold text-red-600 text-right uppercase">{t.doc.sign}</p>
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
