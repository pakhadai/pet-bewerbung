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
        container: 'w-[210mm] h-[297mm] bg-white text-slate-900 p-[20mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-10',
        headerFlex: 'flex items-center justify-between mb-8',
        headerIconContainer: 'flex items-center gap-3',
        headerIconBg: 'bg-slate-900 text-white p-2 rounded',
        headerIconSize: 20,
        titleText: 'text-2xl font-black uppercase tracking-wide',
        subtitleText: 'text-xs uppercase tracking-widest text-slate-500 mt-1',
        dateText: 'text-xs text-slate-400 text-right',
        dateLabel: t.doc.date,
        mainLayout: 'flex gap-10 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-6',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-6',
        footerContainer: 'mt-auto pt-6 border-t-2 border-slate-900 flex justify-between items-end',
        footerText: 'text-[10px] text-slate-400 uppercase tracking-wider',
        footerSignContainer: 'w-64 border-t-2 border-slate-900 pt-2',
        footerSignText: 'text-[10px] uppercase font-black tracking-wider',
        badge: null // No badge for classic
      },

      modern: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-white via-rose-50 to-pink-50 text-slate-900 p-[16mm] text-sm leading-relaxed font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-8',
        headerFlex: 'bg-gradient-to-r from-rose-400 to-pink-400 -mx-[16mm] -mt-[16mm] px-[16mm] pt-[16mm] pb-6 mb-8 text-white flex items-center justify-between',
        headerIconContainer: 'flex items-center gap-4',
        headerIconBg: 'bg-white text-rose-500 p-3 rounded-full shadow-lg',
        headerIconSize: 24,
        titleText: 'text-3xl font-black',
        subtitleText: 'text-sm font-medium opacity-90 mt-1',
        dateText: 'text-sm text-right opacity-90',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-5',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-5',
        footerContainer: 'mt-auto pt-4 border-t border-rose-200 text-center',
        footerText: 'text-xs text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      elegant: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-slate-800 p-[18mm] text-sm font-serif relative box-border flex flex-col shadow-none mx-auto border-8 border-amber-400',
        headerContainer: 'mb-8 text-center border-b-4 border-amber-400 pb-6',
        headerFlex: null,
        headerIconContainer: 'inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-3 rounded-full mb-4',
        headerIconBg: null,
        headerIconSize: 28,
        titleText: 'text-5xl font-bold text-amber-700 mb-2',
        subtitleText: 'text-sm text-amber-600 uppercase tracking-widest',
        dateText: 'text-xs text-amber-600 mt-2',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-5',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-5',
        footerContainer: 'mt-auto pt-4 border-t-2 border-amber-400 text-center',
        footerText: 'text-xs text-amber-600',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      minimal: {
        container: 'w-[210mm] h-[297mm] bg-white text-black p-[24mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-12',
        headerFlex: 'flex items-start justify-between',
        headerIconContainer: null,
        headerIconBg: null,
        headerIconSize: 32,
        titleText: 'text-6xl font-light tracking-tight mb-2',
        subtitleText: 'text-sm uppercase tracking-widest text-gray-400',
        dateText: 'text-xs text-right text-gray-400',
        dateLabel: today,
        mainLayout: 'space-y-8 flex-1',
        sidebarWidth: null,
        sidebarSpace: null,
        mainWidth: 'w-full',
        mainSpace: 'space-y-6',
        footerContainer: 'mt-auto pt-6 border-t border-gray-200 text-center',
        footerText: 'text-xs text-gray-400',
        footerSignContainer: null,
        footerSignText: null,
        badge: 'mb-6' // Special: PawPrint before title
      },

      colorful: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-slate-800 p-[16mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-6 bg-white rounded-3xl p-6 shadow-xl',
        headerFlex: 'flex items-center justify-between',
        headerIconContainer: 'flex items-center gap-4',
        headerIconBg: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-2xl shadow-lg',
        headerIconSize: 28,
        titleText: 'text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
        subtitleText: 'text-sm text-purple-500 font-bold mt-1',
        dateText: 'text-sm text-slate-500',
        dateLabel: today,
        mainLayout: 'grid grid-cols-2 gap-6 flex-1',
        sidebarWidth: null,
        sidebarSpace: null,
        mainWidth: 'space-y-6',
        mainSpace: 'space-y-6',
        footerContainer: 'mt-auto pt-4 text-center',
        footerText: 'text-xs text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      professional: {
        container: 'w-[210mm] h-[297mm] bg-slate-900 text-white p-[20mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-8 pb-6 border-b border-slate-700',
        headerFlex: 'flex items-center justify-between',
        headerIconContainer: 'flex items-center gap-4',
        headerIconBg: 'bg-blue-500 p-3 rounded-lg',
        headerIconSize: 28,
        titleText: 'text-2xl font-bold',
        subtitleText: 'text-sm text-slate-400 mt-1',
        dateText: 'text-sm text-slate-400',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1',
        sidebarWidth: 'w-[38%]',
        sidebarSpace: 'space-y-5',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-5',
        footerContainer: 'mt-auto pt-4 border-t border-slate-700 text-center',
        footerText: 'text-xs text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      playful: {
        container: 'w-[210mm] h-[297mm] bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 text-slate-800 p-[16mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-6 text-center',
        headerFlex: null,
        headerIconContainer: 'inline-block bg-gradient-to-r from-orange-400 to-red-400 text-white p-4 rounded-full mb-4 shadow-lg',
        headerIconBg: null,
        headerIconSize: 32,
        titleText: 'text-4xl font-black text-orange-600 mb-2',
        subtitleText: 'text-sm text-orange-500 font-bold uppercase tracking-wide',
        dateText: 'text-xs text-slate-500 mt-2',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-5',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-5',
        footerContainer: 'mt-auto pt-4 text-center',
        footerText: 'text-xs text-slate-500',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      swiss: {
        container: 'w-[210mm] h-[297mm] bg-white text-slate-900 p-[20mm] text-sm font-sans relative box-border flex flex-col shadow-none mx-auto border-t-8 border-red-600',
        headerContainer: 'mb-8 flex items-center justify-between border-b-2 border-red-600 pb-6',
        headerFlex: 'flex items-center gap-4',
        headerIconContainer: null,
        headerIconBg: 'bg-red-600 text-white p-3',
        headerIconSize: 28,
        titleText: 'text-3xl font-bold text-slate-900',
        subtitleText: 'text-sm text-red-600 font-semibold',
        dateText: 'text-xs text-slate-500',
        dateLabel: today,
        dateBadge: '🇨🇭 ' + t.ui.swissStandard.toUpperCase(),
        mainLayout: 'flex gap-6 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-5',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-5',
        footerContainer: 'mt-auto pt-4 border-t-2 border-red-600 text-center',
        footerText: 'text-xs text-slate-600',
        footerSignContainer: null,
        footerSignText: null,
        badge: null
      },

      compact: {
        container: 'w-[210mm] h-[297mm] bg-white text-slate-900 p-[12mm] text-xs font-sans relative box-border flex flex-col shadow-none mx-auto',
        headerContainer: 'mb-6',
        headerFlex: 'flex items-center justify-between mb-4 border-b border-slate-300 pb-3',
        headerIconContainer: 'flex items-center gap-2',
        headerIconBg: 'bg-slate-900 text-white p-1.5',
        headerIconSize: 16,
        titleText: 'text-lg font-bold',
        subtitleText: 'text-[10px] text-slate-500 uppercase tracking-wider',
        dateText: 'text-[10px] text-slate-400',
        dateLabel: today,
        mainLayout: 'flex gap-6 flex-1',
        sidebarWidth: 'w-[35%]',
        sidebarSpace: 'space-y-4',
        mainWidth: 'flex-1',
        mainSpace: 'space-y-4',
        footerContainer: 'mt-auto pt-3 border-t border-slate-300 text-center',
        footerText: 'text-[9px] text-slate-400',
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

  return (
    <div className={config.container}>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </div>
  );
};

export default SwissDocument;
