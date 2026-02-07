/**
 * Error Boundary Component
 * Catches React rendering errors and displays fallback UI
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '2rem auto',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
          }}
        >
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ marginBottom: '1rem', color: '#7f1d1d' }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '1rem' }}>
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#991b1b',
                  marginBottom: '0.5rem',
                }}
              >
                Error Details (Development Mode)
              </summary>
              <pre
                style={{
                  background: '#fff',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  color: '#991b1b',
                }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
