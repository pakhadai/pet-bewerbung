import React from 'react';
import { CreditCard, Smartphone, Sparkles, X, Heart } from 'lucide-react';

export default function DonateModal({ open, onClose, amount, onDonate, onOpenPayment }) {
  if (!open) return null;

  const paymentMethods = [
    {
      id: 'card',
      icon: CreditCard,
      label: 'Card / Checkout',
      description: 'Pay with Credit Card or Apple/Google Pay',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'twint',
      icon: Smartphone,
      label: 'TWINT',
      description: 'Swiss mobile payment',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'in-app',
      icon: Sparkles,
      label: 'Pay in-app',
      description: 'Card / Apple Pay / Google Pay',
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="theme-card rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary to-primary-hover p-8 text-white overflow-hidden">
          {/* Animated background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-300" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="relative flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <Heart size={48} className="fill-current" />
              </div>
              <Heart size={48} className="fill-current animate-pulse" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center mb-2">Support the Project</h3>
          <p className="text-white/90 text-center text-sm">Choose your payment method</p>

          {/* Amount badge */}
          <div className="mt-4 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30">
              <span className="text-2xl font-bold">{amount} CHF</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="p-6 space-y-3">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => {
                  if (method.id === 'in-app') {
                    onOpenPayment();
                  } else {
                    onDonate(method.id);
                  }
                }}
                className="group w-full p-4 rounded-2xl border-2 theme-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl theme-card animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon with gradient */}
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${method.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="theme-text font-bold text-base mb-1 group-hover:theme-text transition-colors">
                      {method.label}
                    </div>
                    <div className="theme-text-muted text-xs">
                      {method.description}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="w-5 h-5 theme-text-muted group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-6 pb-6">
          <div className="theme-info-box rounded-xl p-3 text-xs theme-text-muted text-center">
            💡 Apple Pay may require domain verification. Experience may vary on localhost.
          </div>
        </div>
      </div>
    </div>
  );
}
