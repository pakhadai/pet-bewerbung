import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API_ENDPOINTS from '../config';

function CheckoutForm({ clientSecret, paymentIntentId, onClose, onSuccess, onFailure }) {
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
    const { error } = await stripe.confirmPayment({
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

    if (paymentIntentId) {
      // poll for final status
      let attempts = 0;
      while (attempts < 15) {
        const status = await pollStatus(paymentIntentId);
        if (status === 'succeeded') {
          onSuccess && onSuccess(paymentIntentId);
          onClose();
          return;
        }
        if (status === 'failed') {
          onFailure && onFailure('Payment failed');
          onClose();
          return;
        }
        attempts += 1;
        await new Promise(r => setTimeout(r, 1000));
      }
      onFailure && onFailure('Payment pending or timed out');
    } else {
      onSuccess && onSuccess(null);
      onClose();
    }
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
          // Hide billing details (simplify form)
          fields: {
            billingDetails: 'never'
          },
          // Show wallets above card form
          paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'twint']
        }}
      />
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="theme-radio theme-border mr-2 px-4 py-2 rounded-lg border">Cancel</button>
        <button disabled={!stripe} className="theme-button-magic px-4 py-2 rounded-lg text-white">{loading ? 'Processing…' : 'Pay'}</button>
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

export default function PaymentModal({ open, onClose, amount, onSuccess, onFailure, lang = 'de' }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  
  const stripeLocale = getStripeLocale(lang);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="theme-card rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="theme-text text-lg font-bold">Pay CHF {amount}</h3>
          <button onClick={onClose} className="theme-text-muted hover:theme-text transition-colors">✕</button>
        </div>
        <div>
          {clientSecret && stripePromise ? (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret, 
                locale: stripeLocale,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    borderRadius: '8px'
                  }
                }
              }}
            >
              <CheckoutForm clientSecret={clientSecret} paymentIntentId={paymentIntentId} onClose={onClose} onSuccess={onSuccess} onFailure={onFailure} />
            </Elements>
          ) : (
            <div className="p-8 text-center">Preparing payment…</div>
          )}
        </div>
      </div>
    </div>
  );
}
