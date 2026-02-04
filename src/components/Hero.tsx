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
        {t?.hero?.badge || 'Free Start & No Signup'}
      </div>

      {/* Main Title */}
      <h2 className={`text-6xl sm:text-7xl lg:text-9xl font-bold font-display leading-none mt-2 transition-colors
         ${darkMode ? 'text-white' : 'text-text-main'}`}>
        {t?.hero?.title || 'Pet CV Creator'}
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

      {/* Free vs Premium Comparison */}
      <div className={`mt-8 max-w-2xl w-full border-2 border-dashed hand-drawn-border overflow-hidden
        ${darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-white/80'}`}>
        <h3 className={`font-display font-bold text-xl text-center py-3 ${darkMode ? 'text-white bg-gray-700/50' : 'text-gray-800 bg-gray-100'}`}>
          {t?.hero?.transparencyTitle || 'Kostenlos vs Premium'}
        </h3>
        <div className="grid grid-cols-2 gap-0">
          {/* Free Column */}
          <div className={`p-4 ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className={`material-symbols-outlined text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`}>check_circle</span>
              <span className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t?.hero?.freeTitle || 'Kostenlos'}
              </span>
            </div>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {(t?.hero?.freeFeatures || ['Classic-Vorlage', 'Manuelle Eingabe', 'PDF-Download']).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-base">check</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* Premium Column */}
          <div className={`p-4 border-l-2 ${darkMode ? 'border-purple-500/50 bg-purple-900/20' : 'border-purple-200 bg-purple-50/50'}`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="material-symbols-outlined text-2xl text-purple-500">workspace_premium</span>
              <span className={`font-display font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t?.hero?.premiumTitle || 'Premium (2h)'}
              </span>
            </div>
            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {(t?.hero?.premiumFeatures || ['Alle 4 Profi-Vorlagen', 'Unbegrenzte KI', 'Charakter-Konstruktor', 'ZIP mit allen Designs']).map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500 text-base">star</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className={`mt-3 text-center py-1 px-2 rounded-full text-xs font-bold ${darkMode ? 'bg-purple-600/50 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              10 CHF
            </div>
          </div>
        </div>
        <p className={`text-xs text-center py-2 ${darkMode ? 'text-gray-400 bg-gray-700/30' : 'text-gray-500 bg-gray-100/50'}`}>
          {t?.hero?.transparencyText || 'Keine Daten werden gespeichert. Premium-Zugang gilt für 2 Stunden.'}
        </p>
      </div>

      {/* Trust Badges */}
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
          <span className="material-symbols-outlined text-sm">verified</span>
          {t?.hero?.transparencyBadge3 || 'Premium: 10 CHF'}
        </div>
      </div>
    </div>
  );
};

export default Hero;
