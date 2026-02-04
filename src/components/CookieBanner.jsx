import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export const COOKIE_CONSENT_KEY = 'pet-cv-cookie-consent';

// Helper to check if cookies are accepted
export const isCookieConsentGiven = () => {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
};

const CookieBanner = ({ t, onOpenPrivacy, onConsentChange, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Force show if requested (e.g., when trying to pay with cookies declined)
    if (forceShow) {
      setIsVisible(true);
      return;
    }
    
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    onConsentChange?.('accepted');
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
    onConsentChange?.('declined');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 print:hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="theme-card rounded-2xl shadow-2xl border theme-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0 hidden sm:block">
              <div className="w-12 h-12 rounded-full theme-bg flex items-center justify-center">
                <Cookie className="w-6 h-6 theme-text-muted" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold theme-text mb-1 flex items-center gap-2">
                <Cookie className="w-5 h-5 sm:hidden" />
                {t.legal?.cookieBannerTitle || 'Cookie Notice'}
              </h3>
              <p className="text-sm theme-text-muted">
                {t.legal?.cookieBannerText ||
                  'We use only essential cookies to save your language and theme preferences. For donations, Stripe may set additional cookies.'}
                {' '}
                <button
                  onClick={onOpenPrivacy}
                  className="underline hover:no-underline"
                >
                  {t.legal?.learnMore || 'Learn more'}
                </button>
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg theme-bg hover:opacity-80 transition-all theme-text-muted"
              >
                {t.legal?.decline || 'Decline'}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg theme-button-primary transition-all hover:scale-105"
              >
                {t.legal?.accept || 'Accept'}
              </button>
            </div>

            <button
              onClick={handleDecline}
              className="absolute top-2 right-2 sm:hidden p-1 rounded-full theme-bg hover:opacity-80"
              aria-label="Close"
            >
              <X size={16} className="theme-text-muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
