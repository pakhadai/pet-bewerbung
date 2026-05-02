/**
 * AppContent Component
 * Static SPA - template-based text generation, PDF export.
 * No backend - all processing client-side.
 */

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useToastContext, useTranslationContext } from '../context/WizardProviders'
import { usePdfDownloadJob } from '../hooks/usePdfDownloadJob'
import { usePetDescriptionGeneration } from '../hooks/usePetDescriptionGeneration'
import { useZipDownloadJob } from '../hooks/useZipDownloadJob'
import BuilderRoute from '../routes/BuilderRoute'
import PrintRoute from '../routes/PrintRoute'
import { useFormStore } from '../stores/formStore'
import AppContainer from './AppContainer'

const selectData = (s: ReturnType<typeof useFormStore.getState>) => s.data

const AppContent: React.FC = () => {
  const data = useFormStore(selectData)
  const { t } = useTranslationContext()
  const { showToast } = useToastContext()
  const handleDownloadPDF = usePdfDownloadJob({ data, t, showToast })
  const handleDownloadAllTemplates = useZipDownloadJob({ data, t, showToast })
  const generateText = usePetDescriptionGeneration({ data, t, showToast })

  return (
    <Routes>
      <Route
        index
        element={
          <AppContainer
            onDownloadPDF={handleDownloadPDF}
            onDownloadAllTemplates={handleDownloadAllTemplates}
            onGenerateText={generateText}
          />
        }
      />
      <Route path="builder" element={<BuilderRoute onGenerateText={generateText} />} />
      <Route path="print" element={<PrintRoute />} />
      {/* Legacy wizard entry point (optional/back-compat) */}
      <Route path="wizard" element={<Navigate to="../builder" replace />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}

export default AppContent
