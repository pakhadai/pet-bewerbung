import { useEffect } from 'react'

export const useSyncHtmlLang = (lang: string): void => {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
}

