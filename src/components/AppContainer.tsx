/**
 * AppContainer Component
 * Main app container with routing logic, navigation, and modals
 * Handles step navigation and orchestrates step rendering
 */

import React, { useState, useEffect } from 'react';
import { PAYMENT_SUCCESS_BEHAVIOR } from '../constants';
import Header from './Header';
import Footer from './Footer';
import FaqModal from './FaqModal';
import PaymentSuccess from './PaymentSuccess';
import StepProgress from './StepProgress';
import FloatingNavigation from './FloatingNavigation';
import CookieBanner, { COOKIE_CONSENT_KEY, isCookieConsentGiven } from './CookieBanner';
import LegalPages from './LegalPages';
import DonateModal from './DonateModal';
import PaymentModal from './PaymentModal';
import DocumentEditor from './DocumentEditor';
import ErrorBoundary from './ErrorBoundary';
import { X, Camera } from 'lucide-react';
import SwissDocument from './SwissDocument';
import { useFormWizard, useToast, usePremium, useTemplateSelection, usePaymentFlow } from '../hooks';
import WizardRoute from '../routes/WizardRoute';
import HeroRoute from '../routes/HeroRoute';
import ThankYouRoute from '../routes/ThankYouRoute';

interface AppContainerProps {
  onDownloadPDF: () => Promise<void>;
  onDownloadAllTemplates: () => Promise<void>;
  onGenerateText: () => Promise<void>;
  onDonateMethod: (method: string) => Promise<void>;
  onBuyPremium: () => void;
  onOpenBuilder: () => void;
}

