import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Crop } from 'lucide-react';
import ImageCropper from '../ImageCropper';
import { TEMPLATE_OPTIONS } from '../../constants';

const SwissDocument = lazy(() => import('../SwissDocument'));

/** HTML-style display names for step 3 template cards */
const STEP3_TEMPLATE_LABELS = {
  modern: 'The Modern',
  classic: 'The Classic',
  compact: 'The Playful',
  swiss: 'The Minimal'
};

const TemplateSkeleton = () => (
  <div className="w-full h-full bg-neutral-800 animate-pulse flex items-center justify-center rounded-md" />
);

const Step3UploadSelect = React.memo(({
  data,
  updateData,
  t,
  animDir,
  selectedTemplate,
  onSelectTemplate,
  onPreview,
  showToast,
  onNavigationVisibilityChange,
  darkMode,
  onPrev,
  onNext
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [visibleTemplates, setVisibleTemplates] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (onNavigationVisibilityChange) onNavigationVisibilityChange(!showCropper);
  }, [showCropper, onNavigationVisibilityChange]);

  useEffect(() => {
    let m = true;
    const load = async () => {
      if (m) setVisibleTemplates(TEMPLATE_OPTIONS.slice(0, 2).map(x => x.id));
      await new Promise(r => setTimeout(r, 80));
      if (m) setVisibleTemplates(TEMPLATE_OPTIONS.map(x => x.id));
    };
    load();
    return () => { m = false; };
  }, []);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (onNavigationVisibilityChange) onNavigationVisibilityChange(false);
    const r = new FileReader();
    r.onloadend = () => { setTempImage(r.result); setShowCropper(true); };
    r.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  };

  const handleCropComplete = (img) => {
    updateData('photo', img);
    setShowCropper(false);
    setTempImage(null);
  };

  const handleCropCancel = () => { setShowCropper(false); setTempImage(null); };

  const handleRecrop = () => {
    if (data.photo) {
      if (onNavigationVisibilityChange) onNavigationVisibilityChange(false);
      setTempImage(data.photo);
      setShowCropper(true);
    }
  };

  const textMain = darkMode ? 'text-white' : 'text-text-main';
  const textMuted = darkMode ? 'text-gray-400' : 'text-text-secondary';

  return (
    <>
      <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-6xl mx-auto pb-24`}>
        {/* Progress bar — глобальний StepProgress у App, тут лише контент */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 1. Upload Pet Photo – lg:col-span-5, HTML-style */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className={`text-4xl font-bold font-display ${textMain}`}>
                1. {t?.labels?.photo ?? 'Upload Pet Photo'}
              </h2>
              <p className={`${textMuted} font-medium`}>
                {t?.ui?.photoHint ?? 'Clear photos with good lighting work best!'}
              </p>
            </div>
            <div
              className={`relative flex-grow min-h-[300px] hand-drawn-border border-2 border-dashed flex flex-col items-center justify-center p-8 cursor-pointer transition-colors ${
                darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
              } ${isDragging ? (darkMode ? 'bg-primary/20' : 'bg-primary/10') : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="step3-photo-input"
              />
              {data.photo ? (
                <div className="relative w-full max-w-[200px] aspect-square rounded-xl overflow-hidden border-2 hand-drawn-border border-primary z-20">
                  <img src={data.photo} className="w-full h-full object-cover" alt="Pet" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRecrop(); }}
                    className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/90 text-white text-xs font-bold hand-drawn-button z-30"
                  >
                    <Crop size={12} />
                    {t?.labels?.recrop ?? 'Recrop'}
                  </button>
                </div>
              ) : (
                <>
                  <div className={`size-20 flex items-center justify-center rounded-full mb-4 transition-transform ${darkMode ? 'bg-primary/30' : 'bg-primary/20'}`}>
                    <span className="material-symbols-outlined text-4xl text-primary">add_a_photo</span>
                  </div>
                  <p className={`text-2xl font-display font-bold ${textMain}`}>
                    {t?.ui?.clickOrDrop ?? 'Click or Drag & Drop'}
                  </p>
                  <p className={`text-sm ${textMuted} mt-1`}>PNG, JPG up to 10MB</p>
                </>
              )}
              <div className={`mt-6 px-4 py-2 flex items-center gap-2 rounded-full border text-xs font-bold ${
                darkMode ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-800 border-green-200'
              }`}>
                <span className="material-symbols-outlined text-sm">lock</span>
                {t?.stepsNew?.step4?.badge ?? 'Processing stays local'}
              </div>
            </div>
          </div>

          {/* 2. Choose Style – lg:col-span-7, template cards as in HTML */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className={`text-4xl font-bold font-display ${textMain}`}>
                2. {t?.templateSelection?.title ?? 'Choose Style'}
              </h2>
              <p className={`${textMuted} font-medium`}>
                {t?.templateSelection?.subtitle ?? "Select a layout that matches your pet's personality."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { onSelectTemplate(opt.id); showToast?.(t?.ui?.select ?? 'Selected', 'info'); }}
                  className={`template-card p-4 flex flex-col gap-3 text-left ${selectedTemplate === opt.id ? 'active' : ''} ${
                    darkMode ? 'bg-white/5 hover:border-white/30' : 'bg-white border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div
                    className="aspect-[3/4] rounded-md overflow-hidden relative border border-white/10 bg-neutral-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {visibleTemplates.includes(opt.id) ? (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-800 overflow-hidden">
                        <Suspense fallback={<TemplateSkeleton />}>
                          <div
                            style={{ width: '210mm', height: '297mm', transform: 'scale(0.38)', transformOrigin: 'center', flexShrink: 0 }}
                            className="shadow"
                          >
                            <SwissDocument data={data} t={t} templateType={opt.id} />
                          </div>
                        </Suspense>
                      </div>
                    ) : (
                      <TemplateSkeleton />
                    )}
                    {selectedTemplate === opt.id && (
                      <div className="absolute bottom-2 right-2">
                        <span className="material-symbols-outlined text-primary sketch-icon-filled">check_circle</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className={`text-xl font-display font-bold ${textMain}`}>
                      {STEP3_TEMPLATE_LABELS[opt.id] ?? opt.label}
                    </span>
                    {selectedTemplate === opt.id && (
                      <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                        {t?.ui?.select ?? 'Selected'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom nav – as in HTML */}
        {(onPrev != null || onNext != null) && (
          <div className="w-full max-w-6xl mt-16 flex flex-col sm:flex-row justify-between gap-4 border-t border-white/10 dark:border-gray-600 pt-8">
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className={`px-8 py-3 text-xl font-bold font-display hand-drawn-button transition-all flex items-center gap-2 ${
                  darkMode
                    ? 'text-gray-300 hover:bg-white/5 border-white/20'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                }`}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                {t?.nav?.previousStep ?? 'Previous Step'}
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="px-12 py-4 text-2xl font-bold font-display hand-drawn-button bg-primary text-black hover:scale-[1.02] active:scale-95 transition-all shadow-[0_4px_0_0_rgba(149,117,205,1)] flex items-center gap-2 ml-auto"
              >
                {t?.nav?.finalReview ?? 'Final Review'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>
        )}
      </div>

      {showCropper && tempImage && (
        <ImageCropper imageSrc={tempImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} aspectRatio={1} />
      )}
    </>
  );
});

Step3UploadSelect.displayName = 'Step3UploadSelect';

export default Step3UploadSelect;
