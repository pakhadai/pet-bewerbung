import React from 'react';
import { PawPrint } from 'lucide-react';
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

  // Template configuration
  const getTemplateConfig = () => {
    const configs = {
      classic: {
        container: 'w-[210mm] min-h-[297mm] max-h-[297mm] bg-white text-slate-900 p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-2',
        headerFlex: 'flex items-center justify-between mb-2',
        headerIconContainer: 'flex items-center gap-2',
        headerIconBg: 'bg-slate-900 text-white p-1 rounded',
        headerIconSize: 14,
        titleText: 'text-lg font-black uppercase tracking-wide',
        subtitleText: 'text-[9px] uppercase tracking-widest text-slate-500',
        dateText: 'text-[9px] text-slate-400 text-right',
        dateLabel: t.doc.date,
        mainLayout: 'flex gap-4 flex-1 min-h-0',
        sidebarWidth: 'w-[32%]',
        sidebarSpace: 'space-y-2',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-2',
        footerContainer: 'mt-auto pt-2 border-t-2 border-slate-900 flex justify-between items-end',
        footerText: 'text-[8px] text-slate-400 uppercase tracking-wider',
        footerSignContainer: 'w-40 border-t-2 border-slate-900 pt-1',
        footerSignText: 'text-[8px] uppercase font-black tracking-wider',
        badge: null // No badge for classic
      },

      modern: {
        container: 'w-[210mm] min-h-[297mm] max-h-[297mm] bg-gradient-to-br from-white via-rose-50 to-pink-50 text-slate-900 p-[10mm] text-xs leading-relaxed font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-2',
        headerFlex: 'bg-gradient-to-r from-rose-400 to-pink-400 -mx-[10mm] -mt-[10mm] px-[10mm] pt-[10mm] pb-3 mb-2 text-white flex items-center justify-between',
        headerIconContainer: 'flex items-center gap-2',
        headerIconBg: 'bg-white text-rose-500 p-1.5 rounded-full shadow-lg',
        headerIconSize: 16,
        titleText: 'text-xl font-black',
        subtitleText: 'text-[10px] font-medium opacity-90',
        dateText: 'text-[10px] text-right opacity-90',
        dateLabel: today,
        mainLayout: 'flex gap-4 flex-1 min-h-0',
        sidebarWidth: 'w-[32%]',
        sidebarSpace: 'space-y-2',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-2',
        footerContainer: 'mt-auto pt-2 border-t border-rose-200 text-center',
        footerText: 'text-[8px] text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      elegant: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-slate-800 p-[13mm] text-sm font-serif relative box-border flex flex-col shadow-none mx-auto border-4 border-amber-400 overflow-hidden',
        headerContainer: 'mb-4 text-center border-b-2 border-amber-400 pb-3',
        headerFlex: null,
        headerIconContainer: 'inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-2 rounded-full mb-2',
        headerIconBg: null,
        headerIconSize: 20,
        titleText: 'text-3xl font-bold text-amber-700 mb-1',
        subtitleText: 'text-xs text-amber-600 uppercase tracking-widest',
        dateText: 'text-[10px] text-amber-600 mt-1',
        dateLabel: today,
        mainLayout: 'flex gap-5 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-3',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-2 border-t border-amber-400 text-center',
        footerText: 'text-[10px] text-amber-600',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      minimal: {
        container: 'w-[210mm] h-[297mm] bg-white text-black p-[16mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-6',
        headerFlex: 'flex items-start justify-between',
        headerIconContainer: null,
        headerIconBg: null,
        headerIconSize: 24,
        titleText: 'text-4xl font-light tracking-tight mb-1',
        subtitleText: 'text-xs uppercase tracking-widest text-gray-400',
        dateText: 'text-[10px] text-right text-gray-400',
        dateLabel: today,
        mainLayout: 'space-y-4 flex-1',
        sidebarWidth: null,
        sidebarSpace: null,
        mainWidth: 'w-full',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-3 border-t border-gray-200 text-center',
        footerText: 'text-[10px] text-gray-400',
        footerSignContainer: null,
        footerSignText: null,
        badge: 'mb-4' // Special: PawPrint before title
      },

      colorful: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-slate-800 p-[14mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-4 bg-white rounded-2xl p-4 shadow-xl',
        headerFlex: 'flex items-center justify-between',
        headerIconContainer: 'flex items-center gap-3',
        headerIconBg: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-xl shadow-lg',
        headerIconSize: 20,
        titleText: 'text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
        subtitleText: 'text-xs text-purple-500 font-bold mt-0.5',
        dateText: 'text-xs text-slate-500',
        dateLabel: today,
        mainLayout: 'grid grid-cols-2 gap-4 flex-1',
        sidebarWidth: null,
        sidebarSpace: null,
        mainWidth: 'space-y-3',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-2 text-center',
        footerText: 'text-[10px] text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      professional: {
        container: 'w-[210mm] h-[297mm] bg-slate-900 text-white p-[15mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-4 pb-3 border-b border-slate-700',
        headerFlex: 'flex items-center justify-between',
        headerIconContainer: 'flex items-center gap-3',
        headerIconBg: 'bg-blue-500 p-2 rounded-lg',
        headerIconSize: 20,
        titleText: 'text-xl font-bold',
        subtitleText: 'text-xs text-slate-400 mt-0.5',
        dateText: 'text-xs text-slate-400',
        dateLabel: today,
        mainLayout: 'flex gap-5 flex-1',
        sidebarWidth: 'w-[38%]',
        sidebarSpace: 'space-y-3',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-2 border-t border-slate-700 text-center',
        footerText: 'text-[10px] text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      playful: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 text-slate-800 p-[14mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-4 text-center',
        headerFlex: null,
        headerIconContainer: 'inline-block bg-gradient-to-r from-orange-400 to-red-400 text-white p-3 rounded-full mb-2 shadow-lg',
        headerIconBg: null,
        headerIconSize: 24,
        titleText: 'text-3xl font-black text-orange-600 mb-1',
        subtitleText: 'text-xs text-orange-500 font-bold uppercase tracking-wide',
        dateText: 'text-[10px] text-slate-500 mt-1',
        dateLabel: today,
        mainLayout: 'flex gap-5 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-3',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-2 text-center',
        footerText: 'text-[10px] text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      swiss: {
        container: 'w-[210mm] h-[297mm] bg-white text-slate-900 p-[15mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto border-t-4 border-red-600 overflow-hidden',
        headerContainer: 'mb-4 flex items-center justify-between border-b border-red-600 pb-3',
        headerFlex: 'flex items-center gap-3',
        headerIconContainer: null,
        headerIconBg: 'bg-red-600 text-white p-2',
        headerIconSize: 20,
        titleText: 'text-2xl font-bold text-slate-900',
        subtitleText: 'text-xs text-red-600 font-semibold',
        dateText: 'text-[10px] text-slate-500',
        dateLabel: today,
        dateBadge: '🇨🇭 ' + t.ui.swissStandard.toUpperCase(),
        mainLayout: 'flex gap-5 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-3',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-3',
        footerContainer: 'mt-auto pt-2 border-t border-red-600 text-center',
        footerText: 'text-[10px] text-slate-600',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      compact: {
        container: 'w-[210mm] min-h-[297mm] max-h-[297mm] bg-white text-slate-900 p-[10mm] text-[10px] font-sans relative box-border flex flex-col shadow-none mx-auto overflow-hidden',
        headerContainer: 'mb-2',
        headerFlex: 'flex items-center justify-between mb-1 border-b border-slate-300 pb-1',
        headerIconContainer: 'flex items-center gap-1',
        headerIconBg: 'bg-slate-900 text-white p-1',
        headerIconSize: 12,
        titleText: 'text-sm font-bold',
        subtitleText: 'text-[8px] text-slate-500 uppercase tracking-wider',
        dateText: 'text-[8px] text-slate-400',
        dateLabel: today,
        mainLayout: 'flex gap-3 flex-1 min-h-0',
        sidebarWidth: 'w-[30%]',
        sidebarSpace: 'space-y-1.5',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-1.5',
        footerContainer: 'mt-auto pt-1 border-t border-slate-300 text-center',
        footerText: 'text-[7px] text-slate-400',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      }
    };

    return configs[templateType] || configs.classic;
  };

  const config = getTemplateConfig();

  // Render header based on template
  const renderHeader = () => {
    if (templateType === 'minimal') {
      return (
        <div className={config.headerContainer}>
          <PawPrint size={config.headerIconSize} className="mb-6" />
          <div className={config.headerFlex}>
            <div>
              <h1 className={config.titleText}>{data.name || t.ui.owner}</h1>
              <p className={config.subtitleText}>{t.doc.subtitle}</p>
            </div>
            <div className={config.dateText}>
              <p>{config.dateLabel}</p>
            </div>
          </div>
        </div>
      );
    }

    if (templateType === 'elegant' || templateType === 'playful') {
      return (
        <div className={config.headerContainer}>
          <div className={config.headerIconContainer}>
            <PawPrint size={config.headerIconSize} />
          </div>
          <h1 className={config.titleText}>{t.doc.title}</h1>
          <p className={config.subtitleText}>{t.doc.subtitle}</p>
          <p className={config.dateText}>{config.dateLabel}</p>
        </div>
      );
    }

    if (templateType === 'swiss') {
      return (
        <div className={config.headerContainer}>
          <div className={config.headerFlex}>
            <div className={config.headerIconBg}>
              <PawPrint size={config.headerIconSize} />
            </div>
            <div>
              <h1 className={config.titleText}>{t.doc.title}</h1>
              <p className={config.subtitleText}>{t.doc.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={config.dateText}>{config.dateLabel}</p>
            <p className="text-xs text-red-600 font-bold mt-1">{config.dateBadge}</p>
          </div>
        </div>
      );
    }

    // Default header (classic, modern, colorful, professional, compact)
    return (
      <div className={config.headerContainer}>
        <div className={config.headerFlex}>
          <div className={config.headerIconContainer}>
            <div className={config.headerIconBg}>
              <PawPrint size={config.headerIconSize} />
            </div>
            <div>
              <h1 className={config.titleText}>{t.doc.title}</h1>
              <p className={config.subtitleText}>{t.doc.subtitle}</p>
            </div>
          </div>
          <div className={config.dateText}>
            <p>{config.dateLabel}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!config.footerContainer) return null;

    if (config.footerSignContainer) {
      // Classic style with signature
      return (
        <div className={config.footerContainer}>
          <div className={config.footerText}>
            <p className="font-bold">{t.doc.footer}</p>
          </div>
          <div className={config.footerSignContainer}>
            <p className={config.footerSignText}>{t.doc.sign}</p>
          </div>
        </div>
      );
    }

    // Simple centered footer
    return (
      <div className={config.footerContainer}>
        <p className={config.footerText}>{t.doc.footer}</p>
      </div>
    );
  };

  // Render main content layout
  const renderContent = () => {
    // Minimal template has unique single-column layout
    if (templateType === 'minimal') {
      return (
        <div className={config.mainLayout}>
          <div className="flex gap-8 mb-6">
            <div className="w-48">
              <PetPhoto photo={data.photo} petType={data.petType} t={t} variant={templateType} />
            </div>
            <div className="flex-1 space-y-6">
              <OwnerInfo data={data} t={t} variant={templateType} />
              <PetDetails data={data} t={t} variant={templateType} />
            </div>
          </div>
          <DescriptionSection text={data.generatedText} t={t} variant={templateType} />
          <BehaviorSection data={data} t={t} variant={templateType} />
          <LegalSection data={data} t={t} variant={templateType} />
          <ReferenceSection data={data} t={t} variant={templateType} />
        </div>
      );
    }

    // Colorful template has 2-column grid
    if (templateType === 'colorful') {
      return (
        <div className={config.mainLayout}>
          <div className={config.mainWidth}>
            <PetPhoto photo={data.photo} petType={data.petType} t={t} variant={templateType} />
            <OwnerInfo data={data} t={t} variant={templateType} />
            <BehaviorSection data={data} t={t} variant={templateType} />
          </div>
          <div className={config.mainSpace}>
            <PetDetails data={data} t={t} variant={templateType} />
            <DescriptionSection text={data.generatedText} t={t} variant={templateType} />
            <LegalSection data={data} t={t} variant={templateType} />
            <ReferenceSection data={data} t={t} variant={templateType} />
          </div>
        </div>
      );
    }

    // Standard two-column layout (classic, modern, elegant, professional, playful, swiss, compact)
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

  // Watermark component
  const Watermark = () => (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04] select-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute whitespace-nowrap font-bold text-slate-900"
        style={{
          fontSize: '80px',
          transform: 'rotate(-45deg)',
          top: '50%',
          left: '50%',
          marginLeft: '-400px',
          marginTop: '-100px',
          letterSpacing: '8px',
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