export const AppContainer: React.FC<AppContainerProps> = ({
  onDownloadPDF,
  onDownloadAllTemplates,
  onGenerateText,
  onDonateMethod,
  onBuyPremium,
  onOpenBuilder,
}) => {
  // State management
  const { step, data, animDir, updateData, goToStep } = useFormWizard();
  const { showToast } = useToast();
  const { isPremium, getTemplateInfo, premiumPrice, timeRemaining: premiumTimeRemaining, activatePremium } = usePremium();
  const { selectedTemplate, setSelectedTemplate, previewOpen, previewTemplate, openPreview, closePreview } = useTemplateSelection();
  const { donationAmount, setDonationAmount, donateOpen, setDonateOpen, paymentOpen, setPaymentOpen } = usePaymentFlow();

  // Local state for modals and theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pet-bewerbung-theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  const [legalPage, setLegalPage] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [navigationVisible, setNavigationVisible] = useState(true);
  const [cookieConsent, setCookieConsent] = useState<'accepted' | 'declined' | null>(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      return consent as 'accepted' | 'declined' | null;
    } catch {
      return null;
    }
  });
  const [forceCookieBanner, setForceCookieBanner] = useState(false);
  const [premiumPaymentOpen, setPremiumPaymentOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('pet-bewerbung-theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  // Handle cookie consent change
  const handleCookieConsentChange = (consent: 'accepted' | 'declined') => {
    setCookieConsent(consent);
    setForceCookieBanner(false);
  };

  // Reset navigation visibility when step changes
  useEffect(() => {
    if (step !== 4) {
      setNavigationVisible(true);
    }
  }, [step]);

  // Handle URL parameters for payment success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const premiumSuccess = params.get('premium_success');
    const sessionId = params.get('session_id');
    const paymentCanceled = params.get('payment_canceled');

    if (premiumSuccess === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);

      const pendingSession = sessionStorage.getItem('pending_premium_session');
      if (pendingSession) {
        sessionStorage.removeItem('pending_premium_session');
      }

      const sessionToActivate = pendingSession || sessionId;
      if (sessionToActivate) {
        activatePremium(sessionToActivate).then((success) => {
          if (success) {
            showToast('🎉 Premium freigeschaltet! 2 Stunden Zugang.', 'success');
          } else {
            showToast('Premium konnte nicht aktiviert werden.', 'error');
          }
        });
      }

      goToStep(5);
      return;
    }

    if (paymentSuccess === 'true' && sessionId) {
      window.history.replaceState({}, document.title, window.location.pathname);

      if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
        setShowPaymentSuccess(true);
        setPaymentSessionId(sessionId);
      } else if (PAYMENT_SUCCESS_BEHAVIOR === 'redirect_home') {
        goToStep(0);
        showToast('Payment successful! Thank you!', 'success');
      } else if (PAYMENT_SUCCESS_BEHAVIOR === 'show_toast') {
        showToast('Payment successful! Thank you!', 'success');
      }
    } else if (paymentCanceled === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('Payment was canceled', 'info');
    }
  }, [goToStep, showToast, activatePremium]);

  // Get translations from useFormWizard
  const t = useFormWizard()?.t || {};

  // Handle premium purchase - opens payment modal
  const handleBuyPremiumClick = () => {
    if (cookieConsent !== 'accepted') {
      setForceCookieBanner(true);
      showToast(t?.legal?.cookieRequiredForPayment || 'Bitte akzeptieren Sie Cookies für Zahlungen', 'info');
      return;
    }
    setPremiumPaymentOpen(true);
  };

  // Handle opening the template builder / visual editor
  const handleOpenBuilderClick = () => {
    if (!isPremium) {
      showToast(t?.premium?.builderRequiresPremium ?? 'Visual Editor benötigt Premium', 'info');
      handleBuyPremiumClick();
      return;
    }
    setBuilderOpen(true);
  };

  // Handle applying builder changes
  const handleApplyBuilder = () => {
    setBuilderOpen(false);
    showToast(t?.builder?.applied ?? 'Änderungen angewendet!', 'success');
  };

  // Handle premium payment success (from modal)
  const handlePremiumPaymentSuccess = async (paymentId: string) => {
    setPremiumPaymentOpen(false);
    const success = await activatePremium(paymentId);

    if (success) {
      showToast(t?.premium?.purchaseSuccess || '🎉 Premium freigeschaltet! 2 Stunden Zugang.', 'success');
    } else {
      showToast(t?.premium?.purchaseSuccess || '🎉 Premium freigeschaltet!', 'success');
    }
  };

  // Convert darkMode to theme string
  const theme = darkMode ? 'dark' : 'light';

  // Main app content
  const appContent = showPaymentSuccess ? (
    <PaymentSuccess
      data={data}
      t={t}
      theme={theme}
      onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
      onLangChange={(v: string) => updateData('lang', v)}
      onLogoClick={() => {
        setShowPaymentSuccess(false);
        goToStep(0);
      }}
      sessionId={paymentSessionId}
      showToast={showToast}
      onDownloadPDF={onDownloadPDF}
      onFaqClick={() => setFaqOpen(true)}
    />
  ) : step === 7 ? (
    <ThankYouRoute
      data={data}
      t={t}
      theme={theme}
      onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
      onLangChange={(v: string) => updateData('lang', v)}
      onLogoClick={() => goToStep(0)}
      onDownloadPDF={onDownloadPDF}
      onCreateAnother={() => goToStep(0)}
      onPrev={() => goToStep(6)}
      donationAmount={donationAmount}
      setDonationAmount={setDonationAmount}
      donateOpen={donateOpen}
      setDonateOpen={setDonateOpen}
      paymentOpen={paymentOpen}
      setPaymentOpen={setPaymentOpen}
      onDonate={onDonateMethod}
      showToast={showToast}
      onFaqClick={() => setFaqOpen(true)}
    />
  ) : (
    <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        lang={data.lang}
        onLangChange={(v: string) => updateData('lang', v)}
        onLogoClick={() => goToStep(0)}
        t={t}
        isPremium={isPremium}
        premiumTimeRemaining={premiumTimeRemaining}
        onPremiumExpired={() => showToast(t?.premium?.sessionExpired || 'Premium-Sitzung abgelaufen', 'info')}
      />

      <main className={`w-full print:w-full print:max-w-none print:p-0 ${step >= 1 && step <= 6 ? 'pt-24 md:pt-28' : ''}`}>
        {step >= 1 && step <= 6 && (
          <div className={`sticky top-0 z-20 w-full p-0 print:hidden border-b ${darkMode ? 'bg-gray-900 border-transparent' : 'bg-white border-transparent'}`}>
            <StepProgress step={step} t={t} darkMode={darkMode} onStepClick={goToStep} />
          </div>
        )}
        <div className={step === 0 ? "w-full" : "max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0"}>
          {step === 0 ? (
            <HeroRoute darkMode={darkMode} t={t} onStartClick={() => goToStep(1)} />
          ) : step >= 1 && step <= 6 ? (
            <WizardRoute
              step={step}
              animDir={animDir}
              data={data}
              updateData={updateData}
              t={t}
              darkMode={darkMode}
              isPremium={isPremium}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              showToast={showToast}
              onGenerateText={onGenerateText}
              onDownloadPDF={onDownloadPDF}
              onBuyPremium={handleBuyPremiumClick}
              getTemplateInfo={getTemplateInfo}
              premiumPrice={premiumPrice}
              onDownloadAllTemplates={onDownloadAllTemplates}
              onOpenBuilder={handleOpenBuilderClick}
              onNavigationVisibilityChange={setNavigationVisible}
            />
          ) : null}
        </div>
      </main>

      {/* Floating Navigation Bar */}
      <FloatingNavigation
        step={step}
        onPrev={() => goToStep(step - 1)}
        onNext={() => goToStep(step + 1)}
        onDownloadPDF={onDownloadPDF}
        onBuyPremium={handleBuyPremiumClick}
        t={t}
        darkMode={darkMode}
        canProceed={true}
        needsPayment={getTemplateInfo(selectedTemplate).isPremium && !isPremium}
        premiumPrice={premiumPrice}
        visible={navigationVisible}
      />

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        amount={donationAmount}
        onDonate={onDonateMethod}
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
        darkMode={darkMode}
        onSuccess={(paymentId: string) => {
          showToast(t.paymentSuccess?.thankYouMessage || 'Thank you — payment succeeded', 'success');
          if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
            setShowPaymentSuccess(true);
            setPaymentSessionId(paymentId);
          }
        }}
        onFailure={(msg: string) => showToast(`${t.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
      />

      {/* Premium Payment Modal */}
      <PaymentModal
        open={premiumPaymentOpen}
        onClose={() => setPremiumPaymentOpen(false)}
        amount={String(premiumPrice)}
        lang={data.lang}
        t={{
          ...t,
          paymentCheckout: {
            ...t?.paymentCheckout,
            secureCheckout: t?.premium?.securePayment || 'Sichere Zahlung',
            completeDonation: t?.premium?.completePurchase || 'Premium freischalten',
            youreDonating: t?.premium?.yourePayingFor || 'Premium-Zugang für 2 Stunden:',
            toSupport: ''
          }
        }}
        darkMode={darkMode}
        onSuccess={handlePremiumPaymentSuccess}
        onFailure={(msg: string) => showToast(`${t.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
      />

      {/* Visual Document Editor - Premium feature */}
      {builderOpen && (
        <DocumentEditor
          data={data}
          updateData={updateData}
          t={t}
          darkMode={darkMode}
          selectedTemplate={selectedTemplate}
          onClose={() => setBuilderOpen(false)}
          onApply={handleApplyBuilder}
        />
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="relative bg-transparent w-full h-full flex flex-col items-center justify-center" onClick={closePreview}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closePreview();
              }}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X size={32} />
            </button>

            <div
              className="text-white mb-4 font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Camera size={18} /> {t.ui?.previewMode} — {previewTemplate}
            </div>

            <div
              className="w-full max-w-4xl h-full overflow-auto flex justify-center items-start pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 shadow-2xl">
                <ErrorBoundary
                  fallbackTitle="Preview Error"
                  fallbackMessage="Failed to render document preview. Please check your data and try again."
                  onReset={closePreview}
                >
                  <SwissDocument data={data} t={t} templateType={previewTemplate} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 0 && <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={() => setFaqOpen(true)} />}

      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />

      <CookieBanner t={t} onOpenPrivacy={() => setLegalPage('privacy')} onConsentChange={handleCookieConsentChange} forceShow={forceCookieBanner} />
    </div>
  );

  return (
    <>
      {appContent}
      <FaqModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} t={t} darkMode={darkMode} />
    </>
  );
};

export default AppContainer;
