import React, { useState } from 'react';
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
  onDownloadPDF,
  onCreateAnother,
  donationAmount,
  setDonationAmount,
  donateOpen,
  setDonateOpen,
  paymentOpen,
  setPaymentOpen,
  onDonate,
  showToast,
  toast,
  onFaqClick,
  onPaymentSuccess
}) => {
  const [legalPage, setLegalPage] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const darkMode = theme === 'dark';

  return (
    <div className="min-h-screen font-sans antialiased pb-6 print:bg-white print:p-0 flex flex-col theme-bg theme-text">
      <GlobalStyles theme={theme} />

      <Header
        darkMode={darkMode}
        toggleDarkMode={() => onThemeChange(darkMode ? 'light' : 'dark')}
        lang={data.lang}
        onLangChange={onLangChange}
        onLogoClick={onLogoClick}
        t={t}
      />

      <main className="flex-grow flex flex-col items-center justify-center relative pt-32 pb-20 px-4">
        {/* Decorative icons – as in HTML */}
        <div className="absolute top-[20%] left-[10%] opacity-20 pointer-events-none hidden lg:block animate-bounce select-none" style={{ animationDuration: '4s' }}>
          <span className="material-symbols-outlined text-7xl rotate-12 text-primary">celebration</span>
        </div>
        <div className="absolute bottom-[20%] right-[10%] opacity-20 pointer-events-none hidden lg:block animate-pulse select-none">
          <span className="material-symbols-outlined text-8xl -rotate-12 text-accent-pink dark:text-pink-400">pets</span>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center text-center z-10 gap-8">
          {/* Success icon + Purr-fect badge – as in HTML */}
          <div className="relative">
            <div className="size-32 sm:size-40 bg-primary/20 blob-accent flex items-center justify-center hand-drawn-border border-primary">
              <span className="material-symbols-outlined text-7xl sm:text-8xl text-primary animate-pulse sketch-icon-filled">check_circle</span>
            </div>
            <span className={`absolute -top-4 -right-4 px-3 py-1 font-display font-bold text-xl rounded-full rotate-12 hand-drawn-border ${darkMode ? 'bg-accent-pink text-[#121212] border-[#121212]' : 'bg-accent-pink text-gray-900 border-gray-200'}`}>
              {t?.thankYou?.purrPerfect ?? 'Purr-fect!'}
            </span>
          </div>

          {/* Title + subtitle – as in HTML */}
          <div className="flex flex-col items-center gap-4">
            <h2 className={`text-6xl sm:text-8xl font-bold font-display leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t?.thankYou?.allSet ?? t?.thankYou?.title ?? "You're All Set!"}
            </h2>
            <p className={`text-xl sm:text-2xl max-w-lg leading-relaxed font-medium italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t?.thankYou?.subtitle ?? t?.thankYou?.msg ?? "Your pet's professional resume has been generated and is ready for the world to see."}
            </p>
          </div>

          {/* DOWNLOAD PDF button – as in HTML */}
          <div className="w-full max-w-md mt-4">
            {onDownloadPDF && (
              <button
                type="button"
                onClick={onDownloadPDF}
                className="group relative w-full px-10 py-6 text-3xl sm:text-4xl font-bold font-display text-[#121212] hand-drawn-button bg-primary hover:bg-primary-dark transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(179,157,219,0.2)]"
              >
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">download_for_offline</span>
                {t?.thankYou?.downloadPdf ?? t?.labels?.download ?? 'DOWNLOAD PDF'}
                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-dashed border-primary/40 -z-10 rounded-xl pointer-events-none" aria-hidden />
              </button>
            )}
            <p className="mt-4 text-sm text-gray-500 font-medium">
              {t?.thankYou?.privacyLocal ?? "Your data was processed locally and is never stored on our servers."}
            </p>
          </div>

          {/* Toggle: Show support block – твоя реалізація з перемикачем */}
          <div className={`w-full max-w-2xl flex flex-wrap items-center justify-center gap-4 py-4 border-t border-b border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <span className={`font-sans text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t?.thankYou?.showSupport ?? 'Show support options'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={showSupport}
              onClick={() => setShowSupport(!showSupport)}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 hand-drawn-border transition-colors ${
                showSupport ? 'bg-primary border-primary' : 'bg-gray-700 border-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow transition translate-y-0.5 ${
                  showSupport ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Support block – показується при увімкненому перемикачі, стиль як у HTML */}
          {showSupport && (
            <div className={`w-full max-w-2xl mt-4 p-8 hand-drawn-border border-2 border-dashed relative overflow-hidden group animate-in fade-in slide-in-from-top-2 duration-300 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-100'}`}>
              <div className="absolute -top-10 -right-10 size-40 bg-red-400/5 blob-accent group-hover:scale-110 transition-transform duration-700 pointer-events-none" aria-hidden />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center size-16 bg-red-400/10 rounded-full border-2 border-red-400/30">
                  <span className="material-symbols-outlined text-4xl text-red-400 sketch-icon-filled">volunteer_activism</span>
                </div>
                <h3 className={`text-4xl font-bold font-display ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t?.thankYou?.supportTitle ?? t?.monetization?.title ?? 'Support the Project'}
                </h3>
                <p className={`text-lg max-w-md ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t?.thankYou?.supportDesc ?? t?.monetization?.desc ?? (
                    <>PetCV.io offers a <span className="text-primary font-bold">free Classic template</span>. Premium unlocks all designs and AI features. Your support helps us improve!</>
                  )}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {[0, 5, 10, 20].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        if (amount === 0) {
                          showToast(t?.ui?.freeSuccess ?? 'Thanks!', 'success');
                        } else {
                          setDonationAmount(String(amount));
                          setPaymentOpen(true);
                        }
                      }}
                      className={`flex items-center gap-2 px-6 py-3 text-xl font-bold font-display hand-drawn-button transition-all ${
                        amount === 0
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20 border-gray-600'
                          : 'bg-primary text-[#121212] hover:bg-primary-dark border-primary'
                      }`}
                    >
                      {amount === 0 ? (t?.monetization?.free ?? 'Free') : `${amount} CHF`}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => { setDonationAmount('5'); setPaymentOpen(true); }}
                  className="flex items-center gap-2 px-8 py-3 text-xl font-bold font-display hand-drawn-button bg-white text-[#121212] hover:bg-gray-200 transition-colors border-none"
                >
                  <span className="material-symbols-outlined text-blue-600">payments</span>
                  {t?.monetization?.paypalTwint ?? 'PayPal / TWINT'}
                </button>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-2">
                  {t?.thankYou?.everyTreat ?? 'Every treat counts! Woof & Meow.'}
                </p>
              </div>
            </div>
          )}

          {/* Create another one – as in HTML */}
          {onCreateAnother && (
            <div className="mt-8">
                <button
                  type="button"
                  onClick={onCreateAnother}
                  className={`text-primary transition-colors font-display text-2xl ${darkMode ? 'hover:text-white' : 'hover:text-gray-900'}`}
                >
                {t?.thankYou?.createAnother ?? t?.nav?.createAnother ?? 'Create another one'}
              </button>
            </div>
          )}
        </div>
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
          showToast(t?.paymentSuccess?.thankYouMessage ?? 'Thank you!', 'success');
          onPaymentSuccess?.(paymentId);
        }}
        onFailure={(msg) => showToast(`${t?.ui?.error ?? 'Error'}: ${msg}`, 'error')}
      />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={onFaqClick ?? (() => showToast(t?.footer?.faqComingSoon ?? 'FAQ — coming soon.', 'info'))} />
      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  );
});

Step9ThankYou.displayName = 'Step9ThankYou';

export default Step9ThankYou;
