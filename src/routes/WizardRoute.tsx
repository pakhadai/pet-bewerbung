/**
 * WizardRoute Component
 * Handles rendering of wizard steps (1-6)
 * Manages transitions between steps with animations
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
import { PetData } from '../types';

interface WizardRouteProps {
  step: number;
  animDir: string;
  data: PetData;
  updateData: (key: string, value: any) => void;
  t: any;
  darkMode: boolean;
  isPremium: boolean;
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onGenerateText: () => Promise<void>;
  onDownloadPDF: () => Promise<void>;
  onBuyPremium: () => void;
  getTemplateInfo: (templateId: string) => any;
  premiumPrice: number;
  onDownloadAllTemplates: () => Promise<void>;
  onOpenBuilder: () => void;
  onNavigationVisibilityChange: (visible: boolean) => void;
}

export const WizardRoute: React.FC<WizardRouteProps> = ({
  step,
  animDir,
  data,
  updateData,
  t,
  darkMode,
  isPremium,
  selectedTemplate,
  onSelectTemplate,
  showToast,
  onGenerateText,
  onDownloadPDF,
  onBuyPremium,
  getTemplateInfo,
  premiumPrice,
  onDownloadAllTemplates,
  onOpenBuilder,
  onNavigationVisibilityChange,
}) => {
  switch (step) {
    case 1:
      return (
        <Step1Details
          animDir={animDir}
          errors={{}}
        />
      );

    case 2:
      return (
        <Step2HealthInsurance
          data={data}
          updateData={updateData}
          t={t}
          animDir={animDir}
          darkMode={darkMode}
        />
      );

    case 3:
      return (
        <Step3Description
          data={data}
          updateData={updateData}
          t={t}
          animDir={animDir}
          darkMode={darkMode}
          isGenerating={false}
          onGenerate={onGenerateText}
          isPremium={isPremium}
          canGenerateAI={true}
          remainingGenerations={0}
          premiumToken={null}
          deviceId=""
          onMagicRewrite={(status: string, error?: string) => {
            if (status === 'success') {
              showToast(t?.premium?.rewriteSuccess || 'Text verbessert!', 'success');
            } else if (error) {
              showToast(error, 'error');
            }
          }}
        />
      );

    case 4:
      return (
        <Step4Photo
          data={data}
          updateData={updateData}
          t={t}
          animDir={animDir}
          onNavigationVisibilityChange={onNavigationVisibilityChange}
          darkMode={darkMode}
        />
      );

    case 5:
      return (
        <Step5TemplateSelect
          data={data}
          t={t}
          animDir={animDir}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={onSelectTemplate}
          showToast={showToast}
          darkMode={darkMode}
          isPremium={isPremium}
          getTemplateInfo={getTemplateInfo}
        />
      );

    case 6:
      return (
        <Step5Preview
          data={data}
          t={t}
          animDir={animDir}
          selectedTemplate={selectedTemplate}
          darkMode={darkMode}
          isPremium={isPremium}
          getTemplateInfo={getTemplateInfo}
          onDownloadPDF={onDownloadPDF}
          onBuyPremium={onBuyPremium}
          premiumPrice={premiumPrice}
          onDownloadAllTemplates={onDownloadAllTemplates}
          onSelectFreeTemplate={() => onSelectTemplate('classic')}
          updateData={updateData}
          onOpenBuilder={onOpenBuilder}
        />
      );

    default:
      return null;
  }
};

export default WizardRoute;
