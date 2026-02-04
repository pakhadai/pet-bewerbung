import React, { useState, useEffect } from 'react';
import { Crown, Clock } from 'lucide-react';

/**
 * Premium Timer Component
 * Shows countdown timer when premium session is active
 * 
 * @param {Object} props
 * @param {number} props.timeRemaining - Time remaining in milliseconds
 * @param {boolean} props.isPremium - Whether premium is active
 * @param {Object} props.t - Translations object
 * @param {boolean} props.darkMode - Dark mode flag
 * @param {function} props.onExpired - Callback when timer expires
 */
const PremiumTimer = ({ timeRemaining, isPremium, t, darkMode, onExpired }) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  
  // Update display time every second
  useEffect(() => {
    if (!isPremium || timeRemaining <= 0) {
      setDisplayTime(0);
      return;
    }
    
    setDisplayTime(timeRemaining);
    
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        const newTime = Math.max(0, prev - 1000);
        if (newTime === 0 && onExpired) {
          onExpired();
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPremium, timeRemaining, onExpired]);
  
  // Don't render if not premium or no time remaining
  if (!isPremium || displayTime <= 0) {
    return null;
  }
  
  // Format time remaining
  const hours = Math.floor(displayTime / (1000 * 60 * 60));
  const minutes = Math.floor((displayTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((displayTime % (1000 * 60)) / 1000);
  
  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };
  
  // Warning state when less than 10 minutes remaining
  const isWarning = displayTime < 10 * 60 * 1000;
  const isCritical = displayTime < 2 * 60 * 1000;
  
  return (
    <div 
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all
        ${isCritical 
          ? 'bg-red-500/20 text-red-500 animate-pulse' 
          : isWarning 
            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
            : darkMode 
              ? 'bg-purple-500/20 text-purple-300' 
              : 'bg-purple-100 text-purple-700'
        }
      `}
      title={t?.premium?.sessionInfo || 'Premium-Sitzung aktiv'}
    >
      <Crown size={14} className={isCritical ? 'animate-bounce' : ''} />
      <span className="flex items-center gap-1">
        <Clock size={12} />
        {formatTime()}
      </span>
    </div>
  );
};

export default PremiumTimer;
