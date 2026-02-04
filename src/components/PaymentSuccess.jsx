import React, { useState, useEffect } from 'react';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Footer from './Footer';
import LegalPages from './LegalPages';
import API_ENDPOINTS from '../config';

const PRIMARY = '#b39ddb';

// Real photo from project (polaroid frame)
const POLAROID_IMAGE_SRC = '/og-image.jpg.jpg';

const PaymentSuccess = ({
  data,
  t,
  theme,
  onThemeChange,
  onLangChange,
  onLogoClick,
  sessionId,
  showToast = () => {},
  onDownloadPDF,
  onFaqClick
}) => {
  const [legalPage, setLegalPage] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const darkMode = theme === 'dark';

  useEffect(() => {
    if (!sessionId) return;
    let mounted = true;
    fetch(API_ENDPOINTS.checkoutSession(sessionId))
      .then(res => res.ok ? res.json() : Promise.reject(new Error(res.status)))
      .then(json => {
        if (!mounted) return;
        if (json.session) setPaymentData(json.session);
      })
      .catch(() => { /* ignore */ });
    return () => { mounted = false; };
  }, [sessionId]);

  const handleGoHome = () => {
    if (onLogoClick) onLogoClick();
    else window.location.href = '/';
  };

  const formatAmount = (amount, currency = 'chf') => {
    if (amount == null || amount === '') return '';
    const value = typeof amount === 'number' ? amount : parseInt(amount, 10);
    if (Number.isNaN(value)) return '';
    const formatted = (value / 100).toFixed(2);
    const cur = (currency || 'chf').toString().toUpperCase();
    return `${formatted} ${cur === 'CHF' ? 'CHF' : cur === 'EUR' ? '€' : cur}`;
  };

  const formattedAmount = paymentData && paymentData.amountTotal != null
    ? formatAmount(paymentData.amountTotal, paymentData.currency)
    : '';

  return (
    <div className="min-h-screen font-sans antialiased flex flex-col overflow-x-hidden selection:bg-primary/30 theme-bg theme-text print:bg-white">
      <GlobalStyles theme={theme} />
      <style>{`
        .payment-success-polaroid {
          background: white;
          padding: 1rem 1rem 4rem 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transform: rotate(-2deg);
          border-radius: 2px;
        }
        .payment-success-polaroid::after {
          content: attr(data-caption);
          position: absolute;
          bottom: 1rem;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Amatic SC', cursive;
          font-size: 2.5rem;
          font-weight: bold;
          color: #2d2d2d;
        }
        .payment-success-heart-pulse {
          animation: payment-success-heart-pulse 1.4s ease-in-out infinite;
        }
        @keyframes payment-success-heart-pulse {
          0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 4px rgba(179, 157, 219, 0.4)); }
          50% { transform: scale(1.25); opacity: 0.95; filter: drop-shadow(0 0 12px rgba(179, 157, 219, 0.8)); }
        }
        .payment-success-card-border {
          border: 2px solid;
          border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
          border-color: var(--border);
        }
        .payment-success-btn {
          border-radius: 20px 5px 20px 5px/5px 20px 5px 20px;
          border: 2px solid var(--border);
        }
      `}</style>

      <Header
        darkMode={darkMode}
        toggleDarkMode={() => onThemeChange?.(darkMode ? 'light' : 'dark')}
        lang={data?.lang || 'en'}
        onLangChange={onLangChange}
        onLogoClick={handleGoHome}
        t={t}
      />

      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <span className="material-symbols-outlined absolute text-4xl top-[15%] left-[10%] rotate-12 opacity-15 text-primary">favorite</span>
        <span className="material-symbols-outlined absolute text-6xl top-[40%] right-[15%] -rotate-12 opacity-15 text-primary">pets</span>
        <span className="material-symbols-outlined absolute text-3xl bottom-[20%] left-[20%] rotate-45 opacity-15 text-primary">favorite</span>
        <span className="material-symbols-outlined absolute text-5xl top-[70%] right-[30%] rotate-6 opacity-15 text-primary">pets</span>
        <span className="material-symbols-outlined absolute text-2xl top-[10%] right-[5%] opacity-15 text-primary">favorite</span>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center relative pt-28 pb-16 px-4 z-10">
        <div className="w-full max-w-3xl flex flex-col lg:flex-row items-center gap-12">
          {/* Polaroid frame with real photo + pulsing heart */}
          <div className="relative group shrink-0">
            <div className="payment-success-polaroid relative" data-caption={t?.paymentSuccess?.thankYouTitle ?? 'Thank You!'}>
              <div className="w-64 h-64 overflow-hidden rounded-sm bg-[var(--bg-secondary)] relative">
                <img
                  alt="Happy pet"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  src={POLAROID_IMAGE_SRC}
                />
              </div>
            </div>
            <div
              className="absolute -top-4 -right-4 size-16 rounded-full flex items-center justify-center payment-success-card-border rotate-12 backdrop-blur-md payment-success-heart-pulse theme-card"
              style={{ backgroundColor: 'rgba(248, 187, 208, 0.2)' }}
              aria-hidden
            >
              <span className="material-symbols-outlined text-3xl text-primary sketch-icon-filled">favorite</span>
            </div>
          </div>

          {/* Text card */}
          <div className="text-center lg:text-left flex-1">
            <div className="payment-success-card-border theme-card p-8 lg:p-10 relative overflow-hidden backdrop-blur-lg">
              <div className="mb-6">
                <h2 className="text-5xl lg:text-6xl font-bold font-display mb-2 leading-tight theme-text">
                  {t?.paymentSuccess?.tailWagTitle ?? "A Huge Tail Wag For You!"}
                </h2>
                {formattedAmount ? (
                  <p className="text-xl font-display italic text-primary theme-text-secondary">
                    {t?.paymentSuccess?.donationMade ?? 'Your donation of'}{' '}
                    <span className="theme-text font-bold">{formattedAmount}</span>{' '}
                    {t?.paymentSuccess?.donationMadeSuffix ?? 'just made a big difference.'}
                  </p>
                ) : (
                  <p className="text-xl font-display italic theme-text-secondary">
                    {t?.paymentSuccess?.message ?? "Thank you for your generous donation!"}
                  </p>
                )}
              </div>
              
              {/* Premium Access Info Box */}
              <div className="mb-6 p-4 rounded-xl border-2 border-dashed theme-border bg-purple-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-2xl text-purple-500">workspace_premium</span>
                  <span className="font-display font-bold text-lg theme-text">
                    {t?.paymentSuccess?.premiumUnlocked ?? 'Premium freigeschaltet!'}
                  </span>
                </div>
                <p className="text-sm theme-text-muted">
                  {t?.paymentSuccess?.premiumAccessInfo ?? 'Sie haben 2 Stunden vollen Zugang zu allen Funktionen: KI-Textgenerierung, alle Vorlagen, Charakter-Konstruktor. Nutzen Sie die Zeit!'}
                </p>
              </div>
              
              <p className="text-lg mb-8 font-sans leading-relaxed theme-text-muted">
                {t?.paymentSuccess?.generosityQuote ?? t?.paymentSuccess?.thankYouMessage ?? "Thank you for supporting PetCV.io. Your generosity helps us provide secure, loving digital identities for pets everywhere. We've sent a receipt to your email."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {onDownloadPDF && (
                  <button
                    type="button"
                    onClick={onDownloadPDF}
                    className="px-8 py-3 text-2xl font-bold font-display theme-button-primary payment-success-btn flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                  >
                    <span className="material-symbols-outlined">download</span>
                    {t?.paymentSuccess?.downloadPdf ?? t?.thankYou?.downloadPdf ?? 'Download PDF'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="px-8 py-3 text-2xl font-bold font-display theme-button-secondary payment-success-btn transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">home</span>
                  {t?.paymentSuccess?.returnHome ?? t?.paymentSuccess?.goHome ?? 'Return Home'}
                </button>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-4 opacity-80 flex-wrap theme-text-muted">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full theme-info-box border">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {t?.paymentSuccess?.paymentConfirmed ?? 'Payment Confirmed'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full theme-info-box border">
                <span className="material-symbols-outlined text-sm text-primary">shield</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {t?.paymentSuccess?.secureTransaction ?? 'Secure Transaction'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer
        darkMode={darkMode}
        t={t}
        onOpenLegal={setLegalPage}
        onFaqClick={onFaqClick ?? (() => showToast(t?.footer?.faqComingSoon ?? 'FAQ — coming soon.', 'info'))}
      />

      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  );
};

export default PaymentSuccess;
