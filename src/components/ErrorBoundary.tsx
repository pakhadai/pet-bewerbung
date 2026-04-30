/**
 * Error Boundary Component
 * Catches React rendering errors and displays fallback UI
 */

import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env?.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    this.setState({ error, errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const title = this.props.fallbackTitle || 'Etwas ist schiefgelaufen'
      const message =
        this.props.fallbackMessage ||
        'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'

      return (
        <div className="flex flex-col items-center justify-center p-8 theme-card rounded-2xl border theme-border">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold theme-text mb-2">{title}</h3>
          <p className="text-sm theme-text-muted text-center mb-4 max-w-md">{message}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg theme-button-primary transition-all hover:scale-105"
          >
            <RefreshCw size={16} />
            Erneut versuchen
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
