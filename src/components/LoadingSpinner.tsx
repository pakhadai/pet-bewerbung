/**
 * Loading Spinner Component
 * Reusable loading indicator for async operations
 */

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const sizeMap = {
  small: '24px',
  medium: '48px',
  large: '64px',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'medium',
  fullScreen = false,
}) => {
  const spinnerSize = sizeMap[size];

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      };

  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `4px solid #f3f4f6`,
    borderTop: `4px solid #3b82f6`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} role="status" aria-live="polite" />
      {message && (
        <p
          style={{
            marginTop: '1rem',
            color: '#6b7280',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
