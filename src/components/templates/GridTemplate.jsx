import React from 'react';

/**
 * GridTemplate - Swiss grid style with red accent and progress bars
 *
 * Layout Structure:
 * - Header with red accent line
 * - 12-column grid layout:
 *   - Left Column (4 cols): Pet photo, owner info, pet details with QR code
 *   - Right Column (8 cols): Pet name header, description, behavior with progress bars, legal, references
 * - Progress bars for noise and alone time
 * - Checkbox grid for health status
 * - Red accent color (#D80000)
 *
 * Helper Functions:
 * - getNoiseLevelPercent(): Maps noise level to percentage for progress bar
 * - getAloneTimePercent(): Maps hours to percentage (max 8 hours = 100%)
 */

export const getGridConfig = (today) => ({
  container: 'w-[210mm] h-[292mm] bg-white text-[#1a1a1a] p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-6 pb-5 border-b-4 border-[#D80000]',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-4',
  headerIconBg: 'size-14 bg-[#D80000] text-white flex items-center justify-center',
  headerIconSize: 36,
  titleText: 'text-2xl font-black uppercase tracking-tight text-black leading-none',
  subtitleText: 'text-[10px] text-gray-400 uppercase tracking-widest mt-1',
  dateText: 'text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right',
  dateLabelTitle: 'Erstellungsdatum',
  dateLabel: today,
  mainLayout: 'grid grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'col-span-4',
  sidebarSpace: 'flex flex-col gap-6',
  mainWidth: 'col-span-8',
  mainSpace: 'flex flex-col gap-6',
  footerContainer: 'mt-auto pt-6 border-t-2 border-gray-100 flex-shrink-0',
  footerText: 'text-[10px] text-gray-400 uppercase tracking-widest',
  footerSignContainer: 'w-56 border-t border-black ml-auto',
  footerSignText: 'text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-bold text-right',
  primaryColor: '#D80000',
  accentColor: '#f5f5f5',
  badge: null
});

// Helper function to get noise level percentage
const getNoiseLevelPercent = (noiseLevel) => {
  if (noiseLevel === 'low') return 20;
  if (noiseLevel === 'high') return 85;
  return 50;
};

// Helper function to get alone time percentage (max 8 hours = 100%)
const getAloneTimePercent = (aloneTime) => {
  const hours = parseInt(aloneTime) || 0;
  return Math.min(100, (hours / 8) * 100);
};

