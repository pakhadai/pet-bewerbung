import React from 'react';
import SwissDocument from '../SwissDocument';
import ErrorBoundary from '../ErrorBoundary';

const Step8Preview = React.memo(({ data, t, animDir, selectedTemplate }) => {
  return (
    <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-4xl mx-auto pb-20`}>
      {/* Full Document Preview */}
      <div className="w-full flex justify-center overflow-auto py-4 mb-4 border rounded-2xl theme-bg-secondary theme-border p-4 shadow-lg">
        <div
          id="pdf-document"
          className="overflow-hidden border-2 rounded-lg shadow-2xl theme-card"
          style={{ width: '210mm' }}
        >
          <ErrorBoundary
            fallbackTitle={t.ui?.previewError || "Document Error"}
            fallbackMessage={t.ui?.previewErrorMessage || "Failed to render the document. Please try selecting a different template or check your data."}
          >
            <SwissDocument data={data} t={t} templateType={selectedTemplate} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
});

Step8Preview.displayName = 'Step8Preview';

export default Step8Preview;
