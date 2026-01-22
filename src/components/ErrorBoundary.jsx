import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development' || import.meta.env?.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallbackTitle, fallbackMessage } = this.props;

      return (
        <div className="flex flex-col items-center justify-center p-8 theme-card rounded-2xl border theme-border">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold theme-text mb-2">
            {fallbackTitle || 'Something went wrong'}
          </h3>
          <p className="text-sm theme-text-muted text-center mb-4 max-w-md">
            {fallbackMessage || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg theme-button-primary transition-all hover:scale-105"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
