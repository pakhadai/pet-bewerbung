import React, { useState } from 'react';
import { X, FileText, Shield, Scale } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden"
      onClick={onClose}
    >
      <div
        className="theme-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
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

// Impressum Content
const ImpressumContent = ({ t }) => (
  <div className="space-y-4 text-sm leading-relaxed">
    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.operator || 'Operator'}</h3>
      <p>Pet-Bewerbung.ch</p>
      <p>St. Gallen, Switzerland</p>
      <p>Email: info@pet-bewerbung.ch</p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.disclaimer || 'Disclaimer'}</h3>
      <p className="theme-text-muted">
        {t.legal?.disclaimerText ||
          'This service generates application documents for pets. The use of this service does not guarantee acceptance by landlords or property management companies. The generated documents are for informational purposes and serve as a supplement to your rental application.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.liability || 'Limitation of Liability'}</h3>
      <p className="theme-text-muted">
        {t.legal?.liabilityText ||
          'We assume no liability for the accuracy, completeness, or timeliness of the information provided. The use of this service is at your own risk. We are not liable for any damages arising from the use or inability to use this service.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.copyright || 'Copyright'}</h3>
      <p className="theme-text-muted">
        {t.legal?.copyrightText ||
          'All content on this website is protected by copyright. Reproduction or use without express permission is prohibited. Users are responsible for ensuring they own the rights to any photos uploaded.'}
      </p>
    </section>
  </div>
);

// Privacy Policy (Datenschutz) Content
const PrivacyContent = ({ t }) => (
  <div className="space-y-4 text-sm leading-relaxed">
    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.privacyIntro || 'Data Protection'}</h3>
      <p className="theme-text-muted">
        {t.legal?.privacyIntroText ||
          'We take the protection of your personal data seriously. This privacy policy explains how we handle your information.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.dataCollection || 'Data Collection'}</h3>
      <p className="theme-text-muted">
        {t.legal?.dataCollectionText ||
          'All data you enter (name, address, pet information, photos) is processed exclusively in your browser. No personal data is transmitted to or stored on our servers. PDF generation happens entirely on the client side.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.thirdParty || 'Third-Party Services'}</h3>
      <ul className="theme-text-muted space-y-2">
        <li>
          <strong>Stripe:</strong> {t.legal?.stripeText || 'For donation processing, we use Stripe. When you make a donation, your payment data is processed directly by Stripe according to their privacy policy.'}
        </li>
        <li>
          <strong>Google Fonts:</strong> {t.legal?.fontsText || 'We use locally hosted fonts to avoid data transfer to Google servers.'}
        </li>
      </ul>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.cookies || 'Cookies'}</h3>
      <p className="theme-text-muted">
        {t.legal?.cookiesText ||
          'We use only technically necessary cookies to store your language and theme preferences. No tracking cookies are used. Stripe may set its own cookies for payment processing.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.rights || 'Your Rights'}</h3>
      <p className="theme-text-muted">
        {t.legal?.rightsText ||
          'Under Swiss data protection law (DSG/nDSG) and GDPR, you have the right to information, correction, deletion, and data portability. Since we do not store your data, these rights are automatically fulfilled.'}
      </p>
    </section>

    <section>
      <h3 className="font-semibold text-base mb-2">{t.legal?.contact || 'Contact'}</h3>
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
          'We provide a free tool to create pet application documents (Pet CV) for rental applications in Switzerland. The service includes form completion, AI-assisted text generation, and PDF creation.'}
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
      <h3 className="font-semibold text-base mb-2">{t.legal?.donations || 'Donations'}</h3>
      <p className="theme-text-muted">
        {t.legal?.donationsText ||
          'Donations are voluntary and non-refundable. They help maintain and improve this free service.'}
      </p>
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
