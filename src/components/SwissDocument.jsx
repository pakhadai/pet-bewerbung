import React, { useMemo } from 'react';
import PetPhoto from './document/PetPhoto';
import OwnerInfo from './document/OwnerInfo';
import PetDetails from './document/PetDetails';
import LegalSection from './document/LegalSection';
import DescriptionSection from './document/DescriptionSection';
import BehaviorSection from './document/BehaviorSection';
import ReferenceSection from './document/ReferenceSection';
import { INITIAL_DATA } from '../constants';

// Section component mapping for dynamic template rendering
const SECTION_COMPONENTS = {
  photo: ({ data, t, variant, customColors }) => <PetPhoto photo={data.photo} petType={data.petType} t={t} variant={variant} customColors={customColors} />,
  owner: ({ data, t, variant, customColors }) => <OwnerInfo data={data} t={t} variant={variant} customColors={customColors} />,
  details: ({ data, t, variant, customColors }) => <PetDetails data={data} t={t} variant={variant} customColors={customColors} />,
  behavior: ({ data, t, variant, customColors }) => <BehaviorSection data={data} t={t} variant={variant} customColors={customColors} />,
  description: ({ data, t, variant, customColors }) => <DescriptionSection text={data.generatedText} t={t} variant={variant} customColors={customColors} />,
  legal: ({ data, t, variant, customColors }) => <LegalSection data={data} t={t} variant={variant} customColors={customColors} />,
  reference: ({ data, t, variant, customColors }) => <ReferenceSection data={data} t={t} variant={variant} customColors={customColors} />
};

// Default customDesign values for comparison (Midnight Purple theme)
const DEFAULT_COLORS = {
  primaryColor: '#4a148c',
  secondaryColor: '#f3e5f5'
};

// Sidebar sections (left column)
const SIDEBAR_SECTIONS = ['photo', 'owner', 'behavior'];
// Main sections (right column)
const MAIN_SECTIONS = ['details', 'description', 'legal', 'reference'];

