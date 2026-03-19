/**
 * AppContent Component
 * UI orchestrator - delegates business logic to services.
 * - aiService: AI text generation
 * - pdfService: PDF translations, photo prep
 * - exportService: PDF download, ZIP export
 */

import React, { useState, useRef, useEffect } from 'react';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS } from '../constants';
import AppContainer from './AppContainer';
import { generatePetDescription } from '../services/aiService';
import { buildPdfTranslations } from '../services/pdfService';
import { downloadPdf, downloadAllTemplatesAsZip } from '../services/exportService';
import { useFormDataContext, useTranslationContext, useAIGenerationContext, useToastContext } from '../context/WizardProviders';
import { useCsrf } from '../hooks';

const AppContent: React.FC = () => {
  const { data, updateData } = useFormDataContext();
  const { t } = useTranslationContext();
  const { showToast } = useToastContext();
  const { canGenerate: canGenerateAI, remainingGenerations, incrementGeneration } = useAIGenerationContext();
  const { token: csrfToken, isFatal: csrfFatal } = useCsrf();

  const [isGenerating, setIsGenerating] = useState(false);
  const prevLangRef = useRef(data.lang);

  // Notify when language changes - keep text, user can regenerate if needed
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      showToast(
        t?.labels?.langChangeKeepText || 'Text bleibt erhalten. Bei Bedarf neu generieren.',
        'info'
      );
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText, showToast]);

  // Generate fallback template-based text
  const generateFallbackText = () => {
    const tmpl = t?.templates || {};
    const rawKeywords = (data.keywords || '').split(',').map((s: string) => s.trim()).filter((s: string) => s);
    let middleSection = '';
    if (rawKeywords.length > 0) {
      const formattedKeywords = rawKeywords.join(', ');
      middleSection = `${tmpl.keywords || 'Eigenschaften: '}${formattedKeywords}. `;
    }
    const petInfo = [data.name, data.breed].filter(Boolean).join(', ');
    const intro = petInfo ? `${petInfo} ist ein wunderbares Haustier. ` : (tmpl.intro || '');
    const fullText = `${intro}${middleSection}${tmpl.outro || ''}`;
    updateData('generatedText', fullText.slice(0, MAX_DESCRIPTION_LENGTH));
  };

  // Generate AI text description
  const generateText = async () => {
    if (isGenerating) {
      if (import.meta.env.DEV) console.warn('⚠️  AI generation already in progress');
      return;
    }

    if (!canGenerateAI) {
      showToast(
        t?.labels?.aiLimitReached || 'AI limit erreicht. Versuchen Sie es morgen wieder.',
        'info'
      );
      generateFallbackText();
      return;
    }

    if (!csrfToken) {
      if (csrfFatal) {
        showToast(
          t?.ui?.connectionError || 'Verbindungsfehler. Bitte Seite neu laden oder erneut versuchen.',
          'error'
        );
      } else {
        showToast(
          t?.ui?.csrfLoading || 'Sicherheitstoken wird geladen. Bitte kurz warten.',
          'info'
        );
      }
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generatePetDescription({
        petData: {
          petName: data.name || '',
          petType: data.petType || '',
          breed: data.breed || '',
          age: data.age || '',
          gender: data.gender || '',
          weight: data.weight || '',
          traits: data.keywords || '',
          neutered: data.isNeutered || false,
          vaccinated: data.hasVaccination || false,
        },
        lang: data.lang,
        tone: data.aiTone || 'formal',
        csrfToken,
      });

      incrementGeneration();
      updateData('generatedText', result.description);

      if (result.remaining !== undefined) {
        showToast(`✨ ${result.remaining} AI-Anfragen heute übrig.`, 'success');
      } else {
        showToast('✨ AI-Text generiert!', 'success');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const status = (err as { status?: number })?.status;

      if (errorMessage === 'AI_SERVICE_UNAVAILABLE') {
        generateFallbackText();
        showToast('Using template (AI not available)', 'info');
        return;
      }

      // 429 rate limit - don't replace text with fallback
      if (errorMessage.includes('limit') || errorMessage.includes('429')) {
        showToast(errorMessage, 'error');
        return;
      }

      // 400 validation error - show server message, don't mask as "AI failed"
      if (status === 400) {
        showToast(errorMessage, 'error');
        return;
      }

      if (import.meta.env.DEV) console.error('AI generation error:', err);

      showToast(
        errorMessage.includes('network') || errorMessage.includes('fetch')
          ? t?.labels?.aiNetworkError || 'Network error. Please check your connection and try again.'
          : t?.labels?.aiError || 'AI generation failed. Using template instead.',
        'error'
      );

      generateFallbackText();
    } finally {
      setIsGenerating(false);
    }
  };

  // Download PDF (templateType from AppContainer/selectedTemplate)
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
        showToast(
          t?.ui?.pdfModuleError || 'Failed to load PDF module. Check your internet connection and try again.',
          'error'
        );
      } else if (errorMessage.includes('memory')) {
        showToast(
          t?.ui?.pdfMemoryError || 'PDF generation failed due to large image. Try reducing photo size.',
          'error'
        );
      } else if (errorMessage.includes('timeout')) {
        showToast(
          t?.ui?.pdfTimeoutError || 'PDF generation timed out. Please try again.',
          'error'
        );
      } else {
        showToast(
          t?.ui?.pdfError || 'Failed to download PDF: ' + errorMessage,
          'error'
        );
      }
    }
  };

  // Download all templates as ZIP (disabled on mobile - OOM risk)
  const handleDownloadAllTemplates = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      showToast(
        t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert. Bitte einzelne Vorlagen herunterladen.',
        'info'
      );
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
          zipMobileDisabled: t?.labels?.zipMobileDisabled ?? 'ZIP-Download auf Mobilgeräten deaktiviert. Bitte einzelne Vorlagen herunterladen.',
          generatingZip: t?.labels?.generatingZip || 'Generiere alle Vorlagen...',
          zipDownloaded: t?.premium?.zipDownloaded || 'ZIP mit allen Vorlagen heruntergeladen!',
          zipError: t?.labels?.zipError || 'Fehler beim Erstellen des ZIP-Archivs',
        }
      );

      if (failedTemplates.length > 0) {
        const msg = `${successCount}/${TEMPLATE_OPTIONS.length} templates generated. Failed: ${failedTemplates.join(', ')}`;
        showToast(msg, 'warning');
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
      canGenerateAI={canGenerateAI}
      remainingGenerations={remainingGenerations}
    />
  );
};

export default AppContent;
