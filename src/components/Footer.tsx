import React from 'react';

interface FooterProps {
  darkMode: boolean;
  t: any;
  onOpenLegal?: (page: string) => void;
  onFaqClick?: () => void;
}

const GITHUB_URL = 'https://github.com/pakhadai/pet-bewerbung';

const linkClass = "hover:text-primary hover:underline decoration-wavy decoration-primary transition-colors cursor-pointer";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const Footer: React.FC<FooterProps> = ({ darkMode, t, onOpenLegal, onFaqClick }) => {
  return (
    <footer className={`pt-5 pb-0 w-full text-center border-t border-dashed backdrop-blur-sm transition-colors
      ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-white/50'}`}>
      
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
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 ${linkClass}`}
          aria-label="GitHub"
        >
          <GitHubIcon className="w-5 h-5 shrink-0" />
          <span>{t?.footer?.openSource ?? 'Open source'}</span>
        </a>
        <span className="opacity-30" aria-hidden>|</span>
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
