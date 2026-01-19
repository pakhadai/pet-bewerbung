import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API_ENDPOINTS from '../config';

function CheckoutForm({ clientSecret, paymentIntentId, onClose, onSuccess, onFailure, t }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const pollStatus = async (id) => {
    try {
      const res = await fetch(API_ENDPOINTS.paymentStatus(id));
      const json = await res.json();
      return json.status;
    } catch (err) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required'
    });

    setLoading(false);
    
    if (error) {
      onFailure && onFailure(error.message || 'Payment error');
      onClose();
      return;
    }

    // Check payment intent status directly from Stripe response
    if (paymentIntent) {
      if (paymentIntent.status === 'succeeded') {
        onSuccess && onSuccess(paymentIntent.id);
        onClose();
        return;
      }
      if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'processing') {
        // Wait a bit and check status
        await new Promise(r => setTimeout(r, 2000));
        const status = await pollStatus(paymentIntent.id);
        if (status === 'succeeded') {
          onSuccess && onSuccess(paymentIntent.id);
          onClose();
          return;
        }
      }
      if (paymentIntent.status === 'requires_payment_method') {
        onFailure && onFailure('Payment failed - please try again');
        onClose();
        return;
      }
    }
    
    // Fallback: assume success if no error
    onSuccess && onSuccess(paymentIntentId);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        options={{
          layout: 'tabs',
          // Enable Apple Pay & Google Pay wallets
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          },
          // Hide billing details and Link autofill
          fields: {
            billingDetails: 'never'
          },
          // Show wallets above card form, exclude Link
          paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'twint']
        }}
      />
      {/* Sticky pay button at bottom */}
      <div className="flex justify-end gap-2 pt-4 border-t theme-border sticky bottom-0 bg-inherit pb-1">
        <button 
          type="button" 
          onClick={onClose} 
          className="theme-radio theme-border px-5 py-3 rounded-xl border font-medium"
          style={{ transition: 'all 0.3s ease' }}
        >
          {t?.ui?.cancel || 'Cancel'}
        </button>
        <button 
          type="submit"
          disabled={!stripe || loading} 
          className="theme-button-magic px-6 py-3 rounded-xl text-white font-bold disabled:opacity-50"
          style={{ transition: 'all 0.3s ease' }}
        >
          {loading ? 'Processing…' : (t?.ui?.pay || 'Pay')}
        </button>
      </div>
    </form>
  );
}

// Map app language codes to Stripe locale codes
const getStripeLocale = (lang) => {
  const localeMap = {
    de: 'de',
    en: 'en',
    fr: 'fr',
    it: 'it',
    rm: 'de', // Romansh -> German (closest supported)
    ua: 'uk', // Ukrainian
  };
  return localeMap[lang] || 'de';
};

export default function PaymentModal({ open, onClose, amount, onSuccess, onFailure, lang = 'de', t }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  
  const stripeLocale = getStripeLocale(lang);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(API_ENDPOINTS.createPaymentIntent, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.max(1, Math.round(parseFloat(amount || '5'))) * 100, currency: 'chf' }),
        });
        
        // Перевірка типу відповіді перед парсингом
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('Non-JSON response:', text.substring(0, 200));
          if (!mounted) return;
          alert('Payment error: Server returned HTML instead of JSON. Check API connection.');
          return;
        }
        
        const json = await res.json();
        if (!mounted) return;
        if (json.clientSecret) {
          setClientSecret(json.clientSecret);
          // Load Stripe with locale
          if (json.publishableKey) {
            setStripePromise(loadStripe(json.publishableKey, { locale: stripeLocale }));
          }
          if (json.paymentIntentId) setPaymentIntentId(json.paymentIntentId);
          else {
            const cfg = await fetch(API_ENDPOINTS.stripeConfig).then(r => r.json());
            if (cfg.publishableKey) {
              setStripePromise(loadStripe(cfg.publishableKey, { locale: stripeLocale }));
            }
          }
        } else {
          alert(json.error || 'Failed to create payment intent');
        }
      } catch (err) {
        alert('Error creating payment: ' + (err.message || err));
      }
    })();
    return () => { mounted = false; };
  }, [open, amount, stripeLocale]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="theme-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="flex items-center justify-between p-5 border-b theme-border shrink-0">
          <h3 className="theme-text text-lg font-bold">
            💳 {t?.monetization?.title || 'Spenden'} — CHF {amount}
          </h3>
          <button 
            onClick={onClose} 
            className="theme-text-muted hover:theme-text transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-5 overscroll-contain">
          {clientSecret && stripePromise ? (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret, 
                locale: stripeLocale,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    borderRadius: '12px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    colorPrimary: '#8b5cf6',
                  },
                  rules: {
                    '.Input': {
                      padding: '12px 14px',
                      fontSize: '16px'
                    },
                    '.Label': {
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }
                  }
                }
              }}
            >
              <CheckoutForm 
                clientSecret={clientSecret} 
                paymentIntentId={paymentIntentId} 
                onClose={onClose} 
                onSuccess={onSuccess} 
                onFailure={onFailure}
                t={t}
              />
            </Elements>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-4"></div>
              <p className="theme-text-muted">{t?.ui?.loading || 'Preparing payment…'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
