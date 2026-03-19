import React, { useState } from 'react';
import { X, FileText, Shield, Scale } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 print:hidden"
      onClick={onClose}
    >
      <div
        className="theme-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b theme-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg theme-bg">
              <Icon size={24} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-bold theme-text">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full theme-bg hover:bg-opacity-80 transition-all"
            aria-label="Close"
          >
            <X size={20} className="theme-text-muted" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto theme-text">
          {children}
        </div>
      </div>
    </div>
  );
};

const ImpressumContent = ({ t }) => (
  <div className="space-y-4 text-sm leading-relaxed">
    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.operator || 'Operator / Betreiber'}</h3>
      <div className="theme-text-muted">
        <p className="font-medium">Pet-Bewerbung.ch</p>
        <p>Switzerland</p>
        <p className="mt-2">Email: info@pet-bewerbung.ch</p>
      </div>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.disclaimer || 'Disclaimer / Haftungsausschluss'}</h3>
      <p className="theme-text-muted">
        {t.legal?.disclaimerText ||
          'This service generates application documents for pets. The use of this service does not guarantee acceptance by landlords or property management companies. The generated documents are for informational purposes and serve as a supplement to your rental application. We make no warranties regarding the effectiveness of these documents in securing housing.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.liability || 'Limitation of Liability / Haftungsbeschränkung'}</h3>
      <p className="theme-text-muted">
        {t.legal?.liabilityText ||
          'We assume no liability for the accuracy, completeness, or timeliness of the information provided. The use of this service is at your own risk. We are not liable for any damages arising from the use or inability to use this service.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.copyright || 'Copyright / Urheberrecht'}</h3>
      <p className="theme-text-muted">
        {t.legal?.copyrightText ||
          'All content on this website is protected by copyright. Reproduction or use without express permission is prohibited. Users are responsible for ensuring they own the rights to any photos uploaded.'}
      </p>
    </section>
  </div>
);

// Privacy Policy (Datenschutz) Content
// Compliant with Swiss nFADP (New Federal Act on Data Protection)
const PrivacyContent = ({ t }) => (
  <div className="space-y-4 text-sm leading-relaxed">
    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.privacyIntro || 'Data Protection / Datenschutz'}</h3>
      <p className="theme-text-muted">
        {t.legal?.privacyIntroText ||
          'We take the protection of your personal data seriously. This privacy policy explains how we handle your information in accordance with the Swiss Federal Act on Data Protection (nFADP/revDSG).'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.dataCollection || 'Local Data Processing'}</h3>
      <p className="theme-text-muted">
        {t.legal?.dataCollectionText ||
          'All data you enter for your pet dossier (name, address, pet information, photos) is processed exclusively in your browser (client-side). This data is NOT transmitted to or stored on our servers. PDF generation happens entirely on your device. Your form data is temporarily stored in your browser\'s localStorage to prevent data loss on page refresh.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.aiProcessing || 'Text Generation / Textgenerierung'}</h3>
      <p className="theme-text-muted">
        {t.legal?.aiProcessingText ||
          'Text generation is done entirely in your browser using template-based logic. No data is sent to any server. Your pet dossier is created locally on your device.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.thirdParty || 'Third-Party Services / Drittanbieter'}</h3>
      <ul className="theme-text-muted space-y-3">
        <li>
          <strong>Cloudflare (USA):</strong> {t.legal?.cloudflareText || 'We use Cloudflare for website delivery and security. Cloudflare may process IP addresses and browser information for security purposes.'}
        </li>
      </ul>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.cookies || 'Cookies'}</h3>
      <p className="theme-text-muted">
        {t.legal?.cookiesText ||
          'We use only technically necessary cookies and localStorage to store your language preference, theme setting, and form progress. No tracking or advertising cookies are used. Cloudflare may set its own cookies for functionality and security.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.rights || 'Your Rights / Ihre Rechte'}</h3>
      <p className="theme-text-muted">
        {t.legal?.rightsText ||
          'Under Swiss data protection law (nFADP/revDSG), you have the right to information, correction, deletion, restriction of processing, and data portability. Since we do not store your pet dossier data on our servers, these rights are automatically fulfilled.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.contact || 'Data Protection Contact'}</h3>
      <p className="theme-text-muted">
        {t.legal?.contactText ||
          'For data protection inquiries: info@pet-bewerbung.ch'}
      </p>
    </section>
  </div>
);

// Terms of Service (AGB) Content
const TermsContent = ({ t }) => (
  <div className="space-y-4 text-sm leading-relaxed">
    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.scope || 'Scope'}</h3>
      <p className="theme-text-muted">
        {t.legal?.scopeText ||
          'These terms apply to the use of Pet-Bewerbung.ch. By using this service, you agree to these terms.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.services || 'Services'}</h3>
      <p className="theme-text-muted">
        {t.legal?.servicesText ||
          'We provide a free tool to create pet application documents (Pet CV) for rental applications in Switzerland. The service includes form completion, automatic text generation, and PDF creation.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.userResponsibility || 'User Responsibilities'}</h3>
      <ul className="theme-text-muted space-y-1 list-disc list-inside">
        <li>{t.legal?.responsibility1 || 'You are responsible for the accuracy of all information provided'}</li>
        <li>{t.legal?.responsibility2 || 'You must own the rights to any photos uploaded'}</li>
        <li>{t.legal?.responsibility3 || 'You may not use this service for fraudulent purposes'}</li>
        <li>{t.legal?.responsibility4 || 'You acknowledge that this document does not guarantee housing approval'}</li>
      </ul>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.changes || 'Changes to Terms'}</h3>
      <p className="theme-text-muted">
        {t.legal?.changesText ||
          'We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the updated terms.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.jurisdiction || 'Jurisdiction'}</h3>
      <p className="theme-text-muted">
        {t.legal?.jurisdictionText ||
          'Swiss law applies. Place of jurisdiction is St. Gallen, Switzerland.'}
      </p>
    </section>
  </div>
);

// Footer Links Component
export const LegalFooterLinks = ({ t, onOpenLegal }) => (
  <div className="flex flex-wrap items-center justify-center gap-4 text-xs theme-text-muted">
    <button
      onClick={() => onOpenLegal('impressum')}
      className="hover:underline focus:outline-none focus:underline"
    >
      {t.legal?.impressum || 'Impressum'}
    </button>
    <span className="opacity-30">|</span>
    <button
      onClick={() => onOpenLegal('privacy')}
      className="hover:underline focus:outline-none focus:underline"
    >
      {t.legal?.privacy || 'Privacy Policy'}
    </button>
    <span className="opacity-30">|</span>
    <button
      onClick={() => onOpenLegal('terms')}
      className="hover:underline focus:outline-none focus:underline"
    >
      {t.legal?.terms || 'Terms of Service'}
    </button>
  </div>
);

// Main Legal Pages Component
const LegalPages = ({ t, openPage, onClose }) => {
  return (
    <>
      <LegalModal
        isOpen={openPage === 'impressum'}
        onClose={onClose}
        title={t.legal?.impressum || 'Impressum'}
        icon={FileText}
      >
        <ImpressumContent t={t} />
      </LegalModal>

      <LegalModal
        isOpen={openPage === 'privacy'}
        onClose={onClose}
        title={t.legal?.privacy || 'Privacy Policy'}
        icon={Shield}
      >
        <PrivacyContent t={t} />
      </LegalModal>

      <LegalModal
        isOpen={openPage === 'terms'}
        onClose={onClose}
        title={t.legal?.terms || 'Terms of Service'}
        icon={Scale}
      >
        <TermsContent t={t} />
      </LegalModal>
    </>
  );
};

export default LegalPages;
