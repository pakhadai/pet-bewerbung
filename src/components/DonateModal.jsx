import React from 'react';

export default function DonateModal({ open, onClose, amount, onDonate }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Support the project</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">✕</button>
        </div>
        <p className="text-sm text-slate-600 mb-4">Choose a payment method. Apple/Google Pay will be offered by Stripe Checkout when available on your device.</p>

        <div className="grid gap-3">
          <button className="py-3 px-4 rounded-lg border hover:bg-slate-50 text-left" onClick={() => onDonate('card')}>Pay with Card / Checkout — €{amount}</button>
          <button className="py-3 px-4 rounded-lg border hover:bg-slate-50 text-left" onClick={() => onDonate('twint')}>Pay with TWINT — €{amount}</button>
          <button className="py-3 px-4 rounded-lg border hover:bg-slate-50 text-left" onClick={() => onDonate('card')}>Apple Pay / Google Pay (via Checkout)</button>
        </div>

        <div className="mt-4 text-xs text-slate-500">Note: For Apple Pay you may need domain verification; on localhost the experience may vary.</div>
      </div>
    </div>
  );
}
