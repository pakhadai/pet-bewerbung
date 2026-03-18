import React from 'react';

interface FooterProps {
  darkMode: boolean;
  t: any;
  onOpenLegal?: (page: string) => void;
  onFaqClick?: () => void;
}

const linkClass = "hover:text-primary hover:underline decoration-wavy decoration-primary transition-colors cursor-pointer";

const Footer: React.FC<FooterProps> = ({ darkMode, t, onOpenLegal, onFaqClick }) => {
  return (
    <footer className={`pt-5 pb-0 w-full text-center border-t border-dashed transition-colors
      ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>
      
      <p className={`text-base font-display tracking-wide ${darkMode ? 'text-gray-400' : 'text-text-secondary'}`}>
        {t?.footer?.copyright ? (
          t.footer.copyright
        ) : (
          <>
            © 2026 pet-bewerbung.ch. Made with{' '}
            <span className="material-symbols-outlined align-middle text-[18px] inline mx-0.5 text-red-400 sketch-icon-filled">favorite</span>{' '}
            for pets everywhere.
          </>
        )}
      </p>

      <div className={`flex flex-wrap justify-center items-center gap-x-6 gap-y-1 mt-2 font-display text-sm font-semibold tracking-wide ${darkMode ? 'text-gray-500' : 'text-text-secondary'}`}>
        <a className={linkClass} href="#" onClick={(e) => { e.preventDefault(); onOpenLegal?.('impressum'); }}>
          {t?.footer?.impressum || 'Impressum'}
        </a>
        <span className="opacity-30" aria-hidden>|</span>
        <a className={linkClass} href="#" onClick={(e) => { e.preventDefault(); onOpenLegal?.('privacy'); }}>
          {t?.footer?.privacy || 'Privacy Policy'}
        </a>
        <span className="opacity-30" aria-hidden>|</span>
        <a className={linkClass} href="#" onClick={(e) => { e.preventDefault(); onOpenLegal?.('terms'); }}>
          {t?.footer?.terms ?? t?.legal?.terms ?? 'AGB'}
        </a>
        <span className="opacity-30" aria-hidden>|</span>
        <button
          type="button"
          className={`bg-transparent border-none p-0 text-inherit font-sans text-sm font-semibold cursor-pointer ${linkClass}`}
          onClick={(e) => { e.preventDefault(); onFaqClick?.(); }}
        >
          {t?.footer?.faq ?? 'FAQ'}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
