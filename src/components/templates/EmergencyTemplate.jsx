import React from 'react';

/**
 * EmergencyTemplate - Emergency contact focused layout for pet sitters
 *
 * Layout Structure:
 * - Header with emergency icon and title
 * - Main grid (12 columns):
 *   - Left: Pet photo and name (4 cols)
 *   - Right: Emergency contact and owner info (8 cols)
 * - Dark routine section with feeding/walking/health info
 * - Behavior + Notes section (2 columns)
 * - Status bar at bottom
 *
 * Helper Functions:
 * - getNoiseLevelBars(): Maps noise level to 1-4 bar visualization
 * - getActivityBars(): Maps alone time to activity level indicator
 *
 * Accent Color: Red (#dc2626)
 */

export const getEmergencyConfig = (today) => ({
  container: 'w-[210mm] h-[292mm] bg-white text-[#111813] p-[10mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-3 pb-3 border-b-4 border-black',
  headerFlex: 'flex items-center justify-between',
  headerIconContainer: 'flex items-center gap-3',
  headerIconBg: 'size-12 bg-red-600 text-white p-2 rounded-sm flex items-center justify-center',
  headerIconSize: 28,
  titleText: 'text-2xl font-black uppercase tracking-tighter text-black',
  subtitleText: 'text-[10px] font-bold text-red-600 uppercase tracking-[0.15em]',
  dateText: 'text-[10px] text-gray-400 text-right uppercase tracking-wider font-bold',
  dateLabel: today,
  mainLayout: 'flex flex-col gap-4 flex-1 min-h-0 overflow-hidden',
  footerContainer: 'mt-auto pt-3 border-t-2 border-black flex-shrink-0',
  footerText: 'text-[10px] text-gray-400 font-mono',
  footerSignContainer: 'w-44 h-8 border-b border-gray-300',
  footerSignText: 'text-[9px] uppercase font-bold text-gray-400 text-center mt-1',
  primaryColor: '#13ec5b',
  accentColor: '#dc2626',
  badge: null
});

// Helper function to get noise level visualization
const getNoiseLevelBars = (noiseLevel) => {
  const levels = { low: 1, medium: 2, high: 4 };
  const filled = levels[noiseLevel] || 1;
  const labels = { low: 'QUIET', medium: 'MODERATE', high: 'LOUD' };
  return { filled, label: labels[noiseLevel] || 'QUIET' };
};

// Helper function to get activity level from alone time
const getActivityBars = (aloneTime) => {
  const hours = parseInt(aloneTime) || 0;
  const filled = hours <= 2 ? 1 : hours <= 4 ? 2 : hours <= 6 ? 3 : 4;
  return { filled, label: hours <= 2 ? 'LOW' : hours <= 4 ? 'MODERATE' : 'HIGH' };
};

