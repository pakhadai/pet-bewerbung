import React from 'react';

interface StepsProps {
  darkMode: boolean;
  t: any;
}

interface StepCardProps {
  number: string;
  title: string;
  subtitle: string;
  iconPrimary: string;
  iconSecondary?: string;
  bgColorClass: string;
  darkModeBgClass: string;
  rotation: string;
  hoverRotation: string;
  badge?: {
    text: string;
    icon: string;
  };
  darkMode: boolean;
  animDelay?: string; // e.g. '0.1s'
}

const StepCard: React.FC<StepCardProps> = ({ 
  number, title, subtitle, iconPrimary, iconSecondary, 
  bgColorClass, darkModeBgClass, rotation, hoverRotation, badge, darkMode,
  animDelay = ''
}) => {
  return (
    <div 
      className="flex flex-col items-center gap-4 group cursor-default animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      style={animDelay ? { animationDelay: animDelay } : undefined}
    >
      <div className={`relative flex h-28 w-28 items-center justify-center hand-drawn-border border-2 border-text-main shadow-sm transition-transform duration-300 hover:scale-105
        ${darkMode ? darkModeBgClass : bgColorClass}
        ${rotation}
      `}
        style={{ transition: 'transform 0.3s ease' }}
      >
        {/* Number Badge */}
        <div className={`absolute -top-4 -right-2 flex h-8 w-8 items-center justify-center rounded-full font-display text-xl border-2 border-white
            ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-text-main text-white'}`}>
          {number}
        </div>

        {/* Icons */}
        <div className="flex items-center justify-center gap-0 relative">
          <span className="material-symbols-outlined text-4xl text-text-main sketch-icon -mr-1">{iconPrimary}</span>
          {iconSecondary && (
             <span className={`material-symbols-outlined text-3xl text-text-main sketch-icon ${iconSecondary === 'pets' ? 'translate-y-2' : '-translate-y-1'}`}>
               {iconSecondary}
             </span>
          )}
        </div>

        {/* Optional Badge (e.g. Local) */}
        {badge && (
          <div className={`absolute -bottom-3 px-2 py-0.5 text-[10px] font-bold border border-text-main rounded-full shadow-sm flex items-center gap-1
             ${darkMode ? 'bg-gray-800 text-green-400' : 'bg-white text-green-700'}`}>
             <span className="material-symbols-outlined text-[12px]">{badge.icon}</span> 
             {badge.text}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className={`text-2xl font-bold font-display ${darkMode ? 'text-gray-100' : 'text-text-main'}`}>
          {title}
        </h3>
        <p className={`text-base font-medium ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

const Steps: React.FC<StepsProps> = ({ darkMode, t }) => {
  return (
    <div className="w-full mt-8 relative">
      {/* Decorative Dashed Line - Hidden on mobile, visible on lg */}
      <svg className="hidden lg:block absolute top-28 left-0 w-full h-16 -z-10 opacity-20 pointer-events-none" fill="none" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path d="M50,50 C300,20 900,80 1150,50" stroke={darkMode ? "#ffffff" : "#4a4a4a"} strokeDasharray="12 12" strokeLinecap="round" strokeWidth="3"></path>
      </svg>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 [--stagger:0.12s]">
        <StepCard 
          number="1"
          title={t?.stepsNew?.step1?.title || "Enter Data"}
          subtitle={t?.stepsNew?.step1?.subtitle || "Owner & Pet"}
          iconPrimary="edit_note"
          iconSecondary="pets"
          bgColorClass="bg-mint"
          darkModeBgClass="bg-mint/80"
          rotation="rotate-[-2deg]"
          hoverRotation="rotate-1"
          darkMode={darkMode}
          animDelay="0.05s"
        />
        <StepCard 
          number="2"
          title={t?.stepsNew?.step2?.title || "Description"}
          subtitle={t?.stepsNew?.step2?.subtitle || "Character & AI"}
          iconPrimary="psychology"
          iconSecondary="auto_awesome"
          bgColorClass="bg-peach"
          darkModeBgClass="bg-peach/80"
          rotation="rotate-[3deg]"
          hoverRotation="rotate-0"
          badge={{
            text: t?.stepsNew?.step3?.badge || "AI",
            icon: 'smart_toy'
          }}
          darkMode={darkMode}
          animDelay="0.15s"
        />
        <StepCard 
          number="3"
          title={t?.stepsNew?.step3?.title || "Photo & Design"}
          subtitle={t?.stepsNew?.step3?.subtitle || "Upload & Template"}
          iconPrimary="photo_camera"
          iconSecondary="palette"
          bgColorClass="bg-lavender"
          darkModeBgClass="bg-lavender/80"
          rotation="rotate-[-1deg]"
          hoverRotation="rotate-2"
          darkMode={darkMode}
          animDelay="0.25s"
        />
        <StepCard 
          number="4"
          title={t?.stepsNew?.step4?.title || "Editor & Export"}
          subtitle={t?.stepsNew?.step4?.subtitle || "Customize & PDF"}
          iconPrimary="tune"
          iconSecondary="picture_as_pdf"
          bgColorClass="bg-accent-pink"
          darkModeBgClass="bg-accent-pink/80"
          rotation="rotate-[2deg]"
          hoverRotation="rotate-[-1deg]"
          badge={{
            text: t?.stepsNew?.step4?.badge || "Foto",
            icon: 'photo_camera'
          }}
          darkMode={darkMode}
          animDelay="0.35s"
        />
      </div>
    </div>
  );
};

export default Steps;
