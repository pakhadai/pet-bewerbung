import React from 'react';
import Button from './Button';
import { Flag, ArrowRight, ShieldCheck, Sparkles, Globe, CheckCircle2, Heart, Zap, Lock } from 'lucide-react';
import Parallax from './Parallax';

const LandingPage = ({ t, setStep }) => (
  <div className="flex flex-col relative min-h-screen theme-bg">
    {/* Animated background gradients - cover full viewport */}
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-normal filter blur-3xl animate-blob" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-normal filter blur-3xl animate-blob animation-delay-4000" />
    </div>

    <div className="relative isolate px-6 pt-4 lg:px-8 text-center pb-12 sm:pb-16">
      <div className="mx-auto max-w-3xl py-4 sm:py-6 min-h-[140px] sm:min-h-[160px] md:min-h-[200px] flex flex-col justify-center">

        {/* Main heading with gradient */}
        <h1 className="text-4xl font-bold tracking-tight theme-text sm:text-6xl mb-6 leading-tight animate-in slide-in-from-bottom-8 duration-700 delay-200">
          {t.landing.heroTitle} <br/>
          <span className="relative inline-block mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 animate-gradient-x">
              {t.landing.heroTitleSuffix}
            </span>
            {/* Animated underline */}
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-full animate-in slide-in-from-left-full duration-1000 delay-500" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg theme-text-secondary max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-700 delay-400">
          {t.landing.heroSub}
        </p>

        {/* CTA Button */}
        <div className="mt-10 flex items-center justify-center gap-x-6 animate-in zoom-in duration-500 delay-600">
          <Button
            variant="primary"
            onClick={() => setStep(1)}
            className="group text-lg px-8 py-4 shadow-xl hover:shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
          >
            {t.landing.cta}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </div>

        {/* Trust badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm theme-text-muted animate-in fade-in duration-700 delay-700">
          <div className="flex items-center gap-2 theme-card theme-text px-4 py-2 rounded-full border theme-border shadow-sm">
            <CheckCircle2 size={16} className="text-green-600" />
            {t.landing.trust}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <Parallax>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20 pointer-events-none">
          <div data-speed="0.12" className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-500/50 via-pink-500/50 to-purple-500/50 animate-pulse" />
        </div>
      </Parallax>
    </div>

    {/* Features Section */}
    <div className="mx-auto max-w-6xl px-6 lg:px-8 pb-12 sm:pb-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.landing.features.map((feat, i) => {
          const icons = [
            { Icon: ShieldCheck, color: 'from-blue-400 to-cyan-400' },
            { Icon: Sparkles, color: 'from-purple-400 to-pink-400' },
            { Icon: Globe, color: 'from-green-400 to-emerald-400' },
            { Icon: Heart, color: 'from-rose-400 to-pink-400' },
            { Icon: Zap, color: 'from-yellow-400 to-orange-400' },
            { Icon: Lock, color: 'from-indigo-400 to-purple-400' }
          ];
          const iconConfig = icons[i % icons.length];
          const Icon = iconConfig.Icon;

          return (
            <div
              key={i}
              className="group relative flex flex-col theme-card p-6 rounded-3xl shadow-lg border theme-border hover:shadow-2xl transition-all duration-500 overflow-hidden animate-in slide-in-from-bottom-8 hover:scale-105 hover:theme-card-bg-hover"
              style={{ animationDelay: `${800 + i * 150}ms` }}
            >
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon with gradient */}
              <div className="relative mb-4 flex">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${iconConfig.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
              </div>

              {/* Content */}
              <dt className="relative text-xl font-bold leading-7 theme-text mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                {feat.title}
              </dt>
              <dd className="relative text-base leading-7 theme-text-secondary flex-auto">
                {feat.desc}
              </dd>

              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          );
        })}
      </div>
    </div>

  </div>
);

export default LandingPage;
