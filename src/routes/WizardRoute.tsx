/**
 * WizardRoute Component
 * Handles rendering of wizard steps (1-6)
 * Uses WizardContext for data, updateData, t, darkMode, animDir
 */
import React from 'react';
import {
  Step1Details,
  Step2HealthInsurance,
  Step3Description,
  Step4Photo,
  Step5TemplateSelect,
  Step5Preview,
} from '../components/steps/index';

interface WizardRouteProps {
  step: number;
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onGenerateText: () => Promise<void>;
  onDownloadPDF: () => Promise<void>;
  onDownloadAllTemplates: () => Promise<void>;
  onNavigationVisibilityChange: (visible: boolean) => void;
  canGenerateAI?: boolean;
  remainingGenerations?: number;
}

export const WizardRoute: React.FC<WizardRouteProps> = ({
  step,
  selectedTemplate,
  onSelectTemplate,
  showToast,
  onGenerateText,
  onDownloadPDF,
  onDownloadAllTemplates,
  onNavigationVisibilityChange,
  canGenerateAI = true,
  remainingGenerations = 5,
}) => {
  switch (step) {
    case 1:
      return <Step1Details />;
    case 2:
      return <Step2HealthInsurance />;
    case 3:
      return (
        <Step3Description
          onGenerate={onGenerateText}
          canGenerateAI={canGenerateAI}
          remainingGenerations={remainingGenerations}
        />
      );
    case 4:
      return (
        <Step4Photo
          onNavigationVisibilityChange={onNavigationVisibilityChange}
          showToast={showToast}
        />
      );
    case 5:
      return (
        <Step5TemplateSelect
          selectedTemplate={selectedTemplate}
          onSelectTemplate={onSelectTemplate}
          showToast={showToast}
        />
      );
    case 6:
      return (
        <Step5Preview
          selectedTemplate={selectedTemplate}
          onDownloadPDF={onDownloadPDF}
          onDownloadAllTemplates={onDownloadAllTemplates}
        />
      );
    default:
      return null;
  }
};

export default WizardRoute;
