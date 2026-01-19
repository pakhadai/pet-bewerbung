import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { MAX_DESCRIPTION_LENGTH, TRANSLATIONS, PAYMENT_SUCCESS_BEHAVIOR } from './constants';
import PaymentSuccess from './components/PaymentSuccess';
import API_ENDPOINTS from './config';
import compressImage from './utils/imageCompression';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SwissDocument from './components/SwissDocument';
import { X, Camera } from 'lucide-react';
import DonateModal from './components/DonateModal';
import PaymentModal from './components/PaymentModal';
import LegalPages from './components/LegalPages';
import ErrorBoundary from './components/ErrorBoundary';
import CookieBanner from './components/CookieBanner';

// Import step components
import {
  Step1OwnerInfo,
  Step2PetInfo,
  Step3HealthInsurance,
  Step4Description,
  Step5Photo,
  Step6Summary,
  Step7TemplateSelect,
  Step8Preview,
  Step9ThankYou
} from './components/steps';

// Import custom hooks
import {
  useFormWizard,
  useTemplateSelection,
  usePaymentFlow,
  useToast,
  useScrollVisibility,
  useFormValidation
} from './hooks';

export default function App() {
  // Custom hooks for state management
  const {
    step,
    data,
    animDir,
    t,
    updateData,
    goToStep
  } = useFormWizard();

  const {
    selectedTemplate,
    setSelectedTemplate,
    previewOpen,
    previewTemplate,
    openPreview,
    closePreview
  } = useTemplateSelection();

  const {
    donationAmount,
    setDonationAmount,
    donateOpen,
    setDonateOpen,
    paymentOpen,
    setPaymentOpen
  } = usePaymentFlow();

  const { toast, showToast } = useToast();
  const butterVisible = useScrollVisibility(120);
  const { errors: validationErrors, isValid: canProceed } = useFormValidation(data, step);

  // Theme state (kept local as it's simple)
  const [theme, setTheme] = useState('light');
  const [isGenerating, setIsGenerating] = useState(false);
  const [legalPage, setLegalPage] = useState(null); // 'impressum', 'privacy', 'terms', or null
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);

  // Handle URL parameters for payment success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment_success');
    const sessionId = params.get('session_id');
    const paymentCanceled = params.get('payment_canceled');

    if (paymentSuccess === 'true' && sessionId) {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
        setShowPaymentSuccess(true);
        setPaymentSessionId(sessionId);
      } else if (PAYMENT_SUCCESS_BEHAVIOR === 'redirect_home') {
        goToStep(0);
        showToast(t?.paymentSuccess?.message || 'Payment successful! Thank you!', 'success');
      } else if (PAYMENT_SUCCESS_BEHAVIOR === 'show_toast') {
        showToast(t?.paymentSuccess?.message || 'Payment successful! Thank you!', 'success');
      }
    } else if (paymentCanceled === 'true') {
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('Payment was canceled', 'info');
    }
  }, [goToStep, showToast, t]);

  // Clear generated text when language changes
  const prevLangRef = useRef(data.lang);
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      updateData('generatedText', '');
      showToast(TRANSLATIONS[data.lang]?.labels?.aiPrompt || 'Please regenerate text for the new language', 'info');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, updateData, showToast]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress image before storing
        const compressedImage = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
          maxSizeKB: 500
        });
        updateData('photo', compressedImage);
      } catch (err) {
        // Fallback to uncompressed if compression fails
        const reader = new FileReader();
        reader.onloadend = () => updateData('photo', reader.result);
        reader.readAsDataURL(file);
        showToast('Image compression failed, using original', 'info');
      }
    }
  };

  const generateText = async () => {
    setIsGenerating(true);
    
    try {
      // Prepare pet data for AI - include all relevant info
      const petData = {
        petName: data.petName || '',
        petType: data.petType || '',
        breed: data.breed || '',
        age: data.age || '',
        gender: data.gender || '',
        weight: data.weight || '',
        traits: data.keywords || '',
        neutered: data.neutered || false,
        vaccinated: data.vaccinated || false,
      };
      
      const res = await fetch(API_ENDPOINTS.generatePetDescription, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petData, lang: data.lang }),
      });
      
      const json = await res.json();
      
      if (res.status === 429) {
        // Rate limit exceeded
        showToast(json.message || 'AI limit reached. Try again tomorrow.', 'error');
        return;
      }
      
      if (res.status === 503) {
        // AI not configured - fall back to template
        generateFallbackText();
        showToast('Using template (AI not available)', 'info');
        return;
      }
      
      if (!res.ok) {
        throw new Error(json.error || 'AI generation failed');
      }
      
      updateData('generatedText', json.description);
      
      // Show remaining requests
      if (json.remaining !== undefined) {
        showToast(`✨ ${json.remaining} AI requests remaining today.`, 'success');
      }
      
    } catch (err) {
      console.error('AI generation error:', err);
      showToast('AI error: ' + (err.message || 'Unknown error'), 'error');
      
      // Fall back to template on error
      generateFallbackText();
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fallback template-based generation
  const generateFallbackText = () => {
    const tmpl = t.templates;
    const rawKeywords = (data.keywords || '').split(',').map(s => s.trim()).filter(s => s);
    let middleSection = "";
    if (rawKeywords.length > 0) {
      const formattedKeywords = rawKeywords.join(', ');
      middleSection = `${tmpl.keywords || 'Eigenschaften: '}${formattedKeywords}. `;
    }
    const petInfo = [data.petName, data.breed].filter(Boolean).join(', ');
    const intro = petInfo ? `${petInfo} ist ein wunderbares Haustier. ` : (tmpl.intro || '');
    const fullText = `${intro}${middleSection}${tmpl.outro || ''}`;
    updateData('generatedText', fullText.slice(0, MAX_DESCRIPTION_LENGTH));
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('pdf-document');
      if (!element) {
        showToast('Document not found', 'error');
        return;
      }
      const filename = `${data.petName || 'Pet-CV'}-${new Date().getTime()}.pdf`;
      const options = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      
      // Detect mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      // Generate PDF as blob
      const pdfBlob = await html2pdf().set(options).from(element).outputPdf('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      if (isIOS) {
        // iOS Safari: open in new tab (user can save from there)
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          // If popup blocked, try direct navigation
          window.location.href = url;
        }
        showToast(t.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"', 'info');
      } else if (isMobile) {
        // Android: try download attribute
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('PDF downloaded!', 'success');
      } else {
        // Desktop: standard download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('PDF downloaded successfully!', 'success');
      }
      
      // Cleanup after delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      
      // Go to thank you page
      setTimeout(() => goToStep(9), 2000);
    } catch (err) {
      showToast('Failed to download PDF: ' + err.message, 'error');
    }
  };

  const handleDonateMethod = async (method) => {
    const parsed = parseFloat(donationAmount || '5');
    const amount = Math.max(1, Math.round(parsed));
    const cents = amount * 100;
    // All payments use CHF (Swiss Francs) - Swiss service
    const currency = 'chf';
    try {
      const res = await fetch(API_ENDPOINTS.createCheckoutSession, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cents, currency: currency, successUrl: window.location.href, cancelUrl: window.location.href, payment_method: method }),
      });
      
      // Перевірка типу відповіді перед парсингом
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        showToast('Payment error: Server returned HTML instead of JSON. Check API connection.', 'error');
        return;
      }
      
      const json = await res.json();
      if (json.url) {
        window.open(json.url, '_blank');
        showToast('Opening Checkout...', 'info');
      } else {
        showToast(json.error || 'Failed to create checkout session', 'error');
      }
    } catch (err) {
      console.error('Payment error:', err);
      showToast('Payment error: ' + (err.message || err), 'error');
    } finally {
      setDonateOpen(false);
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    goToStep(step + 1);
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className={`page page-enter-${animDir} reveal fade-enter`}>
            <LandingPage t={t} setStep={goToStep} />
          </div>
        );
      case 1:
        return <Step1OwnerInfo data={data} updateData={updateData} t={t} animDir={animDir} errors={validationErrors} />;
      case 2:
        return <Step2PetInfo data={data} updateData={updateData} t={t} animDir={animDir} errors={validationErrors} />;
      case 3:
        return <Step3HealthInsurance data={data} updateData={updateData} t={t} animDir={animDir} />;
      case 4:
        return (
          <Step4Description
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            isGenerating={isGenerating}
            onGenerate={generateText}
          />
        );
      case 5:
        return <Step5Photo data={data} onFileChange={handleFileChange} updateData={updateData} t={t} animDir={animDir} />;
      case 6:
        return <Step6Summary data={data} t={t} animDir={animDir} />;
      case 7:
        return (
          <Step7TemplateSelect
            data={data}
            t={t}
            animDir={animDir}
            onSelectTemplate={handleSelectTemplate}
            onPreview={openPreview}
            showToast={showToast}
          />
        );
      case 8:
        return <Step8Preview data={data} t={t} animDir={animDir} selectedTemplate={selectedTemplate} />;
      default:
        return null;
    }
  };

  // Payment Success Page (shown after successful Stripe Checkout)
  if (showPaymentSuccess) {
    return (
      <PaymentSuccess
        data={data}
        t={t}
        theme={theme}
        onThemeChange={setTheme}
        onLangChange={(v) => updateData('lang', v)}
        onLogoClick={() => {
          setShowPaymentSuccess(false);
          goToStep(0);
        }}
        sessionId={paymentSessionId}
      />
    );
  }

  // Step 9: Thank You Page
  if (step === 9) {
    return (
      <Step9ThankYou
        data={data}
        t={t}
        theme={theme}
        onThemeChange={setTheme}
        onLangChange={(v) => updateData('lang', v)}
        onLogoClick={() => goToStep(0)}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        donateOpen={donateOpen}
        setDonateOpen={setDonateOpen}
        paymentOpen={paymentOpen}
        setPaymentOpen={setPaymentOpen}
        onDonate={handleDonateMethod}
        showToast={showToast}
        toast={toast}
        onPaymentSuccess={(paymentId) => {
          if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
            setShowPaymentSuccess(true);
            setPaymentSessionId(paymentId);
          }
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans theme-text pb-6 print:bg-white print:p-0 ${step !== 0 ? 'theme-bg' : ''}`}>
      <GlobalStyles theme={theme} />
      <Header
        step={step}
        theme={theme}
        onThemeChange={setTheme}
        lang={data.lang}
        onLangChange={(v) => updateData('lang', v)}
        onLogoClick={() => goToStep(0)}
        t={t}
      />

      <main className="w-full print:w-full print:max-w-none print:p-0">
        <div className={step === 0 ? "w-full" : "max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0"}>
          {renderStep()}
        </div>
      </main>

      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        amount={donationAmount}
        onDonate={handleDonateMethod}
        onOpenPayment={() => { setPaymentOpen(true); setDonateOpen(false); }}
      />
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={donationAmount}
        lang={data.lang}
        t={t}
        onSuccess={(paymentId) => {
          showToast(t.paymentSuccess?.thankYouMessage || 'Thank you — payment succeeded', 'success');
          // Show PaymentSuccess page
          if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
            setShowPaymentSuccess(true);
            setPaymentSessionId(paymentId);
          }
        }}
        onFailure={(msg) => showToast(`${t.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
      />

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="relative bg-transparent w-full h-full flex flex-col items-center justify-center" onClick={closePreview}>
            <button
              onClick={(e) => { e.stopPropagation(); closePreview(); }}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <X size={32} />
            </button>

            <div
              className="text-white mb-4 font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Camera size={18} /> {t.ui.previewMode} — {previewTemplate}
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

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${
          toast.type === 'success' ? 'theme-success' : toast.type === 'error' ? 'theme-error' : 'theme-card theme-text'
        }`}>
          {toast.msg}
        </div>
      )}

      <Navigation
        step={step}
        onPrev={() => goToStep(step - 1)}
        onNext={() => goToStep(step + 1)}
        onDownloadPDF={handleDownloadPDF}
        showToast={showToast}
        t={t}
        canProceed={canProceed}
      />

      <Footer step={step} t={t} onOpenLegal={setLegalPage} />

      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />

      <CookieBanner t={t} onOpenPrivacy={() => setLegalPage('privacy')} />
    </div>
  );
}
