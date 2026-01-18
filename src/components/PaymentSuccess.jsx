import React, { useEffect, useState } from 'react';
import { CheckCircle2, Heart, Home, Sparkles } from 'lucide-react';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Footer from './Footer';
import LegalPages from './LegalPages';
import API_ENDPOINTS from '../config';

const PaymentSuccess = ({
  data,
  t,
  theme,
  onThemeChange,
  onLangChange,
  onLogoClick,
  sessionId
}) => {
  const [legalPage, setLegalPage] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Fetch payment details from server
      fetch(API_ENDPOINTS.checkoutSession(sessionId))
        .then(res => res.json())
        .then(data => {
          if (data.session) {
            setPaymentData(data.session);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching payment data:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const handleGoHome = () => {
    // Navigate to step 0 (landing page)
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.location.href = '/';
    }
  };

  const formatAmount = (amount, currency = 'chf') => {
    if (!amount) return 'N/A';
    const formatted = (amount / 100).toFixed(2);
    const currencyUpper = (currency || 'chf').toUpperCase();
    const currencySymbol = currencyUpper === 'CHF' ? 'CHF' : currencyUpper === 'EUR' ? '€' : currencyUpper;
    return `${formatted} ${currencySymbol}`;
  };

  return (
    <div className="min-h-screen theme-bg font-sans theme-text pb-6 print:bg-white print:p-0">
      <GlobalStyles theme={theme} />
      <Header
        step={null}
        theme={theme}
        onThemeChange={onThemeChange}
        lang={data?.lang || 'de'}
        onLangChange={onLangChange}
        onLogoClick={onLogoClick}
        t={t}
      />

      <main className="w-full max-w-2xl mx-auto py-20 text-center px-4">
        {/* Animated success icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing rings */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'var(--success)' }}
            />
            <div
              className="absolute inset-0 rounded-full animate-pulse opacity-30"
              style={{ background: 'var(--success)' }}
            />

            {/* Main icon */}
            <div className="relative w-24 h-24 theme-success rounded-full flex items-center justify-center shadow-xl animate-in zoom-in duration-500">
              <CheckCircle2
                size={48}
                className="animate-in slide-in-from-top-4 duration-700 delay-200"
              />
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-4 theme-text animate-in slide-in-from-bottom-4 duration-500 delay-300">
          {t?.paymentSuccess?.title || 'Payment Successful!'}
        </h2>
        <p className="text-lg theme-text-muted mb-8 animate-in fade-in duration-500 delay-500">
          {t?.paymentSuccess?.message || 'Thank you for your generous donation!'}
        </p>

        {/* Payment details card */}
        {paymentData && (
          <div className="theme-bg-secondary rounded-2xl p-8 theme-border border mb-8 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-700">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="theme-primary" size={24} />
              <h3 className="text-xl font-bold theme-text">
                {t?.paymentSuccess?.detailsTitle || 'Payment Details'}
              </h3>
            </div>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center py-2 border-b theme-border">
                <span className="theme-text-muted">{t?.paymentSuccess?.amount || 'Amount'}:</span>
                <span className="font-bold theme-text">
                  {formatAmount(paymentData.amountTotal, paymentData.currency)}
                </span>
              </div>
              {paymentData.customerEmail && (
                <div className="flex justify-between items-center py-2 border-b theme-border">
                  <span className="theme-text-muted">{t?.paymentSuccess?.email || 'Email'}:</span>
                  <span className="theme-text">{paymentData.customerEmail}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="theme-text-muted">{t?.paymentSuccess?.status || 'Status'}:</span>
                <span className="px-3 py-1 rounded-full theme-success text-sm font-semibold">
                  {t?.paymentSuccess?.completed || 'Completed'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Thank you message */}
        <div className="theme-bg-secondary rounded-2xl p-8 theme-border border mb-8 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-900">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="theme-error fill-current animate-pulse" size={24} />
            <h3 className="text-xl font-bold theme-text">
              {t?.paymentSuccess?.thankYouTitle || 'Thank You!'}
            </h3>
          </div>
          <p className="theme-text-muted mb-6 max-w-md mx-auto">
            {t?.paymentSuccess?.thankYouMessage || 
              'Your support helps us maintain and improve this service. We truly appreciate your generosity!'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in slide-in-from-bottom-4 duration-500 delay-1100">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold theme-button-primary shadow-lg hover:scale-110 hover:shadow-xl transition-all"
          >
            <Home size={20} />
            {t?.paymentSuccess?.goHome || 'Back to Home'}
          </button>
        </div>
      </main>

      <Footer step={null} butterVisible={true} t={t} onOpenLegal={setLegalPage} />
      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  );
};

export default PaymentSuccess;
