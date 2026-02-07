import React from 'react';

/**
 * FriendlyTemplate - Whimsical purple theme with card-based layout
 *
 * Layout Structure:
 * - Header with large pet photo and whimsical design
 * - 2-column layout:
 *   - Left Column: About me and behavior cards with purple theme
 *   - Right Column: Owner info and pet details cards
 * - Rounded corners and purple accent color (#6400f0)
 * - Icons for visual interest
 *
 * Design Features:
 * - Large photo in header (rotated -2deg)
 * - Card-based sections with rounded corners
 * - Purple gradient for owner section
 * - Whimsical icons for each section
 */

export const getFriendlyConfig = (today) => ({
  container: 'w-[210mm] h-[292mm] bg-white text-[#130c1d] p-[12mm] text-xs relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
  headerContainer: 'mb-6 pb-0',
  headerFlex: 'flex flex-row gap-6 items-start',
  headerIconContainer: 'flex-shrink-0',
  headerIconBg: 'w-36 h-36 rounded-2xl overflow-hidden border-4 border-[#efe5fd] shadow-lg rotate-[-2deg]',
  headerIconSize: 144,
  titleText: 'text-4xl font-extrabold text-[#130c1d] tracking-tight mb-1',
  subtitleText: 'text-lg text-[#6400f0] font-medium mb-3',
  dateText: 'hidden',
  dateLabel: today,
  mainLayout: 'grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden',
  sidebarWidth: 'col-span-7',
  sidebarSpace: 'flex flex-col gap-4',
  mainWidth: 'col-span-5',
  mainSpace: 'flex flex-col gap-4',
  footerContainer: 'mt-auto pt-4 border-t-2 border-dashed border-[#ece6f4] flex-shrink-0',
  footerText: 'text-[8px] text-gray-400 tracking-wider',
  footerSignContainer: 'w-32 border-b border-gray-300 pb-1',
  footerSignText: 'text-[8px] uppercase tracking-widest text-gray-400 mt-1',
  primaryColor: '#6400f0',
  accentColor: '#efe5fd',
  badge: null
});

