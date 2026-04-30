/**
 * HeroRoute Component
 * Landing page (step 0)
 * Shows hero section and feature overview
 */

import React from 'react'
import Hero from '../components/Hero'
import LandingFaqPreview from '../components/LandingFaqPreview'
import LandingSeoSection from '../components/LandingSeoSection'
import MaterialIcon from '../components/MaterialIcon'
import Steps from '../components/Steps'
import type { TranslationObject } from '../types/template'

interface HeroRouteProps {
  darkMode: boolean
  t: TranslationObject
  onStartClick: () => void
  onOpenFaq: () => void
}

export const HeroRoute: React.FC<HeroRouteProps> = ({ darkMode, t, onStartClick, onOpenFaq }) => {
  return (
    <div className="page page-enter-right reveal fade-enter flex flex-col items-center pt-28 pb-16 relative overflow-hidden">
      <div
        className={`absolute top-[15%] left-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}
      >
        <MaterialIcon name="pets" className="text-8xl rotate-12 select-none" />
      </div>
      <div
        className={`absolute bottom-[20%] right-[5%] opacity-10 pointer-events-none hidden lg:block transition-opacity duration-300 ${darkMode ? 'opacity-5' : 'opacity-10'}`}
      >
        <MaterialIcon name="favorite" className="text-9xl -rotate-12 select-none" />
      </div>
      <div className="w-full max-w-6xl flex flex-col items-center text-center z-10 gap-12 sm:gap-16">
        <Hero darkMode={darkMode} t={t} onStartClick={onStartClick} />
        <Steps darkMode={darkMode} t={t} />
        <LandingSeoSection darkMode={darkMode} t={t} />
        <LandingFaqPreview darkMode={darkMode} t={t} onOpenFullFaq={onOpenFaq} />
      </div>
    </div>
  )
}

export default HeroRoute
