import React from 'react';

export default function DonateModal({ open, onClose, amount, onDonate, onOpenPayment }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="theme-card rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="theme-text text-lg font-bold">Support the project</h3>
          <button onClick={onClose} className="theme-text-muted hover:theme-text transition-colors">✕</button>
        </div>
        <p className="theme-text-secondary text-sm mb-4">Choose a payment method. Apple/Google Pay will be offered by Stripe Checkout when available on your device.</p>

        <div className="grid gap-3">
          <button className="theme-radio theme-border py-3 px-4 rounded-lg border text-left transition-colors" onClick={() => onDonate('card')}>Pay with Card / Checkout — €{amount}</button>
          <button className="theme-radio theme-border py-3 px-4 rounded-lg border text-left transition-colors" onClick={() => onDonate('twint')}>Pay with TWINT — €{amount}</button>
          <button className="theme-radio theme-border py-3 px-4 rounded-lg border text-left transition-colors" onClick={() => onOpenPayment()}>Pay in-app (Card / Apple/Google Pay)</button>
        </div>

        <div className="theme-text-muted mt-4 text-xs">Note: For Apple Pay you may need domain verification; on localhost the experience may vary.</div>
      </div>
    </div>
  );
}
