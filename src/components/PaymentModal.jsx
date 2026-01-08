import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm({ clientSecret, paymentIntentId, onClose, onSuccess, onFailure }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const pollStatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:4242/payment-status/${id}`);
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
      <PaymentElement />
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 rounded-lg border">Cancel</button>
        <button disabled={!stripe} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">{loading ? 'Processing…' : 'Pay'}</button>
      </div>
    </form>
  );
}

export default function PaymentModal({ open, onClose, amount, onSuccess, onFailure }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('http://localhost:4242/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.max(1, Math.round(parseFloat(amount || '5'))) * 100, currency: 'eur' }),
        });
        const json = await res.json();
        if (!mounted) return;
        if (json.clientSecret) {
          setClientSecret(json.clientSecret);
          if (json.publishableKey) setStripePromise(loadStripe(json.publishableKey));
          if (json.paymentIntentId) setPaymentIntentId(json.paymentIntentId);
          else {
            const cfg = await fetch('http://localhost:4242/stripe-config').then(r => r.json());
            if (cfg.publishableKey) setStripePromise(loadStripe(cfg.publishableKey));
          }
        } else {
          alert(json.error || 'Failed to create payment intent');
        }
      } catch (err) {
        alert('Error creating payment: ' + (err.message || err));
      }
    })();
    return () => { mounted = false; };
  }, [open, amount]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Pay €{amount}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
        </div>
        <div>
          {clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
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
