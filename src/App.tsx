import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { MAX_DESCRIPTION_LENGTH, TRANSLATIONS, PAYMENT_SUCCESS_BEHAVIOR } from './constants';
import PaymentSuccess from './components/PaymentSuccess';
import API_ENDPOINTS from './config';
import compressImage from './utils/imageCompression';
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Steps from './components/Steps';
import SwissDocument from './components/SwissDocument';
import { X, Camera } from 'lucide-react';
import DonateModal from './components/DonateModal';
import PaymentModal from './components/PaymentModal';
import LegalPages from './components/LegalPages';
import ErrorBoundary from './components/ErrorBoundary';
import CookieBanner from './components/CookieBanner';

// Import step components
import {
  Step1Details,
  Step3HealthInsurance,
  Step3UploadSelect,
  Step4Description,
  Step8Preview,
  Step9ThankYou
} from './components/steps/index';
import StepProgress from './components/StepProgress';

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

  // Dark mode state — persist in localStorage so it survives refresh
  const THEME_STORAGE_KEY = 'pet-bewerbung-theme';
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'dark';
    } catch {
      return false;
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [legalPage, setLegalPage] = useState<string | null>(null); // 'impressum', 'privacy', 'terms', or null
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState<string | null>(null);
  const [navigationVisible, setNavigationVisible] = useState(true); // Control navigation visibility for Step5Photo

  // Apply dark mode class to document and persist theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

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

  // Reset navigation visibility when step changes (except when on step 4 = Upload with cropper open)
  useEffect(() => {
    if (step !== 4) {
      setNavigationVisible(true);
    }
  }, [step]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('AI generation error:', err);
      }
      
      // Show user-friendly error message
      const errorMessage = err.message || 'Unknown error';
      showToast(
        errorMessage.includes('network') || errorMessage.includes('fetch')
          ? t?.labels?.aiNetworkError || 'Network error. Please check your connection and try again.'
          : t?.labels?.aiError || 'AI generation failed. Using template instead.',
        'error'
      );
      
      // Fall back to template on error
      generateFallbackText();
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fallback template-based generation
  const generateFallbackText = () => {
    const tmpl = t.templates;
    const rawKeywords = (data.keywords || '').split(',').map((s: string) => s.trim()).filter((s: string) => s);
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

  // NOTE: html2pdf.js renders PDF as an image (screenshot), not as selectable text.
  // This means:
  // - Text cannot be selected or copied from the PDF
  // - File size may be larger than text-based PDFs
  // - Some document scanners may not recognize text
  // For future improvements, consider server-side PDF generation (react-pdf, puppeteer)
  // For MVP, this solution is acceptable and works well for the use case.
  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('pdf-document');
      if (!element) {
        showToast(t?.ui?.error || 'Document not found', 'error');
        return;
      }
      const filename = `${data.name || 'Pet-CV'}-${new Date().getTime()}.pdf`;
      const options = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false, // Disable console logs from html2canvas
          height: 1104, // A4 height in pixels at 96 DPI (292mm = 1104px)
          width: 794, // A4 width in pixels at 96 DPI (210mm = 794px)
          windowWidth: 794,
          windowHeight: 1104,
          onclone: (clonedDoc: Document) => {
            // Ensure all images are loaded in cloned document
            const images = clonedDoc.querySelectorAll('img');
            images.forEach(img => {
              if (!(img as HTMLImageElement).complete) {
                (img as HTMLImageElement).style.display = 'none';
              }
            });
            // Force exact dimensions on cloned document to match preview
            const pdfDoc = clonedDoc.getElementById('pdf-document');
            if (pdfDoc) {
              pdfDoc.style.width = '210mm';
              pdfDoc.style.height = '292mm';
              pdfDoc.style.maxWidth = '210mm';
              pdfDoc.style.maxHeight = '292mm';
              pdfDoc.style.minWidth = '210mm';
              pdfDoc.style.minHeight = '292mm';
              pdfDoc.style.overflow = 'hidden';
              pdfDoc.style.boxSizing = 'border-box';
              pdfDoc.style.flexShrink = '0';
              
              // Ensure inner document container also has correct dimensions
              const innerDoc = pdfDoc.querySelector('[class*="w-\\[210mm\\]"]');
              if (innerDoc) {
                innerDoc.setAttribute('style', 'width: 210mm; height: 292mm; max-width: 210mm; max-height: 292mm; overflow: hidden; box-sizing: border-box;');
              }
            }
          }
        },
        jsPDF: { 
          orientation: 'portrait' as const, 
          unit: 'mm' as const, 
          format: 'a4' as const,
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
      // Не перекидати — користувач залишається на сторінці подяки
    } catch (err: any) {
      // Better error handling for PDF generation
      const errorMessage = err.message || 'Unknown error';
      if (errorMessage.includes('canvas') || errorMessage.includes('memory')) {
        showToast(
          t?.ui?.pdfMemoryError || 'PDF generation failed due to large image. Try reducing photo size.',
          'error'
        );
      } else if (errorMessage.includes('timeout')) {
        showToast(
          t?.ui?.pdfTimeoutError || 'PDF generation timed out. Please try again.',
          'error'
        );
      } else {
        showToast(
          t?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage,
          'error'
        );
      }
      
      if (import.meta.env.DEV) {
        console.error('PDF generation error:', err);
      }
    }
  };

  const handleDonateMethod = async (method: string) => {
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
      
      // Check if response is OK
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Server error (${res.status})`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.details || errorMessage;
          if (import.meta.env.DEV) {
            console.error('Checkout session error:', {
              status: res.status,
              error: errorJson.error,
              details: errorJson.details,
              type: errorJson.type,
              code: errorJson.code
            });
          }
        } catch {
          errorMessage = errorText.substring(0, 100) || errorMessage;
          if (import.meta.env.DEV) {
            console.error('Checkout session error (non-JSON):', res.status, errorText.substring(0, 200));
          }
        }
        showToast(errorMessage || 'Failed to create checkout session', 'error');
        return;
      }
      
      // Перевірка типу відповіді перед парсингом
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        if (import.meta.env.DEV) {
          console.error('Non-JSON response:', text.substring(0, 200));
        }
        showToast('Payment error: Server returned HTML instead of JSON. Check API connection.', 'error');
        return;
      }
      
      const json = await res.json();
      if (json.url) {
        window.open(json.url, '_blank');
        showToast('Opening Checkout...', 'info');
      } else {
        const errorMsg = json.error || json.details || 'Failed to create checkout session';
        if (import.meta.env.DEV) {
          console.error('Checkout session response error:', json);
        }
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('Payment error:', err);
      }
      showToast('Payment error: ' + (err.message || err), 'error');
    } finally {
      setDonateOpen(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Convert darkMode to theme string for components that still use theme prop
  const theme = darkMode ? 'dark' : 'light';

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className={`page page-enter-${animDir} reveal fade-enter flex flex-col items-center pt-28 pb-16 px-4 relative overflow-hidden`}>
            <div className={`absolute top-[15%] left-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}>
              <span className="material-symbols-outlined text-8xl rotate-12 select-none">pets</span>
            </div>
            <div className={`absolute bottom-[20%] right-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}>
              <span className="material-symbols-outlined text-9xl -rotate-12 select-none">favorite</span>
            </div>
            <div className="w-full max-w-6xl flex flex-col items-center text-center z-10 gap-16">
              <Hero darkMode={darkMode} t={t} onStartClick={() => goToStep(1)} />
              <Steps darkMode={darkMode} t={t} />
            </div>
          </div>
        );
      case 1:
        return (
          <Step1Details
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            errors={validationErrors}
            darkMode={darkMode}
            onNext={() => goToStep(2)}
            canProceed={canProceed}
          />
        );
      case 2:
        return (
          <Step3HealthInsurance
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            darkMode={darkMode}
            onPrev={() => goToStep(1)}
            onNext={() => goToStep(3)}
          />
        );
      case 3:
        return (
          <Step4Description
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            darkMode={darkMode}
            isGenerating={isGenerating}
            onGenerate={generateText}
            onPrev={() => goToStep(2)}
            onNext={() => goToStep(4)}
          />
        );
      case 4:
        return (
          <Step3UploadSelect
            data={data}
            updateData={updateData}
            t={t}
            animDir={animDir}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onPreview={openPreview}
            showToast={showToast}
            onNavigationVisibilityChange={setNavigationVisible}
            darkMode={darkMode}
            onPrev={() => goToStep(3)}
            onNext={() => goToStep(5)}
          />
        );
      case 5:
        return (
          <Step8Preview
            data={data}
            t={t}
            animDir={animDir}
            selectedTemplate={selectedTemplate}
            darkMode={darkMode}
            onPrev={() => goToStep(4)}
            onNext={() => goToStep(6)}
          />
        );
      default:
        return null;
    }
  };

  // Payment Success Page (shown after successful Stripe Checkout)
  // Hidden pdf-document rendered so Download PDF works on this page too.
  if (showPaymentSuccess) {
    return (
      <>
        <div aria-hidden="true" className="fixed overflow-hidden" style={{ left: -9999, top: 0, width: '210mm', height: '292mm', zIndex: -1 }}>
          <div id="pdf-document" style={{ width: '210mm', height: '292mm' }}>
            <SwissDocument data={data} t={t} templateType={selectedTemplate} />
          </div>
        </div>
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
          onDownloadPDF={handleDownloadPDF}
        />
      </>
    );
  }

  // Step 6: Thank You Page (Summary step removed)
  // Hidden pdf-document must exist in DOM for handleDownloadPDF to work when user clicks Download on thank-you page.
  if (step === 6) {
    return (
      <>
        <div aria-hidden="true" className="fixed overflow-hidden" style={{ left: -9999, top: 0, width: '210mm', height: '292mm', zIndex: -1 }}>
          <div id="pdf-document" style={{ width: '210mm', height: '292mm' }}>
            <SwissDocument data={data} t={t} templateType={selectedTemplate} />
          </div>
        </div>
        <Step9ThankYou
          data={data}
          t={t}
          theme={theme}
          onThemeChange={(newTheme: string) => setDarkMode(newTheme === 'dark')}
          onLangChange={(v: string) => updateData('lang', v)}
          onLogoClick={() => goToStep(0)}
          onDownloadPDF={handleDownloadPDF}
          onCreateAnother={() => goToStep(0)}
          donationAmount={donationAmount}
          setDonationAmount={setDonationAmount}
          donateOpen={donateOpen}
          setDonateOpen={setDonateOpen}
          paymentOpen={paymentOpen}
          setPaymentOpen={setPaymentOpen}
          onDonate={handleDonateMethod}
          showToast={showToast}
          toast={toast}
          onPaymentSuccess={(paymentId: string) => {
            if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
              setShowPaymentSuccess(true);
              setPaymentSessionId(paymentId);
            }
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen font-sans theme-text theme-bg pb-6 print:bg-white print:p-0">
      <GlobalStyles theme={theme} />
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        lang={data.lang}
        onLangChange={(v: string) => updateData('lang', v)}
        onLogoClick={() => goToStep(0)}
        t={t}
      />

      <main className={`w-full print:w-full print:max-w-none print:p-0 ${step >= 1 && step <= 5 ? 'pt-24 md:pt-28' : ''}`}>
        {step >= 1 && step <= 5 && (
          <div className={`sticky top-0 z-20 w-full p-0 print:hidden border-b ${darkMode ? 'bg-gray-900 border-transparent' : 'bg-white border-transparent'}`} style={{ borderBottomColor: 'transparent' }}>
            <StepProgress step={step} t={t} darkMode={darkMode} />
          </div>
        )}
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
        darkMode={darkMode}
        onSuccess={(paymentId: string) => {
          showToast(t.paymentSuccess?.thankYouMessage || 'Thank you — payment succeeded', 'success');
          // Show PaymentSuccess page
          if (PAYMENT_SUCCESS_BEHAVIOR === 'show_page') {
            setShowPaymentSuccess(true);
            setPaymentSessionId(paymentId);
          }
        }}
        onFailure={(msg: string) => showToast(`${t.ui?.error || 'Payment failed'}: ${msg}`, 'error')}
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

      <Footer darkMode={darkMode} t={t} onOpenLegal={setLegalPage} onFaqClick={() => showToast(t?.footer?.faqComingSoon ?? 'FAQ — coming soon.', 'info')} />

      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />

      <CookieBanner t={t} onOpenPrivacy={() => setLegalPage('privacy')} />
    </div>
  );
}
