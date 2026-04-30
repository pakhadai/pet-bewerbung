import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslationContext } from '../context/WizardProviders'
import { type Language, SUPPORTED_LANGS } from '../hooks/useTranslation'
import { useFormStore } from '../stores/formStore'

const validLang = new Set<string>(SUPPORTED_LANGS)

/**
 * Keeps UI language + form `lang` in sync with the URL segment /:lang/
 * and redirects unknown locales to /de/.
 */
function RouteLangSync() {
  const { lang: param } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const { lang, setLang } = useTranslationContext()
  const updateData = useFormStore((s) => s.updateData)

  useEffect(() => {
    const raw = param ?? ''
    if (!validLang.has(raw)) {
      navigate('/de/', { replace: true })
      return
    }
    const next = raw as Language
    if (lang !== next) {
      setLang(next)
      updateData('lang', next)
    }
  }, [param, lang, setLang, navigate, updateData])

  return null
}

export default RouteLangSync
