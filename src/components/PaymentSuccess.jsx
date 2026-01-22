import React, { useEffect, useState, useMemo } from 'react';
import { Heart, Home, Sparkles } from 'lucide-react';
import GlobalStyles from './GlobalStyles';
import Header from './Header';
import Footer from './Footer';
import LegalPages from './LegalPages';
import API_ENDPOINTS from '../config';

// Paw print SVG component
const PawPrint = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <ellipse cx="12" cy="17" rx="4" ry="3.5"/>
    <ellipse cx="6" cy="10" rx="2.5" ry="3"/>
    <ellipse cx="18" cy="10" rx="2.5" ry="3"/>
    <ellipse cx="9" cy="6" rx="2" ry="2.5"/>
    <ellipse cx="15" cy="6" rx="2" ry="2.5"/>
  </svg>
);

// Animated confetti particle
const Particle = ({ type, delay, duration, startX, color }) => {
  const style = {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--start-x': `${startX}vw`,
    '--color': color,
  };

  if (type === 'paw') {
    return <PawPrint className="confetti-particle confetti-paw" style={style} />;
  }
  if (type === 'heart') {
    return <Heart className="confetti-particle confetti-heart" style={style} />;
  }
  if (type === 'star') {
    return <Sparkles className="confetti-particle confetti-star" style={style} />;
  }
  return <div className="confetti-particle confetti-dot" style={style} />;
};

// Floating paw that rises up
const FloatingPaw = ({ delay, x, size, opacity }) => (
  <div
    className="floating-paw"
    style={{
      '--delay': `${delay}s`,
      '--x': `${x}%`,
      '--size': `${size}px`,
      '--opacity': opacity,
    }}
  >
    <PawPrint className="w-full h-full" />
  </div>
);

// Happy bouncing pet
const HappyPet = ({ type }) => {
  const pets = {
    dog: (
      <svg viewBox="0 0 100 100" className="happy-pet">
        {/* Dog body */}
        <ellipse cx="50" cy="65" rx="25" ry="20" fill="currentColor" className="pet-body"/>
        {/* Dog head */}
        <circle cx="50" cy="35" r="20" fill="currentColor" className="pet-head"/>
        {/* Ears */}
        <ellipse cx="35" cy="22" rx="8" ry="12" fill="currentColor" className="pet-ear-left"/>
        <ellipse cx="65" cy="22" rx="8" ry="12" fill="currentColor" className="pet-ear-right"/>
        {/* Eyes */}
        <circle cx="43" cy="32" r="4" fill="white"/>
        <circle cx="57" cy="32" r="4" fill="white"/>
        <circle cx="44" cy="33" r="2" fill="#333"/>
        <circle cx="58" cy="33" r="2" fill="#333"/>
        {/* Nose */}
        <ellipse cx="50" cy="42" rx="4" ry="3" fill="#333"/>
        {/* Tongue */}
        <ellipse cx="50" cy="48" rx="4" ry="6" fill="#ff6b9d" className="pet-tongue"/>
        {/* Tail */}
        <path d="M75 60 Q90 50 85 35" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" className="pet-tail"/>
        {/* Legs */}
        <rect x="32" y="78" width="8" height="15" rx="4" fill="currentColor"/>
        <rect x="60" y="78" width="8" height="15" rx="4" fill="currentColor"/>
      </svg>
    ),
    cat: (
      <svg viewBox="0 0 100 100" className="happy-pet happy-pet-cat">
        {/* Cat body */}
        <ellipse cx="50" cy="65" rx="22" ry="18" fill="currentColor" className="pet-body"/>
        {/* Cat head */}
        <circle cx="50" cy="38" r="18" fill="currentColor" className="pet-head"/>
        {/* Ears - triangular */}
        <polygon points="30,28 38,10 46,28" fill="currentColor" className="pet-ear-left"/>
        <polygon points="54,28 62,10 70,28" fill="currentColor" className="pet-ear-right"/>
        {/* Inner ears */}
        <polygon points="33,26 38,15 43,26" fill="#ffb6c1"/>
        <polygon points="57,26 62,15 67,26" fill="#ffb6c1"/>
        {/* Eyes */}
        <ellipse cx="43" cy="36" rx="5" ry="6" fill="#90EE90"/>
        <ellipse cx="57" cy="36" rx="5" ry="6" fill="#90EE90"/>
        <ellipse cx="43" cy="37" rx="2" ry="4" fill="#333"/>
        <ellipse cx="57" cy="37" rx="2" ry="4" fill="#333"/>
        {/* Nose */}
        <polygon points="50,44 47,48 53,48" fill="#ffb6c1"/>
        {/* Whiskers */}
        <line x1="25" y1="44" x2="40" y2="46" stroke="#333" strokeWidth="1"/>
        <line x1="25" y1="48" x2="40" y2="48" stroke="#333" strokeWidth="1"/>
        <line x1="60" y1="46" x2="75" y2="44" stroke="#333" strokeWidth="1"/>
        <line x1="60" y1="48" x2="75" y2="48" stroke="#333" strokeWidth="1"/>
        {/* Tail */}
        <path d="M72 62 Q88 55 92 40 Q94 35 90 38" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" className="pet-tail"/>
        {/* Legs */}
        <rect x="35" y="76" width="7" height="14" rx="3" fill="currentColor"/>
        <rect x="58" y="76" width="7" height="14" rx="3" fill="currentColor"/>
      </svg>
    )
  };
  return pets[type] || pets.dog;
};

