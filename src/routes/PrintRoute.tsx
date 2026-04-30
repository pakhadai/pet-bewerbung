import { lazy, Suspense, useEffect, useMemo, useRef } from 'react'
import { useTranslationContext } from '../context/WizardProviders'
import { useFormStore } from '../stores/formStore'

const SwissDocument = lazy(() => import('../components/SwissDocument'))

export default function PrintRoute() {
  const { t } = useTranslationContext()
  const data = useFormStore((s) => s.data)
  const isLoading = useFormStore((s) => s.isLoading)

  const templateType = useMemo(() => {
    return data.selectedTemplate ?? 'classic'
  }, [data])

  const hasPrintedRef = useRef(false)

  useEffect(() => {
    if (isLoading) return
    if (hasPrintedRef.current) return

    // One tick to allow layout + fonts to settle.
    const id = window.setTimeout(() => {
      hasPrintedRef.current = true
      window.print()
    }, 50)

    return () => window.clearTimeout(id)
  }, [isLoading])

  return (
    <div className="min-h-screen bg-white">
      {/* No app chrome here — document only */}
      <div
        className="mx-auto"
        style={{
          width: '210mm',
          minHeight: '297mm',
        }}
      >
        <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading…</div>}>
          <SwissDocument data={data} t={t} templateType={templateType} />
        </Suspense>
      </div>
    </div>
  )
}