const FriendlyTemplate = ({ data, t, customColors, config, styleOverrides }) => {
  const hiddenSections = data?.customDesign?.hiddenSections || [];
  const primaryColor = customColors?.primary || config?.primaryColor || '#6400f0';
  const accentColor = customColors?.secondary || config?.accentColor || '#efe5fd';

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      {/* Header with Pet Photo */}
      <div className="flex flex-row gap-6 items-start mb-6">
        {/* Pet Photo - Large and whimsical */}
        {!hiddenSections.includes('photo') && (
          <div className="flex-shrink-0 w-36 h-36 rounded-2xl overflow-hidden border-4 shadow-lg" style={{ borderColor: accentColor, transform: 'rotate(-2deg)' }}>
            {data.photo ? (
              <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-300 text-6xl">pets</span>
              </div>
            )}
          </div>
        )}

        {/* Pet Name & Title */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-[#130c1d] tracking-tight mb-1">{data.name || 'Mein Name'}</h1>
          <p className="text-lg font-medium mb-3" style={{ color: primaryColor }}>
            {t?.doc?.title || 'Mein persönliches Profil'}
          </p>
          {!hiddenSections.includes('details') && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>badge</span>
                <span className="text-[#130c1d]/70">{data.breed || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>calendar_month</span>
                <span className="text-[#130c1d]/70">{data.age ? `${data.age} ${t?.labels?.years || 'Jahre'}` : '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>boy</span>
                <span className="text-[#130c1d]/70">{data.gender === 'm' ? t?.labels?.male : t?.labels?.female}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: About Me & Behavior (7 cols) */}
        <div className="col-span-7 flex flex-col gap-4">
          {/* About Me Section */}
          {!hiddenSections.includes('description') && (
            <div className="p-4 rounded-2xl border" style={{ backgroundColor: `${accentColor}40`, borderColor: accentColor }}>
              <h2 className="text-sm font-bold text-[#130c1d] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" style={{ color: primaryColor }}>info</span>
                {t?.doc?.descTitle || 'Über mich'}
              </h2>
              <p className="text-[11px] leading-relaxed text-[#130c1d]/80">
                {data.generatedText || t?.doc?.defaultDescription || 'Hier könnte eine Beschreibung stehen...'}
              </p>
            </div>
          )}

          {/* Behavior/Temperament Section */}
          {!hiddenSections.includes('behavior') && (
            <div className="bg-white p-4 rounded-2xl border shadow-sm" style={{ borderColor: accentColor }}>
              <h2 className="text-sm font-bold text-[#130c1d] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" style={{ color: primaryColor }}>mood</span>
                {t?.doc?.behavior || 'Temperament'}
              </h2>

              {/* Behavior Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm" style={{ color: data.behaviorWithChildren === 'good' ? primaryColor : '#ccc' }}>
                    {data.behaviorWithChildren === 'good' ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-[#130c1d]/70">{t?.labels?.behaviorWithChildren || 'Kinderfreundlich'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm" style={{ color: data.behaviorWithPets === 'good' ? primaryColor : '#ccc' }}>
                    {data.behaviorWithPets === 'good' ? 'check_circle' : 'cancel'}
                  </span>
                  <span className="text-[#130c1d]/70">{t?.labels?.behaviorWithPets || 'Tierfreundlich'}</span>
                </div>
              </div>

              {/* Noise Level */}
              {data.noiseLevel && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: accentColor }}>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>volume_up</span>
                    <span className="text-[#130c1d]/70">{t?.labels?.noiseLevel || 'Lautstärke'}:</span>
                    <span className="font-medium text-[#130c1d]">
                      {data.noiseLevel === 'low' ? (t?.labels?.noiseLow || 'Niedrig') :
                        data.noiseLevel === 'medium' ? (t?.labels?.noiseMedium || 'Mittel') :
                        (t?.labels?.noiseHigh || 'Hoch')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Owner & Pet Details (5 cols) */}
        <div className="col-span-5 flex flex-col gap-4">
          {/* Owner Info */}
          {!hiddenSections.includes('owner') && (
            <div className="bg-gradient-to-br p-4 rounded-2xl text-white" style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)` }}>
              <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person</span>
                {t?.doc?.ownerTitle || 'Halter'}
              </h2>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm opacity-80">badge</span>
                  <span>{data.ownerName || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm opacity-80">home</span>
                  <span>{(data.street || data.city) ? `${data.street || ''} ${data.houseNumber || ''}, ${data.postal || ''} ${data.city || ''}`.trim() : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm opacity-80">call</span>
                  <span>{data.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm opacity-80">mail</span>
                  <span>{data.email || '—'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pet Details Card */}
          {!hiddenSections.includes('legal') && (
            <div className="bg-white p-4 rounded-2xl border shadow-sm" style={{ borderColor: accentColor }}>
              <h2 className="text-sm font-bold text-[#130c1d] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" style={{ color: primaryColor }}>pets</span>
                {t?.doc?.details || 'Details'}
              </h2>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: accentColor }}>
                  <span className="text-gray-500">{t?.labels?.chipId || 'Chip-ID'}</span>
                  <span className="font-medium text-[#130c1d]">{data.chipId || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: accentColor }}>
                  <span className="text-gray-500">{t?.labels?.vet || 'Tierarzt'}</span>
                  <span className="font-medium text-[#130c1d]">{data.vetName || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: accentColor }}>
                  <span className="text-gray-500">{t?.labels?.insurance || 'Versicherung'}</span>
                  <span className="font-medium text-[#130c1d]">{data.insuranceProvider || '—'}</span>
                </div>
                <div className="flex gap-3 mt-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] ${data.hasVaccination ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-xs">{data.hasVaccination ? 'check' : 'close'}</span>
                    {t?.labels?.vaccinated || 'Geimpft'}
                  </span>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] ${data.isNeutered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-xs">{data.isNeutered ? 'check' : 'close'}</span>
                    {t?.labels?.neutered || 'Kastriert'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendlyTemplate;
