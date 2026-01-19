import React, { useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';
import GlobalStyles from '../GlobalStyles';
import Header from '../Header';
import Footer from '../Footer';
import DonateModal from '../DonateModal';
import PaymentModal from '../PaymentModal';
import LegalPages from '../LegalPages';

const Step9ThankYou = React.memo(({
  data,
  t,
  theme,
  onThemeChange,
  onLangChange,
  onLogoClick,
  donationAmount,
  setDonationAmount,
  donateOpen,
  setDonateOpen,
  paymentOpen,
  setPaymentOpen,
  onDonate,
  showToast,
  toast,
  onPaymentSuccess
}) => {
  const [legalPage, setLegalPage] = useState(null);
  return (
    <div className="min-h-screen theme-bg font-sans theme-text pb-6 print:bg-white print:p-0">
      <GlobalStyles theme={theme} />
      <Header
        step={9}
        theme={theme}
        onThemeChange={onThemeChange}
        lang={data.lang}
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
          {t.thankYou.title}
        </h2>
        <p className="text-lg theme-text-muted mb-12 animate-in fade-in duration-500 delay-500">
          {t.thankYou.msg}
        </p>

        <div className="theme-bg-secondary rounded-2xl p-8 theme-border border mb-12 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-700">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2 theme-text">
            <Heart className="theme-error fill-current animate-pulse" size={20} />
            {t.monetization.title}
          </h3>
          <p className="theme-text-muted mb-8 max-w-md mx-auto">{t.monetization.desc}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 5, 10, 20].map((amount, index) => (
              <button
                key={amount}
                onClick={() => {
                  if (amount === 0) {
                    showToast(t.ui.freeSuccess, 'success');
                  } else {
                    setDonationAmount(String(amount));
                    // Go directly to in-app payment
                    setPaymentOpen(true);
                  }
                }}
                className={`py-3 px-4 rounded-xl font-semibold transition-all animate-in slide-in-from-bottom-4 duration-500 ${
                  amount === 0
                    ? 'theme-card border theme-border theme-text-muted hover:theme-card-bg-hover hover:scale-105'
                    : 'theme-button-primary shadow-lg hover:scale-110 hover:shadow-xl'
                }`}
                style={{ animationDelay: `${900 + index * 100}ms` }}
              >
                {amount === 0 ? t.monetization.free : `${amount} CHF`}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center theme-text-muted mt-8">
          {t.finalMessage}
        </p>
      </main>

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        amount={donationAmount}
        onDonate={onDonate}
        onOpenPayment={() => {
          setPaymentOpen(true);
          setDonateOpen(false);
        }}
      />
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={donationAmount}
        lang={data.lang}
        t={t}
        onSuccess={(paymentId) => {
          showToast(t?.paymentSuccess?.thankYouMessage || 'Thank you — payment succeeded', 'success');
          onPaymentSuccess && onPaymentSuccess(paymentId);
        }}
        onFailure={(msg) => showToast(`${t?.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
      />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${
          toast.type === 'success'
            ? 'theme-success'
            : toast.type === 'error'
            ? 'theme-error'
            : 'theme-card theme-text'
        }`}>
          {toast.msg}
        </div>
      )}

      <Footer step={9} butterVisible={true} t={t} onOpenLegal={setLegalPage} />
      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  );
});

Step9ThankYou.displayName = 'Step9ThankYou';

export default Step9ThankYou;