const SwissDocument = ({ data, t, templateType = 'classic' }) => {
  // Get custom design settings
  const customDesign = data.customDesign || INITIAL_DATA.customDesign;
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

  // Simplified Swiss-style templates for 2026
  // Focus: Clean, professional, minimal, proper alignment
  const getTemplateConfig = () => {
    const configs = {
      classic: {
        container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[14mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-5 pb-3 border-b-2 border-slate-900',
        headerFlex: 'flex items-start justify-between',
        headerIconContainer: 'flex items-center gap-3',
        headerIconBg: 'bg-white p-2 rounded-sm border-2 border-slate-900',
        headerIconSize: 16,
        titleText: 'text-xl font-bold uppercase tracking-tight text-slate-900',
        subtitleText: 'text-[10px] uppercase tracking-wider text-slate-500 mt-1',
        dateText: 'text-[10px] text-slate-500 text-right',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1 min-h-0 overflow-hidden',
        sidebarWidth: 'w-[35%] flex-shrink-0',
        sidebarSpace: 'space-y-4',
        mainWidth: 'flex-1 min-w-0',
        mainSpace: 'space-y-4',
        footerContainer: 'mt-auto pt-2 border-t-2 border-slate-900 flex-shrink-0 pb-[3mm]',
        footerText: 'text-[9px] text-slate-400 uppercase tracking-wider text-center mb-2',
        footerSignContainer: 'w-40 border-t border-slate-400 pt-2 mt-4',
        footerSignText: 'text-[9px] uppercase font-semibold tracking-wider text-slate-600',
        badge: null
      },

      modern: {
        container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[14mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-5 pb-3 border-b border-slate-200',
        headerFlex: 'flex items-start justify-between',
        headerIconContainer: 'flex items-center gap-3',
        headerIconBg: 'bg-slate-100 text-slate-700 p-2 rounded-md border border-slate-200',
        headerIconSize: 18,
        titleText: 'text-2xl font-semibold text-slate-900',
        subtitleText: 'text-[11px] text-slate-500 mt-1.5',
        dateText: 'text-[10px] text-slate-400 text-right',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1 min-h-0 overflow-hidden',
        sidebarWidth: 'w-[35%] flex-shrink-0',
        sidebarSpace: 'space-y-4',
        mainWidth: 'flex-1 min-w-0',
        mainSpace: 'space-y-4',
        footerContainer: 'mt-auto pt-2 border-t border-slate-200 flex-shrink-0 pb-[3mm]',
        footerText: 'text-[9px] text-slate-400 text-center mb-2',
        footerSignContainer: 'w-40 border-t border-slate-300 pt-2 mt-4',
        footerSignText: 'text-[9px] uppercase font-medium tracking-wider text-slate-500',
        badge: null
      },

      compact: {
        container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[12mm] text-[10px] font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-4 pb-3 border-b border-slate-300',
        headerFlex: 'flex items-start justify-between',
        headerIconContainer: 'flex items-center gap-2',
        headerIconBg: 'bg-white p-1.5 rounded-sm border-2 border-slate-700',
        headerIconSize: 14,
        titleText: 'text-base font-bold uppercase tracking-tight',
        subtitleText: 'text-[9px] uppercase tracking-wider text-slate-500 mt-0.5',
        dateText: 'text-[9px] text-slate-400 text-right',
        dateLabel: today,
        mainLayout: 'flex gap-4 flex-1 min-h-0 overflow-hidden',
        sidebarWidth: 'w-[32%] flex-shrink-0',
        sidebarSpace: 'space-y-3',
        mainWidth: 'flex-1 min-w-0',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-2 border-t border-slate-300 flex-shrink-0',
        footerText: 'text-[8px] text-slate-400 text-center mb-1.5',
        footerSignContainer: 'w-36 border-t border-slate-300 pt-1.5 mt-3',
        footerSignText: 'text-[8px] uppercase font-medium tracking-wider text-slate-500',
        badge: null
      },

      swiss: {
        container: 'w-[210mm] h-[292mm] bg-white text-slate-900 p-[14mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden border-t-4 border-red-600',
        headerContainer: 'mb-5 pb-3 border-b-2 border-red-600',
        headerFlex: 'flex items-start justify-between',
        headerIconContainer: 'flex items-center gap-3',
        headerIconBg: 'bg-white p-2 rounded-sm border border-red-600',
        headerIconSize: 16,
        titleText: 'text-xl font-bold uppercase tracking-tight text-slate-900',
        subtitleText: 'text-[10px] uppercase tracking-wider text-red-600 mt-1 font-semibold',
        dateText: 'text-[10px] text-slate-500 text-right',
        dateLabel: today,
        dateBadge: null,
        mainLayout: 'flex gap-6 flex-1 min-h-0 overflow-hidden',
        sidebarWidth: 'w-[35%] flex-shrink-0',
        sidebarSpace: 'space-y-4',
        mainWidth: 'flex-1 min-w-0',
        mainSpace: 'space-y-4',
        footerContainer: 'mt-auto pt-2 border-t-2 border-red-600 flex-shrink-0 pb-[3mm]',
        footerText: 'text-[9px] text-slate-500 text-center mb-2',
        footerSignContainer: 'w-40 border-t border-red-400 pt-2 mt-4',
        footerSignText: 'text-[9px] uppercase font-semibold tracking-wider text-slate-600',
        badge: null
      },

      professional: {
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
        // Professional template uses grid layout instead of sidebar
        mainLayout: 'grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden',
        sidebarWidth: 'col-span-5',
        sidebarSpace: 'flex flex-col gap-4',
        mainWidth: 'col-span-7',
        mainSpace: 'flex flex-col gap-4',
        // Description spans full width
        descriptionContainer: 'col-span-12 border-t border-gray-200 pt-4',
        // Bottom grid for legal + references
        bottomLayout: 'col-span-12 grid grid-cols-2 gap-6 border-t border-gray-200 pt-4',
        footerContainer: 'mt-auto pt-3 border-t-4 border-black flex-shrink-0',
        footerText: 'text-[9px] text-gray-400 font-mono',
        footerSignContainer: 'w-44 border-b border-gray-300 pb-2',
        footerSignText: 'text-[9px] text-center text-gray-500 mt-1',
        primaryColor: '#13ec5b',
        badge: null
      },

      emergency: {
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
      }
    };

    return configs[templateType] || configs.classic;
  };

  // Check if customDesign has been modified (either via isEdited flag or by comparing values)
  const hasCustomColors = customDesign.primaryColor !== DEFAULT_COLORS.primaryColor || 
                          customDesign.secondaryColor !== DEFAULT_COLORS.secondaryColor;
  const hasCustomLayout = customDesign.hiddenSections?.length > 0 ||
                          JSON.stringify(customDesign.layoutOrder) !== JSON.stringify(INITIAL_DATA.customDesign.layoutOrder);
  // isEdited flag is set when user applies changes in the Visual Editor
  const isCustomized = customDesign.isEdited || hasCustomColors || hasCustomLayout;
  
  // Custom colors - available for ANY template when user has customized
  const customColors = useMemo(() => {
    if (!isCustomized) return null;
    return {
      primary: customDesign.primaryColor || '#b39ddb',
      secondary: customDesign.secondaryColor || '#f5f5f5',
      accentStyle: customDesign.accentStyle || 'modern'
    };
  }, [isCustomized, customDesign]);

  const config = getTemplateConfig();

  // Render header based on template (with optional custom colors)
  const renderHeader = () => {
    // Apply custom colors when user has customized the template
    if (customColors) {
      return (
        <div className={config.headerContainer} style={{ borderBottomColor: customColors.primary }}>
          <div className={config.headerFlex}>
            <div className={config.headerIconContainer}>
              <div 
                className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`}
                style={{ borderColor: customColors.primary }}
              >
                <img src="/logo.png" alt="" className="w-full h-full object-contain" style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }} />
              </div>
              <div className="flex flex-col">
                <h1 className={config.titleText}>{t.doc.title}</h1>
                <p className={config.subtitleText} style={{ color: customColors.primary }}>{t.doc.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={config.dateText}>{config.dateLabel}</p>
            </div>
          </div>
        </div>
      );
    }

    if (templateType === 'swiss') {
      return (
        <div className={config.headerContainer}>
          <div className={config.headerFlex}>
            <div className={config.headerIconContainer}>
              <div className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`}>
                <img src="/logo.png" alt="" className="w-full h-full object-contain" style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }} />
              </div>
              <div className="flex flex-col">
                <h1 className={config.titleText}>{t.doc.title}</h1>
                <p className={config.subtitleText}>{t.doc.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={config.dateText}>{config.dateLabel}</p>
            </div>
          </div>
        </div>
      );
    }

    // Professional template header
    if (templateType === 'professional') {
      return (
        <div className={config.headerContainer}>
          <div className={config.headerFlex}>
            <div className={config.headerIconContainer}>
              <div className={config.headerIconBg}>
                <span className="material-symbols-outlined text-xl">verified</span>
              </div>
              <div className="flex flex-col">
                <h1 className={config.titleText}>{t.doc.title}</h1>
                <p className={config.subtitleText}>{t.doc.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t.labels.date || 'Datum'}</p>
              <p className="text-sm font-medium text-black">{config.dateLabel}</p>
            </div>
          </div>
        </div>
      );
    }

    // Emergency template header
    if (templateType === 'emergency') {
      return (
        <div className={config.headerContainer}>
          <div className={config.headerFlex}>
            <div className={config.headerIconContainer}>
              <div className={config.headerIconBg}>
                <span className="material-symbols-outlined text-3xl">emergency_home</span>
              </div>
              <div className="flex flex-col">
                <h1 className={config.titleText}>Emergency Profile</h1>
                <p className={config.subtitleText}>Kritische Informationen für Tiersitter</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.labels.date || 'Aktualisiert am'}</p>
              <p className="text-sm font-bold text-black">{config.dateLabel}</p>
            </div>
          </div>
        </div>
      );
    }

    // Default header (classic, modern, compact)
    return (
      <div className={config.headerContainer}>
        <div className={config.headerFlex}>
          <div className={config.headerIconContainer}>
            <div className={`${config.headerIconBg} flex items-center justify-center overflow-hidden p-1`}>
              <img src="/logo.png" alt="" className="w-full h-full object-contain" style={{ width: config.headerIconSize + 8, height: config.headerIconSize + 8 }} />
            </div>
            <div className="flex flex-col">
              <h1 className={config.titleText}>{t.doc.title}</h1>
              <p className={config.subtitleText}>{t.doc.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={config.dateText}>{config.dateLabel}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render footer: left = generated by, right = signature line (with optional custom colors)
  const renderFooter = () => {
    if (!config.footerContainer) return null;

    // Apply custom colors when user has customized the template
    if (customColors) {
      return (
        <div className={config.footerContainer} style={{ borderTopColor: customColors.primary }}>
          <div className="flex justify-between items-end">
            <p className="text-[8px] text-slate-500 uppercase tracking-wider">
              {t.doc.footer ?? 'Dokument generiert via Pet-Bewerbung.ch'}
            </p>
            {config.footerSignContainer && (
              <div className={config.footerSignContainer} style={{ borderTopColor: customColors.primary }}>
                <p className={config.footerSignText}>{t.doc.sign}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Professional template footer
    if (templateType === 'professional') {
      return (
        <div className={config.footerContainer}>
          <div className="flex justify-between items-end">
            <div className={config.footerText}>
              Dokument-ID: {Math.random().toString(36).substring(2, 6).toUpperCase()}-REF-{new Date().getFullYear()}<br/>
              Generiert via <span className="font-bold" style={{ color: config.primaryColor }}>Pet-Bewerbung.ch</span>
            </div>
            {config.footerSignContainer && (
              <div className="flex flex-col gap-1">
                <div className={config.footerSignContainer}></div>
                <p className={config.footerSignText}>{t.doc.sign}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Emergency template footer
    if (templateType === 'emergency') {
      return (
        <div className={config.footerContainer}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-3">
            <div className={config.footerText}>
              EMERGENCY-ID: {Math.random().toString(36).substring(2, 6).toUpperCase()}-PET-PROFILE-{new Date().getFullYear()}<br/>
              Powered by <span className="text-black font-bold">Pet-Bewerbung.ch</span>
            </div>
            <div className="flex flex-col gap-0.5 w-40 items-center">
              <div className={config.footerSignContainer}></div>
              <p className={config.footerSignText}>Digital Signatur Halter</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={config.footerContainer}>
        <div className="flex justify-between items-end">
          <p className="text-[8px] text-slate-500 uppercase tracking-wider">
            {t.doc.footer ?? 'Dokument generiert via Pet-Bewerbung.ch'}
          </p>
          {config.footerSignContainer && (
            <div className={config.footerSignContainer}>
              <p className={config.footerSignText}>{t.doc.sign}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render main content layout (with optional dynamic section ordering)
  const renderContent = () => {
    // Professional template has a unique layout
    if (templateType === 'professional') {
      return renderProfessionalContent();
    }
    
    // Emergency template has its own unique layout
    if (templateType === 'emergency') {
      return renderEmergencyContent();
    }

    // Apply dynamic section ordering when user has customized the layout
    if (hasCustomLayout && customDesign) {
      const layoutOrder = customDesign.layoutOrder || INITIAL_DATA.customDesign.layoutOrder;
      const hiddenSections = customDesign.hiddenSections || [];
      
      // Filter out hidden sections
      const visibleSections = layoutOrder.filter(id => !hiddenSections.includes(id));
      
      // Separate into sidebar and main sections while maintaining order
      const sidebarSections = visibleSections.filter(id => SIDEBAR_SECTIONS.includes(id));
      const mainSections = visibleSections.filter(id => MAIN_SECTIONS.includes(id));
      
      return (
        <div className={config.mainLayout}>
          <div className={`${config.sidebarWidth} ${config.sidebarSpace}`}>
            {sidebarSections.map(sectionId => {
              const Component = SECTION_COMPONENTS[sectionId];
              return Component ? (
                <div key={sectionId}>
                  {Component({ data, t, variant: 'custom', customColors })}
                </div>
              ) : null;
            })}
          </div>
          <div className={`${config.mainWidth} ${config.mainSpace}`}>
            {mainSections.map(sectionId => {
              const Component = SECTION_COMPONENTS[sectionId];
              return Component ? (
                <div key={sectionId}>
                  {Component({ data, t, variant: 'custom', customColors })}
                </div>
              ) : null;
            })}
          </div>
        </div>
      );
    }
    
    // Standard two-column layout with proper flex constraints
    return (
      <div className={config.mainLayout}>
        <div className={`${config.sidebarWidth} ${config.sidebarSpace}`}>
          <PetPhoto photo={data.photo} petType={data.petType} t={t} variant={templateType} />
          <OwnerInfo data={data} t={t} variant={templateType} />
          <BehaviorSection data={data} t={t} variant={templateType} />
        </div>
        <div className={`${config.mainWidth} ${config.mainSpace}`}>
          <PetDetails data={data} t={t} variant={templateType} />
          <DescriptionSection text={data.generatedText} t={t} variant={templateType} />
          <LegalSection data={data} t={t} variant={templateType} />
          <ReferenceSection data={data} t={t} variant={templateType} />
        </div>
      </div>
    );
  };

  // Render professional template content with unique grid layout
  const renderProfessionalContent = () => {
    const hiddenSections = customDesign?.hiddenSections || [];
    const primaryColor = customColors?.primary || config.primaryColor || '#13ec5b';
    
    return (
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Two-column main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Pet Photo & Stats */}
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
                  Referenz-ID: #{Math.random().toString(36).substring(2, 6).toUpperCase()}-PET
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-gray-200 pt-3">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">{t.labels.breed}</p>
                    <p className="text-xs font-semibold text-black">{data.breed || '–'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">{t.labels.gender}</p>
                    <p className="text-xs font-semibold text-black">{data.gender === 'm' ? t.labels.male : t.labels.female}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">{t.labels.age}</p>
                    <p className="text-xs font-semibold text-black">{data.age ? `${data.age} ${t.labels.years}` : '–'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-bold">{t.labels.weight}</p>
                    <p className="text-xs font-semibold text-black">{data.weight ? `${data.weight} kg` : '–'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Owner & Behavior */}
          <div className="col-span-7 flex flex-col gap-4">
            {/* Owner Info */}
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
                
                <h3 className="text-sm font-bold text-black uppercase border-b border-gray-200 pb-2 mb-3">{t.doc.sectionOwner}</h3>
                <div className="space-y-2 pr-16">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">{t.labels.name}</p>
                    <p className="font-medium text-sm text-black">{data.ownerName || '–'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">{t.labels.address}</p>
                    <p className="font-medium text-sm text-black">{data.street} {data.houseNumber}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">{t.labels.city}</p>
                    <p className="font-medium text-sm text-black">{data.postal} {data.city}</p>
                  </div>
                  {/* Phone and Email on same row, closer together */}
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
            
            {/* Behavior & Routine */}
            {!hiddenSections.includes('behavior') && (
              <div>
                <h3 className="text-sm font-bold text-black uppercase border-b-2 border-black pb-2 mb-3">{t.labels.behaviorTitle}</h3>
                
                {/* Progress bars */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{t.labels.noiseLevel}</span>
                      <span className="text-[9px] text-gray-500">
                        {data.noiseLevel === 'low' ? t.labels.noiseLow : data.noiseLevel === 'medium' ? t.labels.noiseMedium : t.labels.noiseHigh}
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
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{t.labels.aloneTime || 'Aktivität'}</span>
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
                        <span className="text-[9px] text-gray-500 mb-0.5">{t.labels.aloneTime}</span>
                        <span className="font-bold text-black text-sm">{data.aloneTime} Std.</span>
                      </div>
                    )}
                    {data.activeHours && (
                      <div className="flex flex-col p-2 bg-gray-50 rounded border border-gray-100">
                        <span className="text-[9px] text-gray-500 mb-0.5">{t.labels.activeHours}</span>
                        <span className="font-bold text-black text-sm">{data.activeHours}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {data.behaviorWithChildren === 'good' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800">
                      <span className="material-symbols-outlined text-xs">check_circle</span> {t.labels.behaviorWithChildren}
                    </span>
                  )}
                  {data.behaviorWithPets === 'good' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800">
                      <span className="material-symbols-outlined text-xs">check_circle</span> {t.labels.behaviorWithPets}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800">
                    <span className="material-symbols-outlined text-xs">check_circle</span> Stubenrein
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Description Block - Full Width */}
        {!hiddenSections.includes('description') && data.generatedText && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold text-black uppercase mb-2">{t.doc.sectionDescription || 'Charakterbeschreibung'}</h3>
            <p className="text-xs leading-relaxed text-gray-700 text-justify">{data.generatedText}</p>
          </div>
        )}
        
        {/* Bottom Grid: Legal & References */}
        <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-4">
          {/* Legal & Insurance */}
          {!hiddenSections.includes('legal') && (
            <div>
              <h3 className="text-xs font-bold text-black uppercase mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-gray-400 text-sm">gavel</span> {t.doc.sectionLegal}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                  <span className="text-[10px] text-gray-600">{t.labels.chipId}</span>
                  <span className="text-[10px] font-mono font-medium text-black">{data.chipId || '–'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                  <span className="text-[10px] text-gray-600">{t.labels.insurance}</span>
                  <span className="text-[10px] font-medium text-black">{data.insuranceProvider || '–'}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-200">
                  <span className="text-[10px] text-gray-600">{t.labels.vetPractice}</span>
                  <span className="text-[10px] font-medium text-black">{data.vetName || '–'}</span>
                </div>
                {/* Status icons */}
                <div className="flex gap-3 pt-2">
                  {data.hasVaccination && (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-sm">vaccines</span>
                      </div>
                      <span className="text-[8px] uppercase font-bold text-gray-500">{t.labels.vaccinated}</span>
                    </div>
                  )}
                  {data.isNeutered && (
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="size-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <span className="material-symbols-outlined text-sm">content_cut</span>
                      </div>
                      <span className="text-[8px] uppercase font-bold text-gray-500">{t.labels.neutered}</span>
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
                <span className="material-symbols-outlined text-gray-400 text-sm">history_edu</span> {t.doc.sectionReference}
              </h3>
              
              {/* Landlord Reference */}
              {data.previousLandlordName && (
                <div className="bg-blue-50 p-3 rounded-sm border border-blue-100 mb-3">
                  <p className="text-[9px] text-blue-800 uppercase font-bold mb-0.5">{t.labels.previousLandlord}</p>
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
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">{t.labels.emergencyContact}</p>
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

  // Render emergency template content with unique layout for pet sitters
  const renderEmergencyContent = () => {
    const hiddenSections = customDesign?.hiddenSections || [];
    const primaryColor = customColors?.primary || config.primaryColor || '#13ec5b';
    const accentColor = config.accentColor || '#dc2626';
    
    // Helper for noise level bars
    const getNoiseLevelBars = () => {
      const level = data.noiseLevel || 'low';
      const levels = { low: 1, medium: 2, high: 4 };
      const filled = levels[level] || 1;
      const labels = { low: 'QUIET', medium: 'MODERATE', high: 'LOUD' };
      return { filled, label: labels[level] || 'QUIET' };
    };
    
    // Helper for activity level
    const getActivityBars = () => {
      const hours = parseInt(data.aloneTime) || 0;
      const filled = hours <= 2 ? 1 : hours <= 4 ? 2 : hours <= 6 ? 3 : 4;
      return { filled, label: hours <= 2 ? 'LOW' : hours <= 4 ? 'MODERATE' : 'HIGH' };
    };
    
    const noise = getNoiseLevelBars();
    const activity = getActivityBars();
    
    return (
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {/* Main Grid: Photo + Info */}
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column: Pet Photo & Name */}
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
                    {data.age ? `${data.age} ${t.labels.years?.toUpperCase() || 'YEARS'}` : '–'}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{t.labels.breed}</p>
                  <p className="text-sm font-bold text-black border-l-4 pl-2" style={{ borderColor: primaryColor }}>{data.breed || '–'}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Contacts */}
          <div className="col-span-8 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Emergency Contact */}
              <div className="bg-red-50 p-3 border-2 border-red-600 rounded-sm">
                <h3 className="text-[10px] font-black text-red-700 uppercase mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">emergency</span> {t.labels.emergencyContact || 'Notfallkontakt'}
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
                    <span className="material-symbols-outlined text-sm">person</span> {t.doc.sectionOwner || 'Halter'}
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
                    <span className="material-symbols-outlined text-sm">medical_services</span> {t.labels.vet || 'Tierarzt'}
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
            <div className="flex gap-3">
              <div className="size-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm" style={{ color: primaryColor }}>restaurant</span>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-black">Fütterung</p>
                <p className="text-xs font-bold">2x {t.labels.daily || 'Täglich'}</p>
                <p className="text-[10px] text-gray-400">{data.medicalConditions || 'Standard Futter'}</p>
              </div>
            </div>
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
        
        {/* Bottom Grid: Behavior + Notes */}
        <div className="grid grid-cols-2 gap-5 border-t border-gray-200 pt-3">
          {/* Behavior */}
          {!hiddenSections.includes('behavior') && (
            <div>
              <h3 className="text-[10px] font-black text-black uppercase mb-3 tracking-widest border-b border-black pb-1">
                {t.labels.behaviorTitle || 'Verhalten'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-600 uppercase">{t.labels.noiseLevel || 'Lautstärke'}</span>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-6 h-1 ${i <= noise.filled ? 'bg-green-500' : 'bg-gray-200'}`} />
                    ))}
                    <span className="text-[9px] font-bold text-gray-500 ml-2">{noise.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-600 uppercase">Aktivität</span>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-6 h-1 ${i <= activity.filled ? 'bg-blue-500' : 'bg-gray-200'}`} />
                    ))}
                    <span className="text-[9px] font-bold text-gray-500 ml-2">{activity.label}</span>
                  </div>
                </div>
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
                {t.labels.importantNotes || 'Wichtige Notizen'}
              </h3>
              <p className="text-[10px] leading-relaxed text-gray-700">
                {data.generatedText || t.labels.noDescription || 'Keine Beschreibung verfügbar'}
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

  // Subtle watermark
  const Watermark = () => (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] select-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute whitespace-nowrap font-bold text-slate-900"
        style={{
          fontSize: '72px',
          transform: 'rotate(-45deg)',
          top: '50%',
          left: '50%',
          marginLeft: '-360px',
          marginTop: '-90px',
          letterSpacing: '6px',
        }}
      >
        Pet-Bewerbung.ch
      </div>
    </div>
  );

  // Dynamic style for custom colors (applies to any template when customized)
  const customStyle = customColors ? {
    '--custom-primary': customColors.primary,
    '--custom-secondary': customColors.secondary,
    borderTopColor: customColors.primary,
    borderTopWidth: '4px'
  } : {};

  return (
    <div className={config.container} style={customStyle}>
      <Watermark />
      <div className="relative z-10 flex flex-col h-full">
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
      </div>
    </div>
  );
};

export default SwissDocument;
