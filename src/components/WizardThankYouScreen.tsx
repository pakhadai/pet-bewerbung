import { WizardProvider, type WizardContextValue } from '../context/WizardContext'
import ThankYouRoute from '../routes/ThankYouRoute'
import type { PetData, TemplateType } from '../types/form'
import type { TranslationObject } from '../types/template'
import type { LegalPageType } from './LegalPages'
import ModalsLayer from './ModalsLayer'

export interface WizardThankYouScreenProps {
  wizardContextValue: WizardContextValue
  t: TranslationObject
  darkMode: boolean
  data: PetData

  faqOpen: boolean
  setFaqOpen: (open: boolean) => void
  legalPage: LegalPageType
  setLegalPage: (page: LegalPageType) => void

  previewOpen: boolean
  previewTemplate: TemplateType
  closePreview: () => void
}

export default function WizardThankYouScreen({
  wizardContextValue,
  t,
  darkMode,
  data,
  faqOpen,
  setFaqOpen,
  legalPage,
  setLegalPage,
  previewOpen,
  previewTemplate,
  closePreview,
}: WizardThankYouScreenProps) {
  return (
    <>
      <WizardProvider value={wizardContextValue}>
        <ThankYouRoute onFaqClick={() => setFaqOpen(true)} />
      </WizardProvider>

      <ModalsLayer
        t={t}
        darkMode={darkMode}
        faqOpen={faqOpen}
        setFaqOpen={setFaqOpen}
        legalPage={legalPage}
        setLegalPage={setLegalPage}
        previewOpen={previewOpen}
        previewTemplate={previewTemplate}
        closePreview={closePreview}
        data={data}
        showLayoutModals={false}
      />
    </>
  )
}

