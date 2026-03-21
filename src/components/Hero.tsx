import React from 'react';
import MaterialIcon from './MaterialIcon';

interface HeroProps {
  darkMode: boolean;
  t: any;
  onStartClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ darkMode, t, onStartClick }) => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-5xl">
      
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1 text-sm font-bold font-display uppercase tracking-widest hand-drawn-border border-2 rotate-1 select-none
        ${
          darkMode
            ? 'border-gray-400 bg-gray-900 text-gray-100'
            : 'border-text-main bg-white text-text-main shadow-sm'
        }`}
      >
        <span
          className={`size-2 shrink-0 rounded-full animate-pulse ${darkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`}
          aria-hidden
        />
        {t?.hero?.badge || 'Free Start & No Signup'}
      </div>

      {/* Main title — single h1 per page (SEO) */}
      <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-bold font-display leading-none mt-1 transition-colors
         ${darkMode ? 'text-white' : 'text-text-main'}`}>
        {t?.hero?.title || 'Pet CV Creator'}
      </h1>

      {/* Value Proposition: Problem & Solution */}
      <div className={`w-full max-w-4xl my-4 p-8 rounded-2xl border-l-4 shadow-lg text-left transition-colors
        ${darkMode ? 'bg-gray-800 border-primary border-r-0 border-y-0' : 'bg-white border-primary border-r-0 border-y-0'}`}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left: Problem */}
          <div className="flex-1">
            <h2 className={`font-display font-bold text-xl mb-3 flex items-center gap-2 ${darkMode ? 'text-red-300' : 'text-red-500'}`}>
              <MaterialIcon name="home_app_logo" className="text-2xl" />
              {t?.hero?.problemTitle || "Wohnungssuche mit Haustier?"}
            </h2>
            <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t?.hero?.problemDesc || "In der Schweiz ist der Wohnungsmarkt hart umkämpft. Viele Vermieter sind skeptisch gegenüber Haustieren."}
            </p>
          </div>
          {/* Divider (desktop only) */}
          <div className={`hidden md:block w-px h-24 self-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          {/* Right: Solution */}
          <div className="flex-1">
            <h2 className={`font-display font-bold text-xl mb-3 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <MaterialIcon name="verified" className="text-2xl" />
              {t?.hero?.solutionTitle || "Die Lösung: Das Pet-Dossier"}
            </h2>
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
              ? 'bg-primary-dark text-white hover:bg-primary shadow-lg shadow-primary/20'
              : 'bg-lavender text-text-main hover:bg-primary shadow-lg shadow-primary/30'}`}>
          <span className="relative flex items-center justify-center gap-4">
            {t?.hero?.cta || 'Start Securely'}
            <MaterialIcon name="lock" className="text-3xl group-hover:translate-x-2 group-hover:scale-110 transition-all duration-500" />
          </span>
          {/* Shadow element */}
          <div className={`absolute -bottom-1.5 -right-1.5 w-full h-full -z-10 rounded-xl border-2 border-transparent transition-all duration-500 group-hover:-bottom-2 group-hover:-right-2 ${darkMode ? 'bg-white/10' : 'bg-primary/20'}`}></div>
        </button>
      </div>

      {/* Features - All Free */}
      <div className={`mt-8 max-w-3xl w-full rounded-2xl overflow-hidden shadow-lg
        ${darkMode ? 'bg-gray-800/80 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <h2 className={`font-display font-bold text-xl text-center py-4 ${darkMode ? 'text-white bg-gradient-to-r from-gray-700 to-gray-800' : 'text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100'}`}>
          {t?.hero?.transparencyTitle || 'Alles kostenlos'}
        </h2>
        <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <ul className={`space-y-3 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {(t?.hero?.freeFeatures || ['3 Vorlagen', 'KI-Textgenerierung', 'PDF-Download', 'ZIP mit allen Designs']).map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <MaterialIcon name="check" className={`text-base ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Trust Badges */}
      <div
        className={`flex flex-wrap justify-center gap-4 mt-3 text-xs font-bold uppercase tracking-widest ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        <div className="flex items-center gap-1">
          <MaterialIcon name="lock" className="text-sm" />
          {t?.hero?.transparencyBadge1 || 'Lokale Daten'}
        </div>
        <div className="flex items-center gap-1">
          <MaterialIcon name="block" className="text-sm" />
          {t?.hero?.transparencyBadge2 || 'Keine Werbung'}
        </div>
        <div className="flex items-center gap-1">
          <MaterialIcon name="verified" className="text-sm" />
          {t?.hero?.transparencyBadge3 || '100% kostenlos'}
        </div>
      </div>
    </div>
  );
};

export default Hero;