const GridTemplate = ({ data, t, customColors, config, styleOverrides }) => {
  const hiddenSections = data?.customDesign?.hiddenSections || [];

  return (
    <div className="grid grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
      {/* Left Column: Photo, Owner, Details (4 columns) */}
      <div className="col-span-4 flex flex-col gap-6">
        {/* Pet Photo */}
        {!hiddenSections.includes('photo') && (
          <div className="w-full aspect-[3/4] bg-gray-100 border border-gray-200 p-2 shadow-sm">
            {data.photo ? (
              <img src={data.photo} alt={data.name} className="w-full h-full object-cover" style={{ filter: 'grayscale(10%)' }} />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-6xl">pets</span>
              </div>
            )}
          </div>
        )}

        {/* Owner Section */}
        {!hiddenSections.includes('owner') && (
          <div>
            <h3 className="text-[10px] font-black text-black border-b-2 border-black pb-2 mb-3 uppercase tracking-wider">
              {t?.doc?.sectionOwner || 'Halter'} / Owner
            </h3>
            <div className="text-sm space-y-1.5 leading-snug">
              <p className="font-bold text-base">{data.ownerName || '—'}</p>
              <p>{data.street} {data.houseNumber}</p>
              <p>{data.postal} {data.city}</p>
              <div className="pt-2 space-y-1 text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#D80000]">call</span>
                  <span className="font-medium">{data.phone || '—'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#D80000]">mail</span>
                  <span>{data.email || '—'}</span>
                </p>
              </div>
            </div>
            {/* QR Code - will be generated via qrCode.js */}
            <div className="mt-5 size-24 bg-white border border-gray-200 flex items-center justify-center p-1" id="qr-code-grid">
              <span className="material-symbols-outlined text-gray-300 text-[48px]">qr_code_2</span>
            </div>
          </div>
        )}

        {/* Details Section */}
        {!hiddenSections.includes('details') && (
          <div>
            <h3 className="text-[10px] font-black text-black border-b-2 border-black pb-2 mb-3 uppercase tracking-wider">
              {t?.doc?.sectionPet || 'Details'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 border-b border-gray-100 pb-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold pt-1">{t?.labels?.breed || 'Rasse'}</span>
                <span className="font-semibold text-right">{data.breed || '—'}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100 pb-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold pt-1">{t?.labels?.gender || 'Geschlecht'}</span>
                <span className="font-semibold text-right">{data.gender === 'm' ? (t?.labels?.male || 'Männlich') : data.gender === 'f' ? (t?.labels?.female || 'Weiblich') : '—'}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100 pb-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold pt-1">{t?.labels?.age || 'Alter'}</span>
                <span className="font-semibold text-right">{data.age ? `${data.age} ${t?.labels?.years || 'Jahre'}` : '—'}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-gray-100 pb-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold pt-1">{t?.labels?.weight || 'Gewicht'}</span>
                <span className="font-semibold text-right">{data.weight ? `${data.weight} kg` : '—'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Name, Description, Behavior, Legal, References (8 columns) */}
      <div className="col-span-8 flex flex-col gap-6">
        {/* Pet Name Header */}
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-6xl font-black tracking-tighter text-black leading-none mb-1">{(data.name || 'NAME').toUpperCase()}</h2>
          <div className="flex items-center gap-3">
            <span className="bg-[#D80000] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
              {t?.labels?.availableForRent || 'Pet CV'}
            </span>
            <span className="text-xl text-gray-400 font-light tracking-wide">{data.city || '—'}, Schweiz</span>
          </div>
        </div>

        {/* Description */}
        {!hiddenSections.includes('description') && (
          <div className="bg-gray-50 p-5 border-l-4 border-[#D80000]">
            <h3 className="text-[10px] font-bold text-[#D80000] uppercase tracking-widest mb-2">
              {t?.doc?.sectionDescription || 'Charakterbeschreibung'}
            </h3>
            <p className="text-sm leading-relaxed text-gray-800 text-justify">
              {data.generatedText || t?.doc?.defaultDescription || 'Hier könnte eine Beschreibung stehen...'}
            </p>
          </div>
        )}

        {/* Behavior & Routine */}
        {!hiddenSections.includes('behavior') && (
          <div>
            <h3 className="text-sm font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider flex items-center gap-2 text-black">
              <span className="material-symbols-outlined text-[#D80000] text-[20px]">psychology</span>
              {t?.doc?.behaviorTitle || 'Verhalten & Routine'}
            </h3>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="space-y-4">
                {/* Noise Level */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wide">
                    <span>{t?.labels?.noiseLevel || 'Lärmempfindlichkeit'}</span>
                    <span className="text-[#D80000]">
                      {data.noiseLevel === 'low' ? (t?.labels?.noiseLow || 'Niedrig') :
                        data.noiseLevel === 'high' ? (t?.labels?.noiseHigh || 'Hoch') :
                        (t?.labels?.noiseMedium || 'Mittel')}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200">
                    <div className="h-full bg-[#D80000]" style={{ width: `${getNoiseLevelPercent(data.noiseLevel)}%` }}></div>
                  </div>
                </div>
                {/* Alone Time */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wide">
                    <span>{t?.labels?.aloneTime || 'Alleine bleiben'}</span>
                    <span className="text-[#D80000]">{data.aloneTime ? `${data.aloneTime} Std.` : '—'}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200">
                    <div className="h-full bg-[#D80000]" style={{ width: `${getAloneTimePercent(data.aloneTime)}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Activity Level */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wide">
                    <span>{t?.labels?.activityLevel || 'Aktivitätslevel'}</span>
                    <span className="text-[#D80000]">{t?.labels?.high || 'Hoch'}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200">
                    <div className="h-full bg-[#D80000] w-[85%]"></div>
                  </div>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.behaviorWithChildren === 'good' && (
                    <span className="px-2 py-1 bg-white text-[9px] font-bold uppercase border border-gray-300 tracking-wide text-gray-600">{t?.labels?.goodWithChildren || 'Kinderlieb'}</span>
                  )}
                  {data.behaviorWithPets === 'good' && (
                    <span className="px-2 py-1 bg-white text-[9px] font-bold uppercase border border-gray-300 tracking-wide text-gray-600">{t?.labels?.social || 'Sozial'}</span>
                  )}
                  <span className="px-2 py-1 bg-white text-[9px] font-bold uppercase border border-gray-300 tracking-wide text-gray-600">{t?.labels?.houseTrained || 'Stubenrein'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal & Health */}
        {!hiddenSections.includes('legal') && (
          <div>
            <h3 className="text-sm font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider flex items-center gap-2 text-black">
              <span className="material-symbols-outlined text-[#D80000] text-[20px]">shield</span>
              {t?.doc?.legalTitle || 'Rechtliches & Gesundheit'}
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                <div className="flex items-center justify-between text-sm font-medium p-2 bg-gray-50 border border-gray-100">
                  <span>{t?.labels?.chipped || 'Gechipt'}</span>
                  <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center bg-white ${data.chipId ? 'text-[#D80000]' : ''}`}>
                    {data.chipId && <span className="text-sm font-black">✓</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm font-medium p-2 bg-gray-50 border border-gray-100">
                  <span>{t?.labels?.vaccinated || 'Geimpft'}</span>
                  <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center bg-white ${data.hasVaccination ? 'text-[#D80000]' : ''}`}>
                    {data.hasVaccination && <span className="text-sm font-black">✓</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm font-medium p-2 bg-gray-50 border border-gray-100">
                  <span>{t?.labels?.neutered || 'Kastriert'}</span>
                  <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center bg-white ${data.isNeutered ? 'text-[#D80000]' : ''}`}>
                    {data.isNeutered && <span className="text-sm font-black">✓</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm font-medium p-2 bg-gray-50 border border-gray-100">
                  <span>{t?.labels?.dewormed || 'Entwurmt'}</span>
                  <div className="w-4 h-4 border border-gray-300 flex items-center justify-center bg-white text-[#D80000]">
                    <span className="text-sm font-black">✓</span>
                  </div>
                </div>
              </div>
              {/* Details */}
              <div className="text-sm space-y-2 border-l-2 border-gray-100 pl-4 py-1">
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t?.labels?.chipId || 'Chip-Nummer'}</span>
                  <span className="font-mono font-medium text-black">{data.chipId || '—'}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t?.labels?.insurance || 'Versicherung'}</span>
                  <span className="font-medium text-black">{data.insuranceProvider || '—'}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t?.labels?.vet || 'Tierarzt'}</span>
                  <span className="font-medium text-black">{data.vetName || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* References */}
        {!hiddenSections.includes('reference') && (data.previousLandlordName || data.emergencyContactName) && (
          <div>
            <h3 className="text-sm font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider flex items-center gap-2 text-black">
              <span className="material-symbols-outlined text-[#D80000] text-[20px]">contact_phone</span>
              {t?.doc?.sectionReference || 'Referenzen'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {data.previousLandlordName && (
                <div className="text-sm bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t?.labels?.previousLandlord || 'Früherer Vermieter'}</p>
                  <p className="font-bold text-black">{data.previousLandlordName}</p>
                  {data.previousLandlordPhone && <p className="text-gray-600 text-xs">{data.previousLandlordPhone}</p>}
                  {data.previousDuration && <p className="text-gray-500 text-[10px] mt-1">{t?.labels?.previousDuration || 'Mietdauer'}: {data.previousDuration}</p>}
                </div>
              )}
              {data.emergencyContactName && (
                <div className="text-sm bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t?.labels?.emergencyContact || 'Notfallkontakt'}</p>
                  <p className="font-bold text-black">{data.emergencyContactName}</p>
                  {data.emergencyContactPhone && <p className="text-gray-600 text-xs">{data.emergencyContactPhone}</p>}
                  {data.emergencyContactRelation && <p className="text-gray-500 text-[10px] mt-1">{data.emergencyContactRelation}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridTemplate;
