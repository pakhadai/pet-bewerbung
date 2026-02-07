import React from 'react';

interface HeroProps {
  darkMode: boolean;
  t: any;
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ darkMode, t, onStartClick }) => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-5xl">
      
      {/* Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1 text-sm font-bold font-display uppercase tracking-widest hand-drawn-border border-2 border-text-main rotate-1 select-none
        ${darkMode ? 'bg-gray-800 text-primary-300' : 'bg-mint/50 text-primary-dark'}`}>
        <span className="size-2 rounded-full bg-primary-dark animate-pulse"></span>
        {t?.hero?.badge || 'Free Start & No Signup'}
      </div>

      {/* Main Title */}
      <h2 className={`text-5xl sm:text-6xl lg:text-8xl font-bold font-display leading-none mt-1 transition-colors
         ${darkMode ? 'text-white' : 'text-text-main'}`}>
        {t?.hero?.title || 'Pet CV Creator'}
      </h2>

      {/* Value Proposition: Problem & Solution */}
      <div className={`w-full max-w-4xl my-4 p-8 rounded-2xl border-l-4 shadow-lg text-left transition-colors
        ${darkMode ? 'bg-gray-800/60 border-primary border-r-0 border-y-0' : 'bg-white/80 border-primary border-r-0 border-y-0'}`}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left: Problem */}
          <div className="flex-1">
            <h3 className={`font-display font-bold text-xl mb-3 flex items-center gap-2 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
              <span className="material-symbols-outlined text-2xl">home_app_logo</span>
              {t?.hero?.problemTitle || "Wohnungssuche mit Haustier?"}
            </h3>
            <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t?.hero?.problemDesc || "In der Schweiz ist der Wohnungsmarkt hart umkämpft. Viele Vermieter sind skeptisch gegenüber Haustieren."}
            </p>
          </div>
          {/* Divider (desktop only) */}
          <div className={`hidden md:block w-px h-24 self-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          {/* Right: Solution */}
          <div className="flex-1">
            <h3 className={`font-display font-bold text-xl mb-3 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <span className="material-symbols-outlined text-2xl">verified</span>
              {t?.hero?.solutionTitle || "Die Lösung: Das Pet-Dossier"}
            </h3>
            <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t?.hero?.solutionDesc || "Ein professioneller Lebenslauf belegt Versicherung & Erziehung. Erhöhen Sie Ihre Chancen auf die Traumwohnung massiv."}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button - Large with smooth animation */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6 justify-center">
        <button 
          onClick={onStartClick}
          className={`group relative px-14 py-5 text-3xl sm:text-4xl font-bold font-display hand-drawn-button border-3 border-text-main 
            transition-all duration-500 ease-out
            hover:-translate-y-2 hover:shadow-2xl hover:scale-105
            active:translate-y-0 active:scale-100
           ${darkMode 
              ? 'bg-primary-dark text-white hover:bg-primary hover:text-gray-900 shadow-lg shadow-primary/20' 
              : 'bg-lavender text-text-main hover:bg-primary shadow-lg shadow-primary/30'}`}>
          <span className="relative flex items-center justify-center gap-4">
            {t?.hero?.cta || 'Start Securely'}
            <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500">lock</span>
          </span>
          {/* Shadow element */}
          <div className={`absolute -bottom-1.5 -right-1.5 w-full h-full -z-10 rounded-xl border-2 border-transparent transition-all duration-500 group-hover:-bottom-2 group-hover:-right-2 ${darkMode ? 'bg-white/10' : 'bg-primary/20'}`}></div>
        </button>
      </div>

      {/* Free vs Premium Comparison - Enhanced */}
      <div className={`mt-8 max-w-3xl w-full rounded-2xl overflow-hidden shadow-lg
        ${darkMode ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <h3 className={`font-display font-bold text-xl text-center py-4 ${darkMode ? 'text-white bg-gradient-to-r from-gray-700 to-gray-800' : 'text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
          {t?.hero?.transparencyTitle || 'Kostenlos vs Premium'}
        </h3>
        <div className="grid grid-cols-2 gap-0">
          {/* Free Column */}
          <div className={`p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <span className={`material-symbols-outlined text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`}>check_circle</span>
              </div>
              <span className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t?.hero?.freeTitle || 'Kostenlos'}
              </span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>0 CHF</span>
            </div>
            <ul className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {(t?.hero?.freeFeatures || ['Classic-Vorlage', 'Manuelle Eingabe', 'PDF-Download']).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-base ${darkMode ? 'text-green-400' : 'text-green-500'}`}>check</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* Premium Column */}
          <div className={`p-6 relative ${darkMode ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/20' : 'bg-gradient-to-br from-purple-50 to-purple-100/50'}`}>
            {/* Popular badge */}
            <div className="absolute -top-0 right-4">
              <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-b-lg ${darkMode ? 'bg-purple-500 text-white' : 'bg-purple-600 text-white'}`}>
                {t?.hero?.popularBadge || 'Beliebt'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-purple-500/30' : 'bg-purple-200'}`}>
                <span className="material-symbols-outlined text-2xl text-purple-500">workspace_premium</span>
              </div>
              <span className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t?.hero?.premiumTitle || 'Premium (2h)'}
              </span>
              <span className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>10 CHF</span>
            </div>
            <ul className={`space-y-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {(t?.hero?.premiumFeatures || ['8 Profi-Vorlagen', 'Visual Editor', 'KI-Texte unbegrenzt', 'ZIP mit allen Designs']).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-base text-purple-500">star</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs font-bold uppercase tracking-widest opacity-70">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">lock</span>
          {t?.hero?.transparencyBadge1 || 'Lokale Daten'}
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">block</span>
          {t?.hero?.transparencyBadge2 || 'Keine Werbung'}
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">verified</span>
          {t?.hero?.transparencyBadge3 || 'Premium: 10 CHF'}
        </div>
      </div>
    </div>
  );
};

export default Hero;
