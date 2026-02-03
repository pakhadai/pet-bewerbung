import React from 'react';

interface HeroProps {
  darkMode: boolean;
  t: any;
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ darkMode, t, onStartClick }) => {
  return (
    <div className="flex flex-col items-center gap-6 max-w-4xl">
      
      {/* Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1 text-sm font-bold font-display uppercase tracking-widest hand-drawn-border border-2 border-text-main rotate-1 select-none
        ${darkMode ? 'bg-gray-800 text-primary-300' : 'bg-mint/50 text-primary-dark'}`}>
        <span className="size-2 rounded-full bg-primary-dark animate-pulse"></span>
        {t?.hero?.badge || '100% Free & No Signup'}
      </div>

      {/* Main Title */}
      <h2 className={`text-6xl sm:text-7xl lg:text-9xl font-bold font-display leading-none mt-2 transition-colors
         ${darkMode ? 'text-white' : 'text-text-main'}`}>
        {t?.hero?.title || 'Free Pet CV Creator'}
      </h2>

      {/* Value Proposition: Problem & Solution */}
      <div className={`w-full max-w-3xl my-2 p-6 rounded-2xl border-l-4 shadow-sm text-left transition-colors
        ${darkMode ? 'bg-gray-800/60 border-primary border-r-0 border-y-0' : 'bg-white/80 border-primary border-r-0 border-y-0'}`}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left: Problem */}
          <div className="flex-1">
            <h3 className={`font-display font-bold text-xl mb-2 flex items-center gap-2 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
              <span className="material-symbols-outlined">home_app_logo</span>
              {t?.hero?.problemTitle || "Wohnungssuche mit Haustier?"}
            </h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t?.hero?.problemDesc || "In der Schweiz ist der Wohnungsmarkt hart umkämpft. Viele Vermieter sind skeptisch gegenüber Haustieren."}
            </p>
          </div>
          {/* Divider (desktop only) */}
          <div className={`hidden md:block w-px h-24 self-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          {/* Right: Solution */}
          <div className="flex-1">
            <h3 className={`font-display font-bold text-xl mb-2 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <span className="material-symbols-outlined">verified</span>
              {t?.hero?.solutionTitle || "Die Lösung: Das Pet-Dossier"}
            </h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t?.hero?.solutionDesc || "Ein professioneller Lebenslauf belegt Versicherung & Erziehung. Erhöhen Sie Ihre Chancen auf die Traumwohnung massiv."}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6 justify-center">
        <button 
          onClick={onStartClick}
          className={`group relative px-10 py-4 text-3xl font-bold font-display hand-drawn-button border-2 border-text-main transition-transform duration-300 ease hover:-translate-y-1 active:translate-y-0
           ${darkMode 
              ? 'bg-primary-dark text-white hover:bg-primary hover:text-gray-900' 
              : 'bg-lavender text-text-main hover:bg-primary'}`}>
          <span className="relative flex items-center justify-center gap-3">
            {t?.hero?.cta || 'Start Securely'}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock</span>
          </span>
          {/* Shadow element */}
          <div className={`absolute -bottom-1 -right-1 w-full h-full -z-10 rounded-xl border-2 border-transparent ${darkMode ? 'bg-white/10' : 'bg-primary/20'}`}></div>
        </button>
      </div>

      {/* Transparency Card – Fair & Sicher */}
      <div className={`mt-8 max-w-2xl w-full p-6 border-2 border-dashed hand-drawn-border text-center relative
        transition-transform duration-500 ease-in-out hover:scale-[1.02]
        ${darkMode ? 'border-green-600/60 bg-green-900/30' : 'border-green-400/60 bg-green-50'}`}>
        <div className={`absolute -top-5 left-1/2 -translate-x-1/2 p-2 rounded-full border-2 
          ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
          <span className="material-symbols-outlined text-red-400 text-2xl sketch-icon-filled">volunteer_activism</span>
        </div>
        <h3 className={`font-display font-bold text-xl mb-2 pt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t?.hero?.transparencyTitle || 'Fair & Sicher'}
        </h3>
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t?.hero?.transparencyText || 'Dieser Service ist werbefrei und speichert keine Daten auf Servern. Nutzen Sie es gratis – unterstützen Sie uns mit einem fairen Beitrag, wenn Ihnen das Ergebnis gefällt.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs font-bold uppercase tracking-widest opacity-70">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            {t?.hero?.transparencyBadge1 || 'Lokale Daten'}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">block</span>
            {t?.hero?.transparencyBadge2 || 'Keine Werbung'}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">payments</span>
            {t?.hero?.transparencyBadge3 || 'Fair bezahlen'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