const PaymentSuccess = ({
  data,
  t,
  theme,
  onThemeChange,
  onLangChange,
  onLogoClick,
  sessionId
}) => {
  const [legalPage, setLegalPage] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  // Generate confetti particles
  const confettiParticles = useMemo(() => {
    const particles = [];
    const colors = ['#ff6b9d', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ec4899'];
    const types = ['paw', 'heart', 'star', 'dot', 'paw', 'heart'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        type: types[i % types.length],
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
        startX: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return particles;
  }, []);

  // Generate floating paws
  const floatingPaws = useMemo(() => {
    const paws = [];
    for (let i = 0; i < 15; i++) {
      paws.push({
        id: i,
        delay: i * 0.8,
        x: 5 + Math.random() * 90,
        size: 20 + Math.random() * 30,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
    return paws;
  }, []);

  useEffect(() => {
    // Stop confetti after 8 seconds
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    fetch(API_ENDPOINTS.checkoutSession(sessionId))
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        if (data.session) {
          setPaymentData(data.session);
        }
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        if (import.meta.env.DEV) {
          console.error('Error fetching payment data:', err);
        }
        setLoading(false);
      });

    return () => { mounted = false; };
  }, [sessionId]);

  const handleGoHome = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.location.href = '/';
    }
  };

  const formatAmount = (amount, currency = 'chf') => {
    if (!amount) return 'N/A';
    const formatted = (amount / 100).toFixed(2);
    const currencyUpper = (currency || 'chf').toUpperCase();
    const currencySymbol = currencyUpper === 'CHF' ? 'CHF' : currencyUpper === 'EUR' ? '€' : currencyUpper;
    return `${formatted} ${currencySymbol}`;
  };

  // Determine pet type based on data or random
  const petType = data?.petType === 'cat' ? 'cat' : 'dog';

  return (
    <div className="min-h-screen theme-bg font-sans theme-text pb-6 print:bg-white print:p-0 overflow-hidden relative">
      <GlobalStyles theme={theme} />
      
      {/* Mega Animation Styles */}
      <style>{`
        /* Confetti falling animation */
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg) scale(0);
            opacity: 1;
          }
          10% {
            transform: translateY(-80vh) translateX(20px) rotate(72deg) scale(1);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(-20px) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
        
        .confetti-particle {
          position: fixed;
          top: -50px;
          left: var(--start-x);
          color: var(--color);
          animation: confettiFall var(--duration) ease-out var(--delay) infinite;
          z-index: 100;
          pointer-events: none;
        }
        
        .confetti-paw { width: 24px; height: 24px; }
        .confetti-heart { width: 20px; height: 20px; fill: var(--color); }
        .confetti-star { width: 22px; height: 22px; }
        .confetti-dot {
          width: 10px;
          height: 10px;
          background: var(--color);
          border-radius: 50%;
        }
        
        /* Floating paws rising */
        @keyframes pawRise {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity);
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(15deg);
          }
          90% {
            opacity: var(--opacity);
          }
          100% {
            transform: translateY(-20vh) translateX(-10px) rotate(-10deg);
            opacity: 0;
          }
        }
        
        .floating-paw {
          position: fixed;
          bottom: -100px;
          left: var(--x);
          width: var(--size);
          height: var(--size);
          color: rgba(168, 85, 247, var(--opacity));
          animation: pawRise 8s ease-in-out var(--delay) infinite;
          z-index: 5;
          pointer-events: none;
        }
        
        /* Happy pet bounce */
        @keyframes petBounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(-30px) scaleY(1.1); }
          50% { transform: translateY(-40px) scaleY(1); }
          70% { transform: translateY(-20px) scaleY(0.95); }
        }
        
        @keyframes tailWag {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        
        @keyframes earWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes tongueWiggle {
          0%, 100% { transform: scaleY(1) translateY(0); }
          50% { transform: scaleY(1.3) translateY(2px); }
        }
        
        .happy-pet {
          width: 150px;
          height: 150px;
          color: #f59e0b;
          animation: petBounce 1s ease-in-out infinite;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
        }
        
        .happy-pet-cat {
          color: #94a3b8;
        }
        
        .pet-tail {
          transform-origin: 75px 60px;
          animation: tailWag 0.3s ease-in-out infinite;
        }
        
        .pet-ear-left {
          transform-origin: 35px 22px;
          animation: earWiggle 0.5s ease-in-out infinite;
        }
        
        .pet-ear-right {
          transform-origin: 65px 22px;
          animation: earWiggle 0.5s ease-in-out infinite 0.1s;
        }
        
        .pet-tongue {
          animation: tongueWiggle 0.5s ease-in-out infinite;
        }
        
        /* Gradient background animation */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animated-gradient-bg {
          background: linear-gradient(-45deg, 
            rgba(168, 85, 247, 0.1), 
            rgba(236, 72, 153, 0.1), 
            rgba(59, 130, 246, 0.1), 
            rgba(34, 197, 94, 0.1)
          );
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
        
        /* Sparkle burst */
        @keyframes sparkleBurst {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.8; }
        }
        
        .sparkle {
          position: absolute;
          animation: sparkleBurst 2s ease-out forwards;
        }
        
        /* Success ring pulse */
        @keyframes successRingPulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        .success-ring {
          animation: successRingPulse 2s ease-out infinite;
        }
        
        /* Gentle pulse for logo background */
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        /* Heart float */
        @keyframes heartFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        
        .floating-heart {
          animation: heartFloat 2s ease-in-out infinite;
        }
        
        /* Celebration text */
        @keyframes celebrationText {
          0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        .celebration-text {
          animation: celebrationText 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 animated-gradient-bg pointer-events-none" />
      
      {/* Confetti particles */}
      {showConfetti && confettiParticles.map(p => (
        <Particle key={p.id} {...p} />
      ))}
      
      {/* Floating paws */}
      {floatingPaws.map(p => (
        <FloatingPaw key={p.id} {...p} />
      ))}
      
      <Header
        step={null}
        theme={theme}
        onThemeChange={onThemeChange}
        lang={data?.lang || 'de'}
        onLangChange={onLangChange}
        onLogoClick={onLogoClick}
        t={t}
      />

      <main className="w-full max-w-2xl mx-auto py-12 text-center px-4 relative z-10">
        
        {/* Logo with gentle pulsing circle */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex items-center justify-center">
            {/* Gentle pulsing green circle */}
            <div 
              className="absolute rounded-full"
              style={{ 
                width: '160px', 
                height: '160px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15))',
                animation: 'gentlePulse 3s ease-in-out infinite'
              }} 
            />
            <div 
              className="absolute rounded-full"
              style={{ 
                width: '140px', 
                height: '140px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))',
                animation: 'gentlePulse 3s ease-in-out infinite 0.5s'
              }} 
            />

            {/* Main logo - static */}
            <img 
              src="/logo.png" 
              alt="Pet-Bewerbung Logo" 
              className="relative w-28 h-28 object-contain z-10 drop-shadow-lg"
            />
          </div>
        </div>

        {/* Celebration title */}
        <h2 className="text-4xl sm:text-5xl font-black mb-4 celebration-text"
            style={{ 
              background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
          🎉 {t?.paymentSuccess?.title || 'Vielen Dank!'} 🎉
        </h2>
        
        <p className="text-xl theme-text-secondary mb-8 celebration-text" style={{ animationDelay: '0.3s' }}>
          {t?.paymentSuccess?.message || 'Ihre Spende hilft Haustieren, ein Zuhause zu finden!'}
        </p>

        {/* Floating hearts decoration */}
        <div className="flex justify-center gap-4 mb-8">
          <Heart className="floating-heart text-pink-400 fill-pink-400" size={32} style={{ animationDelay: '0s' }} />
          <PawPrint className="floating-heart text-purple-400" style={{ width: 32, height: 32, animationDelay: '0.3s' }} />
          <Heart className="floating-heart text-red-400 fill-red-400" size={28} style={{ animationDelay: '0.6s' }} />
          <PawPrint className="floating-heart text-amber-400" style={{ width: 30, height: 30, animationDelay: '0.9s' }} />
          <Heart className="floating-heart text-pink-500 fill-pink-500" size={26} style={{ animationDelay: '1.2s' }} />
        </div>

        {/* Payment details card */}
        {paymentData && (
          <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 rounded-3xl p-8 border border-white/20 mb-8 shadow-2xl"
               style={{ animation: 'slideUpFade 0.6s ease-out 0.5s both' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold theme-text">
                {t?.paymentSuccess?.detailsTitle || 'Zahlungsdetails'}
              </h3>
            </div>
            
            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="theme-text-muted">{t?.paymentSuccess?.amount || 'Betrag'}:</span>
                <span className="font-bold text-xl" style={{ color: '#22c55e' }}>
                  {formatAmount(paymentData.amountTotal, paymentData.currency)}
                </span>
              </div>
              {paymentData.customerEmail && (
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="theme-text-muted">{t?.paymentSuccess?.email || 'E-Mail'}:</span>
                  <span className="theme-text">{paymentData.customerEmail}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3">
                <span className="theme-text-muted">{t?.paymentSuccess?.status || 'Status'}:</span>
                <span className="px-4 py-2 rounded-full text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
                  ✓ {t?.paymentSuccess?.completed || 'Erfolgreich'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Thank you card with pet theme */}
        <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 rounded-3xl p-8 border border-white/20 mb-8 shadow-2xl"
             style={{ animation: 'slideUpFade 0.6s ease-out 0.7s both' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🐕</span>
            <Heart className="text-red-500 fill-red-500 floating-heart" size={28} />
            <span className="text-3xl">🐈</span>
          </div>
          <h3 className="text-2xl font-bold mb-4"
              style={{ 
                background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            {t?.paymentSuccess?.thankYouTitle || 'Von Herzen Danke!'}
          </h3>
          <p className="theme-text-muted max-w-md mx-auto text-lg">
            {t?.paymentSuccess?.thankYouMessage || 
              'Dank Ihrer Unterstützung können wir diesen Service weiter verbessern und noch mehr Haustieren helfen, ein liebevolles Zuhause zu finden!'}
          </p>
        </div>

        {/* Action button */}
        <div style={{ animation: 'slideUpFade 0.6s ease-out 0.9s both' }}>
          <button
            onClick={handleGoHome}
            className="group relative px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-2xl overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              <Home size={24} />
              {t?.paymentSuccess?.goHome || 'Zurück zur Startseite'}
              <PawPrint className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
        
      </main>

      <Footer step={9} t={t} onOpenLegal={setLegalPage} />
      <LegalPages t={t} openPage={legalPage} onClose={() => setLegalPage(null)} />
    </div>
  );
};

export default PaymentSuccess;
