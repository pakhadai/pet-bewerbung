import React, { useEffect, useRef } from 'react';
import Button from './Button';
import { Flag, ArrowRight, ShieldCheck, Sparkles, Globe, CheckCircle2, Heart, Zap, Lock } from 'lucide-react';
import Parallax from './Parallax';

const LandingPage = ({ t, setStep }) => {
  const featuresRef = useRef(null);

  // Add stagger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (featuresRef.current) {
        featuresRef.current.classList.add('animate');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
  <div className="flex flex-col relative min-h-screen theme-bg">
    {/* Animated background gradients - cover full viewport */}
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-normal filter blur-3xl animate-blob morph-bg" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-2000 morph-bg" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-4000 morph-bg" />
    </div>

    <div className="relative isolate px-6 pt-4 lg:px-8 text-center pb-12 sm:pb-16">
      <div className="mx-auto max-w-3xl py-4 sm:py-6 min-h-[140px] sm:min-h-[160px] md:min-h-[200px] flex flex-col justify-center">

        {/* Main heading with gradient */}
        <h1 className="text-4xl font-bold tracking-tight theme-text sm:text-6xl mb-6 leading-tight text-reveal">
          {t.landing.heroTitle} <br/>
          <span className="relative inline-block mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 animate-gradient-x">
              {t.landing.heroTitleSuffix}
            </span>
            {/* Animated underline */}
            <span 
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full"
              style={{
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                animation: 'underlineGrow 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards'
              }}
            />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg theme-text-secondary max-w-2xl mx-auto leading-relaxed text-reveal text-reveal-delay-2">
          {t.landing.heroSub}
        </p>

        {/* CTA Button */}
        <div className="mt-10 flex items-center justify-center gap-x-6 text-reveal text-reveal-delay-3">
          <Button
            variant="primary"
            onClick={() => setStep(1)}
            className="group magnetic-btn cta-glow ripple text-lg px-8 py-4 shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl"
            style={{
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
            }}
          >
            {t.landing.cta}
            <ArrowRight 
              className="ml-2 w-5 h-5" 
              style={{
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </Button>
        </div>

        {/* Trust badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm theme-text-muted text-reveal text-reveal-delay-4">
          <div 
            className="flex items-center gap-2 theme-card theme-text px-4 py-2 rounded-full border theme-border shadow-sm smooth-card"
            style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <CheckCircle2 size={16} className="text-green-600" />
            {t.landing.trust}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <Parallax>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20 pointer-events-none">
          <div data-speed="0.12" className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-500/50 via-pink-500/50 to-purple-500/50" />
        </div>
      </Parallax>
    </div>

    {/* Keyframe for underline */}
    <style>{`
      @keyframes underlineGrow {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      .group:hover .arrow-icon {
        transform: translateX(8px);
      }
    `}</style>

    {/* Features Section */}
    <div className="mx-auto max-w-6xl px-6 lg:px-8 pb-24 sm:pb-32">
      <div ref={featuresRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {t.landing.features.map((feat, i) => {
          const icons = [
            { Icon: ShieldCheck, color: 'from-blue-500 to-cyan-400', glow: 'rgba(59, 130, 246, 0.3)' },
            { Icon: Sparkles, color: 'from-purple-500 to-pink-400', glow: 'rgba(168, 85, 247, 0.3)' },
            { Icon: Globe, color: 'from-green-500 to-emerald-400', glow: 'rgba(34, 197, 94, 0.3)' },
            { Icon: Heart, color: 'from-rose-500 to-pink-400', glow: 'rgba(244, 63, 94, 0.3)' },
            { Icon: Zap, color: 'from-amber-500 to-orange-400', glow: 'rgba(245, 158, 11, 0.3)' },
            { Icon: Lock, color: 'from-indigo-500 to-purple-400', glow: 'rgba(99, 102, 241, 0.3)' }
          ];
          const iconConfig = icons[i % icons.length];
          const Icon = iconConfig.Icon;

          return (
            <div
              key={i}
              className="group relative flex flex-col theme-card p-6 rounded-3xl shadow-lg border theme-border overflow-hidden cursor-pointer"
              style={{ 
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 32px 64px -16px rgba(0, 0, 0, 0.12), 0 0 48px ${iconConfig.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Animated gradient background on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${iconConfig.glow}, transparent 40%)`,
                  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Icon with gradient */}
              <div className="relative mb-5 flex">
                <div 
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${iconConfig.color} text-white shadow-lg icon-bounce`}
                  style={{
                    boxShadow: `0 8px 24px -4px ${iconConfig.glow}`,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>
              </div>

              {/* Content */}
              <dt 
                className="relative text-xl font-bold leading-7 theme-text mb-3"
                style={{
                  transition: 'color 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600">
                  {feat.title}
                </span>
              </dt>
              <dd className="relative text-base leading-7 theme-text-secondary flex-auto">
                {feat.desc}
              </dd>

              {/* Shine effect - ultra smooth */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.3s ease',
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none group-hover:translate-x-full"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>

  </div>
  );
};

export default LandingPage;
