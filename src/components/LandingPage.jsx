import React from 'react';
import Button from './Button';
import { Flag, ArrowRight, ShieldCheck, Sparkles, Globe, CheckCircle2 } from 'lucide-react';
import Parallax from './Parallax';

const LandingPage = ({ t, setStep }) => (
  <div className="flex flex-col animate-in fade-in duration-700">
    <div className="relative isolate px-6 pt-4 lg:px-8 text-center pb-8 sm:pb-12">
      <div className="mx-auto max-w-2xl py-8 sm:py-12 fade-enter stagger-1 min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex flex-col justify-center">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 hover:bg-gray-50 transition-all cursor-default">
            <span className="flex items-center gap-2">
               <Flag size={14} className="text-red-600 fill-red-600" /> {t.landing.badge}
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4 leading-tight">
          {t.landing.heroTitle} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            {t.landing.heroTitleSuffix}
          </span>
        </h1>
        <p className="hero-sub mt-4 text-base text-gray-600 max-w-xl mx-auto">
          {t.landing.heroSub}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => setStep(1)} className="text-lg px-8 py-4 shadow-indigo-200">
            {t.landing.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
           <CheckCircle2 size={16} className="text-green-600" /> {t.landing.trust}
        </div>
      </div>

      <Parallax>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20 pointer-events-none">
          <div data-speed="0.12" className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
          <div data-speed="0.06" data-scroll="0.06" className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[20rem] -translate-x-1/2 rotate-[10deg] bg-gradient-to-tr from-[#a78bfa] to-[#60a5fa] opacity-40"></div>
        </div>
      </Parallax>
    </div>

    <div className="mx-auto max-w-5xl px-6 lg:px-8 pb-6 fade-enter stagger-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.landing.features.map((feat, i) => {
          const icons = [ShieldCheck, Sparkles, Globe];
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-glass">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <dt className="text-lg font-bold leading-7 text-gray-900 mb-2">{feat.title}</dt>
              <dd className="text-base leading-7 text-gray-600 flex-auto">{feat.desc}</dd>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default LandingPage;
