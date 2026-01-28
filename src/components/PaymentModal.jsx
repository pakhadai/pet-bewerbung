import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API_ENDPOINTS from '../config';

function CheckoutForm({ clientSecret, onClose, onSuccess, onFailure, t, amount, darkMode = false }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: 'if_required'
      });

      if (error) {
        setLoading(false);
        onFailure && onFailure(error.message || 'Payment error');
        return;
      }

      if (paymentIntent) {
        if (import.meta.env.DEV) {
          console.log('Payment intent status:', paymentIntent.status);
        }

        if (paymentIntent.status === 'succeeded') {
          setLoading(false);
          onSuccess && onSuccess(paymentIntent.id);
          onClose();
          return;
        }

        if (paymentIntent.status === 'processing') {
          setLoading(false);
          onSuccess && onSuccess(paymentIntent.id);
          onClose();
          return;
        }

        if (paymentIntent.status === 'requires_payment_method') {
          setLoading(false);
          onFailure && onFailure('Payment failed - please try again');
          return;
        }

        setLoading(false);
        onSuccess && onSuccess(paymentIntent.id);
        onClose();
      } else {
        setLoading(false);
        onSuccess && onSuccess(null);
        onClose();
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Payment error:', err);
      }
      setLoading(false);
      onFailure && onFailure(err.message || 'Payment error');
    }
  };

  const displayAmount = (typeof amount === 'string' && amount) ? amount : ((typeof amount === 'number' ? amount : parseFloat(amount || '5'))?.toFixed(2) || '5.00');
  const secureCheckout = t?.paymentCheckout?.secureCheckout ?? 'Secure Checkout';
  const completeDonation = t?.paymentCheckout?.completeDonation ?? 'Complete your donation';
  const youreDonating = t?.paymentCheckout?.youreDonating ?? "You're donating";
  const toSupport = t?.paymentCheckout?.toSupport ?? 'to support pet privacy.';
  const orPayWithCard = t?.paymentCheckout?.orPayWithCard ?? 'Or pay with card';
  const payLabel = t?.paymentCheckout?.payAmount ?? 'Pay';

  const cardBg = darkMode ? 'bg-[#2d2d2d]/95' : 'bg-white';
  const cardBorder = darkMode ? 'border-primary/40' : 'border-gray-300';
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-[#b39ddb]/90' : 'text-text-secondary';
  const dividerBg = darkMode ? 'bg-[#2d2d2d]' : 'bg-white';
  const dividerCl = darkMode ? 'text-white/40' : 'text-gray-400';
  const btnCancelCl = darkMode ? 'border-white/30 text-white/80 hover:text-white hover:border-primary/50' : 'border-gray-400 text-text-secondary hover:text-text-main hover:border-primary';
  const btnPayCl = darkMode ? 'text-[#1a1a1a] bg-primary hover:bg-primary-dark border-primary' : 'text-white bg-primary hover:bg-primary-dark border-primary';

  return (
    <div className={`hand-drawn-border border-2 ${cardBorder} ${cardBg} backdrop-blur-md p-4 sm:p-5 lg:p-6 relative overflow-hidden rounded-[255px_15px_225px_15px/15px_225px_15px_255px]`}>
      {/* Decorative shield - smaller */}
      <div className={`absolute -top-4 -right-4 opacity-10 pointer-events-none -rotate-12 ${darkMode ? 'text-primary' : 'text-primary-dark'}`} aria-hidden>
        <span className="material-symbols-outlined text-6xl">shield_with_heart</span>
      </div>

      {/* Header: Secure Checkout badge + title + amount */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold font-display uppercase tracking-widest hand-drawn-border rotate-1 mb-2 ${darkMode ? 'text-primary-dark bg-primary/10 border-primary/50' : 'text-primary-dark bg-lavender border-primary/40'}`}>
          <span className="material-symbols-outlined text-xs">lock</span>
          {secureCheckout}
        </div>
        <h2 className={`text-xl sm:text-2xl font-bold font-display ${titleCl} mb-1`}>
          {completeDonation}
        </h2>
        <p className={`text-sm font-display italic ${mutedCl}`}>
          {youreDonating} <span className={darkMode ? 'text-white font-bold' : 'text-text-main font-bold'}>{displayAmount} CHF</span> {toSupport}
        </p>
      </div>

      {/* Stripe PaymentElement */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`relative flex items-center justify-center mb-4`}>
          <div className={`w-full border-t border-dashed ${darkMode ? 'border-white/10' : 'border-gray-200'}`} />
          <span className={`absolute px-3 ${dividerBg} font-display text-sm ${dividerCl}`}>
            {orPayWithCard}
          </span>
        </div>

        <div className="min-h-[120px]">
          <PaymentElement
            options={{
              layout: 'tabs',
              wallets: { applePay: 'auto', googlePay: 'auto' },
              paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'twint']
            }}
          />
        </div>

        {/* Actions: Cancel + Pay */}
        <div className={`flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-dashed ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`flex items-center gap-1.5 px-3 py-2 font-display font-bold text-base hand-drawn-button border-2 transition-colors ${btnCancelCl}`}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {t?.ui?.cancel || 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full sm:w-auto px-6 py-3 text-lg font-bold font-display hand-drawn-button border-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_0_0_rgba(149,117,205,0.6)] ${btnPayCl}`}
          >
            {loading ? (t?.ui?.processing ?? 'Processing…') : `${payLabel} ${displayAmount} CHF`}
          </button>
        </div>
      </form>

      {/* Trust: Secure Checkout + Stripe logo (no text) */}
      <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-tight ${darkMode ? 'text-white/60' : 'text-text-secondary'}`}>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-base sketch-icon-filled">verified_user</span>
          <span>{secureCheckout}</span>
        </div>
        <span className="opacity-50" aria-hidden>·</span>
        <div className="flex items-center justify-center" aria-hidden>
          <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width={60} height={25} className={`h-3.5 w-auto ${darkMode ? 'fill-white/70' : 'fill-[#0A2540]'}`} aria-hidden>
            <path fillRule="evenodd" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const getStripeLocale = (lang) => {
  const localeMap = { de: 'de', en: 'en', fr: 'fr', it: 'it', rm: 'de', ua: 'uk' };
  return localeMap[lang] || 'de';
};

export default function PaymentModal({ open, onClose, amount, onSuccess, onFailure, lang = 'de', t, darkMode = false }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);

  const stripeLocale = getStripeLocale(lang);
  const amountNum = Math.max(1, Math.round(parseFloat(amount || '5')));
  const amountStr = amountNum.toFixed(2);

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
          body: JSON.stringify({ amount: amountNum * 100, currency: 'chf' })
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          if (import.meta.env.DEV) console.error('Non-JSON response:', text.substring(0, 200));
          if (!mounted) return;
          alert('Payment error: Server returned HTML instead of JSON. Check API connection.');
          return;
        }

        const json = await res.json();
        if (!mounted) return;
        if (json.clientSecret) {
          setClientSecret(json.clientSecret);
          if (json.publishableKey) {
            setStripePromise(loadStripe(json.publishableKey, { locale: stripeLocale }));
          } else {
            const cfg = await fetch(API_ENDPOINTS.stripeConfig).then((r) => r.json());
            if (cfg.publishableKey) {
              setStripePromise(loadStripe(cfg.publishableKey, { locale: stripeLocale }));
            }
          }
        } else {
          alert(json.error || 'Failed to create payment intent');
        }
      } catch (err) {
        alert('Error creating payment: ' + (err?.message || err));
      }
    })();
    return () => { mounted = false; };
  }, [open, amountNum, stripeLocale]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg my-4 sm:my-6" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute -top-1 -right-1 z-10 flex items-center justify-center size-8 rounded-full border-2 transition-colors ${darkMode ? 'bg-gray-800 border-white/20 text-white/80 hover:text-white hover:border-primary/50' : 'bg-white border-gray-300 text-gray-600 hover:text-text-main hover:border-primary'}`}
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {clientSecret && stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              locale: stripeLocale,
              appearance: {
                theme: darkMode ? 'night' : 'stripe',
                variables: {
                  borderRadius: '12px',
                  fontFamily: 'Quicksand, system-ui, sans-serif',
                  colorPrimary: '#b39ddb',
                  colorBackground: darkMode ? '#1a1a1a' : '#ffffff',
                  colorText: darkMode ? '#ffffff' : '#4a4a4a',
                  colorDanger: '#ef4444',
                  spacingUnit: '4px'
                },
                rules: {
                  '.Input': {
                    padding: '10px 14px',
                    fontSize: '15px'
                  },
                  '.Label': {
                    marginBottom: '6px',
                    fontSize: '14px'
                  },
                  '.Tab': { borderRadius: '10px' }
                }
              }
            }}
          >
            <CheckoutForm
              clientSecret={clientSecret}
              onClose={onClose}
              onSuccess={onSuccess}
              onFailure={onFailure}
              t={t}
              amount={amountStr}
              darkMode={darkMode}
            />
          </Elements>
        ) : (
          <div className={`hand-drawn-border border-2 backdrop-blur-md p-8 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-center ${darkMode ? 'border-primary/40 bg-[#2d2d2d]/95' : 'border-primary/30 bg-white'}`}>
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mb-3 ${darkMode ? 'border-primary' : 'border-primary'}`} />
            <p className={darkMode ? 'text-primary/80 font-display text-base' : 'text-text-secondary font-display text-base'}>{t?.ui?.loading || 'Preparing payment…'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
