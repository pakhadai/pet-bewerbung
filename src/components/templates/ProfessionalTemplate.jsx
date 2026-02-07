import React from 'react';

/**
 * ProfessionalTemplate - 12-column grid layout with behavior progress bars
 *
 * Layout Structure:
 * - Header with icon and title
 * - 12-column grid content area:
 *   - Left Column (5 cols): Pet photo, name, and basic stats
 *   - Right Column (7 cols): Owner info and behavior section with progress bars
 * - Full-width description block
 * - Bottom grid (2 cols): Legal info and references
 * - Footer with signature line
 *
 * Accent Color: Green (#13ec5b)
 */

export const getProfessionalConfig = (today) => ({
  container: 'w-[210mm] h-[292mm] bg-white text-[#111813] p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-4 pb-4 border-b-2 border-black',
  headerFlex: 'flex items-start justify-between',
  headerIconContainer: 'flex items-center gap-3',
  headerIconBg: 'bg-black text-white p-2 rounded-sm flex items-center justify-center',
  headerIconSize: 20,
  titleText: 'text-2xl font-black uppercase tracking-tight text-black leading-tight',
  subtitleText: 'text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1 font-medium',
  dateText: 'text-[10px] text-gray-400 text-right uppercase tracking-wider',
  dateLabel: today,
  mainLayout: 'grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'col-span-5',
  sidebarSpace: 'flex flex-col gap-4',
  mainWidth: 'col-span-7',
  mainSpace: 'flex flex-col gap-4',
  descriptionContainer: 'col-span-12 border-t border-gray-200 pt-4',
  bottomLayout: 'col-span-12 grid grid-cols-2 gap-6 border-t border-gray-200 pt-4',
  footerContainer: 'mt-auto pt-3 border-t-4 border-black flex-shrink-0',
  footerText: 'text-[9px] text-gray-400 font-mono',
  footerSignContainer: 'w-44 border-b border-gray-300 pb-2',
  footerSignText: 'text-[9px] text-center text-gray-500 mt-1',
  primaryColor: '#13ec5b',
  badge: null
});