const EmergencyTemplate = ({ data, t, customColors, config, styleOverrides }) => {
  const hiddenSections = []; // Layout customization removed (premium no longer exists)
  const primaryColor = customColors?.primary || config?.primaryColor || '#13ec5b';

  const noise = getNoiseLevelBars(data.noiseLevel);
  const activity = getActivityBars(data.aloneTime);

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden">
      {/* Main Grid: Photo + Info (12 columns) */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: Pet Photo & Name (4 columns) */}
        <div className="col-span-4 flex flex-col gap-3">
          {/* Pet Photo */}
          {!hiddenSections.includes('photo') && (
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-4 border-black shadow-lg">
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                  <span className="material-symbols-outlined text-5xl">image</span>
                </div>
              )}
            </div>
          )}

          {/* Pet Name & Basic Info */}
          {!hiddenSections.includes('details') && (
            <div>
              <h2 className="text-3xl font-black text-black uppercase tracking-tighter">{data.name || '–'}</h2>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded">
                  {data.gender === 'm' ? 'MALE' : 'FEMALE'}
                </span>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-300">
                  {data.age ? `${data.age} ${t?.labels?.years?.toUpperCase() || 'YEARS'}` : '–'}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{t?.labels?.breed}</p>
                <p className="text-sm font-bold text-black border-l-4 pl-2" style={{ borderColor: primaryColor }}>{data.breed || '–'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Contacts (8 columns) */}
        <div className="col-span-8 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Emergency Contact */}
            <div className="bg-red-50 p-3 border-2 border-red-600 rounded-sm">
              <h3 className="text-[10px] font-black text-red-700 uppercase mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">emergency</span> {t?.labels?.emergencyContact || 'Notfallkontakt'}
              </h3>
              <p className="text-base font-black text-black leading-tight">{data.emergencyContactName || '–'}</p>
              <p className="text-xs font-bold text-red-600 mb-1.5">{data.emergencyContactRelation || '–'}</p>
              {data.emergencyContactPhone && (
                <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded border border-red-200 shadow-sm">
                  <span className="material-symbols-outlined text-red-600 text-sm">call</span>
                  <span className="text-sm font-black text-black tracking-tight">{data.emergencyContactPhone}</span>
                </div>
              )}
            </div>

            {/* Owner Info */}
            {!hiddenSections.includes('owner') && (
              <div className="bg-gray-50 p-3 border border-gray-300 rounded-sm">
                <h3 className="text-[10px] font-black text-gray-500 uppercase mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">person</span> {t?.doc?.sectionOwner || 'Halter'}
                </h3>
                <p className="text-base font-black text-black leading-tight">{data.ownerName || '–'}</p>
                <p className="text-[10px] text-gray-500 mb-1.5">{data.city ? `${data.city}, Schweiz` : '–'}</p>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-400 text-xs">call</span>
                    <span className="text-xs font-bold">{data.phone || '–'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-gray-400 text-xs">mail</span>
                    <span className="text-xs font-medium truncate">{data.email || '–'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Veterinarian Info */}
          {!hiddenSections.includes('legal') && (
            <div className="bg-blue-50 p-3 border border-blue-200 rounded-sm flex items-start gap-3">
              {/* QR Code */}
              <div className="bg-white p-1.5 rounded-sm border border-blue-100 shadow-sm hidden sm:block">
                <div
                  className="size-10 flex items-center justify-center"
                  style={{
                    backgroundImage: data.vetPhone ? `url(https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(`tel:${data.vetPhone}`)})` : 'none',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {!data.vetPhone && <span className="material-symbols-outlined text-blue-300 text-xl">qr_code_2</span>}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-black text-blue-700 uppercase mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">medical_services</span> {t?.labels?.vet || 'Tierarzt'}
                </h3>
                <p className="text-sm font-bold text-black">{data.vetName || '–'}</p>
                <p className="text-xs font-bold mt-0.5">{data.vetPhone || '–'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-400 uppercase font-black">CHIP ID</p>
                <p className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 border border-blue-100 mt-0.5">{data.chipId || '–'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dark Section: Daily Routine */}
      <div className="bg-gray-900 text-white p-4 rounded-sm shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3 border-b border-white/20 pb-1.5" style={{ color: primaryColor }}>
          Daily Routine & Care
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Feeding */}
          <div className="flex gap-3">
            <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>restaurant</span>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Fütterung</p>
              <p className="text-xs font-bold">2x {t?.labels?.daily || 'Täglich'}</p>
              <p className="text-[10px] text-gray-400">{data.medicalConditions || 'Standard Futter'}</p>
            </div>
          </div>

          {/* Walks */}
          <div className="flex gap-3">
            <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>directions_walk</span>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Gassi</p>
              <p className="text-xs font-bold">{data.activeHours || '3x Täglich'}</p>
              <p className="text-[10px] text-gray-400">{data.aloneTime ? `Max. ${data.aloneTime}h allein` : '–'}</p>
            </div>
          </div>

          {/* Health Status */}
          <div className="flex gap-3">
            <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>health_and_safety</span>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Status</p>
              <p className="text-xs font-bold">{data.hasVaccination ? 'Geimpft' : 'Nicht geimpft'}</p>
              <p className="text-[10px] text-gray-400 italic">{data.isNeutered ? 'Kastriert' : 'Nicht kastriert'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Behavior + Notes (2 columns) */}
      <div className="grid grid-cols-2 gap-5 border-t border-gray-200 pt-3">
        {/* Behavior */}
        {!hiddenSections.includes('behavior') && (
          <div>
            <h3 className="text-[10px] font-black text-black uppercase mb-3 tracking-widest border-b border-black pb-1">
              {t?.labels?.behaviorTitle || 'Verhalten'}
            </h3>
            <div className="space-y-3">
              {/* Noise Level Bars */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-600 uppercase">{t?.labels?.noiseLevel || 'Lautstärke'}</span>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-6 h-1 ${i <= noise.filled ? 'bg-green-500' : 'bg-gray-200'}`} />
                  ))}
                  <span className="text-[9px] font-bold text-gray-500 ml-2">{noise.label}</span>
                </div>
              </div>

              {/* Activity Level Bars */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-600 uppercase">Aktivität</span>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-6 h-1 ${i <= activity.filled ? 'bg-blue-500' : 'bg-gray-200'}`} />
                  ))}
                  <span className="text-[9px] font-bold text-gray-500 ml-2">{activity.label}</span>
                </div>
              </div>

              {/* Behavior Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.behaviorWithChildren && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-black border border-green-200 rounded uppercase">
                    Kid Friendly
                  </span>
                )}
                {data.behaviorWithPets && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-black border border-green-200 rounded uppercase">
                    Pet Friendly
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-50 text-green-700 text-[9px] font-black border border-green-200 rounded uppercase">
                  Potty Trained
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {!hiddenSections.includes('description') && (
          <div className="bg-gray-50 p-3 border border-dashed border-gray-300 rounded-sm">
            <h3 className="text-[10px] font-black text-black uppercase mb-1.5 tracking-widest">
              {t?.labels?.importantNotes || 'Wichtige Notizen'}
            </h3>
            <p className="text-[10px] leading-relaxed text-gray-700">
              {data.generatedText || t?.labels?.noDescription || 'Keine Beschreibung verfügbar'}
            </p>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-3 border border-gray-100 flex flex-wrap gap-x-6 gap-y-1.5 justify-center items-center bg-gray-50/50 rounded-sm">
        {data.insuranceProvider && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gray-400 text-xs">verified_user</span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">Haftpflicht: {data.insuranceProvider}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-xs ${data.hasVaccination ? 'text-green-500' : 'text-gray-400'}`}>
            {data.hasVaccination ? 'check_circle' : 'cancel'}
          </span>
          <span className="text-[9px] font-bold text-gray-500 uppercase">
            {data.hasVaccination ? 'Geimpft' : 'Nicht geimpft'} & {data.isNeutered ? 'Kastriert' : 'Nicht kastriert'}
          </span>
        </div>
        {data.hasRegistration && (
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-gray-400 text-xs">assignment</span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">Registriert: AMICUS</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyTemplate;
