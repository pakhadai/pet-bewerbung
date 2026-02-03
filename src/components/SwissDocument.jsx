import React from 'react';
import PetPhoto from './document/PetPhoto';
import OwnerInfo from './document/OwnerInfo';
import PetDetails from './document/PetDetails';
import LegalSection from './document/LegalSection';
import DescriptionSection from './document/DescriptionSection';
import BehaviorSection from './document/BehaviorSection';
import ReferenceSection from './document/ReferenceSection';

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
        dateBadge: null, // Removed "Swiss Standard" badge - no official standard exists for pet CVs
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
      }
    };

    return configs[templateType] || configs.classic;
  };

  const config = getTemplateConfig();

  // Render header based on template
  const renderHeader = () => {
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

  // Render footer: left = generated by, right = signature line
  const renderFooter = () => {
    if (!config.footerContainer) return null;

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

  // Render main content layout
  const renderContent = () => {
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

  return (
    <div className={config.container}>
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
