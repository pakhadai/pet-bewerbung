/**
 * Loading Spinner Component
 * Reusable loading indicator for async operations
 */

import React from 'react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

const sizeMap = {
  small: '24px',
  medium: '48px',
  large: '64px',
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'medium',
  fullScreen = false,
}) => {
  const spinnerSize = sizeMap[size]

  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90'
          : 'flex flex-col items-center justify-center p-8'
      }
    >
      <div
        className="animate-spin rounded-full border-4 border-gray-100 border-t-[color:var(--primary)]"
        style={{ width: spinnerSize, height: spinnerSize }}
        role="status"
        aria-live="polite"
      />
      {message && (
        <p className="mt-4 text-sm text-text-secondary text-center">{message}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