const ProfessionalTemplate = ({ data, t, customColors, config, styleOverrides }) => {
  const hiddenSections = data?.customDesign?.hiddenSections || [];
  const primaryColor = customColors?.primary || config?.primaryColor || '#13ec5b';

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      {/* Two-column main content with 12-column grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Pet Photo & Stats (5 columns) */}
        <div className="col-span-5 flex flex-col gap-4">
          {/* Pet Photo */}
          {!hiddenSections.includes('photo') && (
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-gray-100 shadow-inner">
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full z-10 shadow-sm">
                <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>pets</span>
              </div>
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-4xl">image</span>
                </div>
              )}
            </div>
          )}

          {/* Pet Name & Basic Stats */}
          {!hiddenSections.includes('details') && (
            <div>
              <h2 className="text-2xl font-black text-black mb-0.5">{data.name || '–'}</h2>
              <p className="text-xs font-medium mb-3 flex items-center gap-1" style={{ color: primaryColor }}>
                <span className="material-symbols-outlined text-xs">badge</span>
                Referenz-ID: #{(data.chipId || data.name || 'XXXX').slice(-4).toUpperCase()}-PET
              </p>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-gray-200 pt-3">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">{t?.labels?.breed}</p>
                  <p className="text-xs font-semibold text-black">{data.breed || '–'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">{t?.labels?.gender}</p>
                  <p className="text-xs font-semibold text-black">{data.gender === 'm' ? t?.labels?.male : t?.labels?.female}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">{t?.labels?.age}</p>
                  <p className="text-xs font-semibold text-black">{data.age ? `${data.age} ${t?.labels?.years}` : '–'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">{t?.labels?.weight}</p>
                  <p className="text-xs font-semibold text-black">{data.weight ? `${data.weight} kg` : '–'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Owner & Behavior (7 columns) */}
        <div className="col-span-7 flex flex-col gap-4">
          {/* Owner Info Box */}
          {!hiddenSections.includes('owner') && (
            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 relative">
              {/* QR Code in top right */}
              <div className="absolute top-4 right-4 size-14 bg-white p-1 rounded shadow-sm">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage: data.phone ? `url(https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(`tel:${data.phone}`)})` : 'none',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {!data.phone && <span className="material-symbols-outlined text-gray-300 text-xl">qr_code_2</span>}
                </div>
              </div>

              <h3 className="text-sm font-bold text-black uppercase border-b border-gray-200 pb-2 mb-3">{t?.doc?.sectionOwner}</h3>
              <div className="space-y-2 pr-16">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase">{t?.labels?.name}</p>
                  <p className="font-medium text-sm text-black">{data.ownerName || '–'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase">{t?.labels?.address}</p>
                  <p className="font-medium text-sm text-black">{data.street} {data.houseNumber}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase">{t?.labels?.city}</p>
                  <p className="font-medium text-sm text-black">{data.postal} {data.city}</p>
                </div>
                {/* Phone and Email on same row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-400 text-sm">call</span>
                    <span className="text-xs font-medium">{data.phone || '–'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-400 text-sm">mail</span>
                    <span className="text-xs font-medium truncate max-w-[160px]">{data.email || '–'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Behavior & Routine with Progress Bars */}
          {!hiddenSections.includes('behavior') && (
            <div>
              <h3 className="text-sm font-bold text-black uppercase border-b-2 border-black pb-2 mb-3">{t?.labels?.behaviorTitle}</h3>

              {/* Progress bars in 2-column layout */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Noise Level */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{t?.labels?.noiseLevel}</span>
                    <span className="text-[9px] text-gray-500">
                      {data.noiseLevel === 'low' ? t?.labels?.noiseLow : data.noiseLevel === 'medium' ? t?.labels?.noiseMedium : t?.labels?.noiseHigh}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: data.noiseLevel === 'low' ? '20%' : data.noiseLevel === 'medium' ? '50%' : '80%',
                        backgroundColor: primaryColor,
                        opacity: 0.8
                      }}
                    ></div>
                  </div>
                </div>

                {/* Alone Time */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{t?.labels?.aloneTime || 'Aktivität'}</span>
                    <span className="text-[9px] text-gray-500">{data.aloneTime ? `${data.aloneTime}h` : 'Moderat'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500/80 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              {/* Info boxes */}
              {(data.aloneTime || data.activeHours) && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {data.aloneTime && (
                    <div className="flex flex-col p-2 bg-gray-50 rounded border border-gray-100">
                      <span className="text-[9px] text-gray-500 mb-0.5">{t?.labels?.aloneTime}</span>
                      <span className="font-bold text-black text-sm">{data.aloneTime} Std.</span>
                    </div>
                  )}
                  {data.activeHours && (
                    <div className="flex flex-col p-2 bg-gray-50 rounded border border-gray-100">
                      <span className="text-[9px] text-gray-500 mb-0.5">{t?.labels?.activeHours}</span>
                      <span className="font-bold text-black text-sm">{data.activeHours}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Behavior Tags */}
              <div className="flex flex-wrap gap-1.5">
                {data.behaviorWithChildren === 'good' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800">
                    <span className="material-symbols-outlined text-xs">check_circle</span> {t?.labels?.behaviorWithChildren}
                  </span>
                )}
                {data.behaviorWithPets === 'good' && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800">
                    <span className="material-symbols-outlined text-xs">check_circle</span> {t?.labels?.behaviorWithPets}
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800">
                  <span className="material-symbols-outlined text-xs">check_circle</span> {t?.labels?.houseTrained || 'Stubenrein'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Block - Full Width */}
      {!hiddenSections.includes('description') && data.generatedText && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-bold text-black uppercase mb-2">{t?.doc?.sectionDescription || 'Charakterbeschreibung'}</h3>
          <p className="text-xs leading-relaxed text-gray-700 text-justify">{data.generatedText}</p>
        </div>
      )}

      {/* Bottom Grid: Legal & References (2 columns) */}
      <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-4">
        {/* Legal & Insurance */}
        {!hiddenSections.includes('legal') && (
          <div>
            <h3 className="text-xs font-bold text-black uppercase mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-gray-400 text-sm">gavel</span> {t?.doc?.sectionLegal}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                <span className="text-[10px] text-gray-600">{t?.labels?.chipId}</span>
                <span className="text-[10px] font-mono font-medium text-black">{data.chipId || '–'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                <span className="text-[10px] text-gray-600">{t?.labels?.insurance}</span>
                <span className="text-[10px] font-medium text-black">{data.insuranceProvider || '–'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                <span className="text-[10px] text-gray-600">{t?.labels?.vetPractice}</span>
                <span className="text-[10px] font-medium text-black">{data.vetName || '–'}</span>
              </div>
              {/* Status icons */}
              <div className="flex gap-3 pt-2">
                {data.hasVaccination && (
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined text-sm">vaccines</span>
                    </div>
                    <span className="text-[8px] uppercase font-bold text-gray-500">{t?.labels?.vaccinated}</span>
                  </div>
                )}
                {data.isNeutered && (
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined text-sm">content_cut</span>
                    </div>
                    <span className="text-[8px] uppercase font-bold text-gray-500">{t?.labels?.neutered}</span>
                  </div>
                )}
                {data.hasRegistration && (
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined text-sm">app_registration</span>
                    </div>
                    <span className="text-[8px] uppercase font-bold text-gray-500">AMICUS</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* References */}
        {!hiddenSections.includes('reference') && (
          <div>
            <h3 className="text-xs font-bold text-black uppercase mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-gray-400 text-sm">history_edu</span> {t?.doc?.sectionReference}
            </h3>

            {/* Landlord Reference */}
            {data.previousLandlordName && (
              <div className="bg-blue-50 p-3 rounded-sm border border-blue-100 mb-3">
                <p className="text-[9px] text-blue-800 uppercase font-bold mb-0.5">{t?.labels?.previousLandlord}</p>
                <p className="text-xs font-bold text-black">{data.previousLandlordName}</p>
                {data.previousLandlordPhone && (
                  <p className="text-[9px] text-gray-600 mt-0.5">Tel: {data.previousLandlordPhone}</p>
                )}
                {data.previousDuration && (
                  <div className="mt-1.5 text-[9px] italic text-gray-500">
                    "Mietverhältnis seit {data.previousDuration}"
                  </div>
                )}
              </div>
            )}

            {/* Emergency Contact */}
            {data.emergencyContactName && (
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t?.labels?.emergencyContact}</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400 text-sm">emergency</span>
                  <div>
                    <p className="text-xs font-medium text-black">
                      {data.emergencyContactName}
                      {data.emergencyContactRelation && ` (${data.emergencyContactRelation})`}
                    </p>
                    <p className="text-[9px] text-gray-500">{data.emergencyContactPhone || '–'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
