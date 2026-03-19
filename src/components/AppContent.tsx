/**
 * AppContent Component
 * Static SPA - template-based text generation, PDF export.
 * No backend, no AI - all processing client-side.
 */

import React, { useEffect, useRef } from 'react';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS } from '../constants';
import AppContainer from './AppContainer';
import { buildPdfTranslations } from '../services/pdfService';
import { downloadPdf, downloadAllTemplatesAsZip } from '../services/exportService';
import { useTranslationContext, useToastContext } from '../context/WizardProviders';
import { useFormStore } from '../stores/formStore';

const AppContent: React.FC = () => {
  const { data, updateData } = useFormStore();
  const { t } = useTranslationContext();
  const { showToast } = useToastContext();
  const prevLangRef = useRef(data.lang);

  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      showToast(t?.labels?.langChangeKeepText || 'Text bleibt erhalten.', 'info');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, showToast]);

  const generateText = () => {
    const tmpl = t?.templates || {};
    const rawKeywords = (data.keywords || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    let middleSection = '';
    if (rawKeywords.length > 0) {
      const formattedKeywords = rawKeywords.join(', ');
      middleSection = `${tmpl.keywords || 'Eigenschaften: '}${formattedKeywords}. `;
    }
    const petInfo = [data.name, data.breed].filter(Boolean).join(', ');
    const intro = petInfo ? `${petInfo} ist ein wunderbares Haustier. ` : (tmpl.intro || '');
    const fullText = `${intro}${middleSection}${tmpl.outro || ''}`;
    updateData('generatedText', fullText.slice(0, MAX_DESCRIPTION_LENGTH));
    showToast('✨ Text generiert!', 'success');
  };

  const handleDownloadPDF = async (templateType: string = 'classic') => {
    const pdfT = buildPdfTranslations(t);
    try {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      await downloadPdf(data, templateType, pdfT, {
        pdfSaveHint: t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"',
      });
      if (isIOS) {
        showToast(t?.labels?.pdfSaveHint || 'Tippen Sie auf "Teilen" → "In Dateien sichern"', 'info');
      } else {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        showToast(isMobile ? 'PDF downloaded!' : 'PDF downloaded successfully!', 'success');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (import.meta.env.DEV) console.error('PDF generation error:', err);
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('import')) {
        showToast(t?.ui?.pdfModuleError || 'Failed to load PDF module. Check your internet connection and try again.', 'error');
      } else if (errorMessage.includes('memory')) {
        showToast(t?.ui?.pdfMemoryError || 'PDF generation failed due to large image. Try reducing photo size.', 'error');
      } else if (errorMessage.includes('timeout')) {
        showToast(t?.ui?.pdfTimeoutError || 'PDF generation timed out. Please try again.', 'error');
      } else {
        showToast(t?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage, 'error');
      }
    }
  };

  const handleDownloadAllTemplates = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      showToast(t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert. Bitte einzelne Vorlagen herunterladen.', 'info');
      return;
    }
    showToast(t?.labels?.generatingZip || 'Generiere alle Vorlagen...', 'info');
    const pdfT = buildPdfTranslations(t);
    try {
      const { successCount, failedTemplates } = await downloadAllTemplatesAsZip(
        data,
        TEMPLATE_OPTIONS,
        pdfT,
        {
          zipMobileDisabled: t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert.',
          generatingZip: t?.labels?.generatingZip || 'Generiere alle Vorlagen...',
          zipDownloaded: t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!',
          zipError: t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs',
        }
      );
      if (failedTemplates.length > 0) {
        showToast(`${successCount}/${TEMPLATE_OPTIONS.length} templates generated. Failed: ${failedTemplates.join(', ')}`, 'warning');
      } else {
        showToast(t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!', 'success');
      }
    } catch (err: unknown) {
      if (import.meta.env.DEV) console.error('ZIP generation error:', err);
      showToast(t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs', 'error');
    }
  };

  return (
    <AppContainer
      onDownloadPDF={handleDownloadPDF}
      onDownloadAllTemplates={handleDownloadAllTemplates}
      onGenerateText={generateText}
    />
  );
};

export default AppContent;
