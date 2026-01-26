import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Camera, Crop } from 'lucide-react';
import Button from '../Button';
import ImageCropper from '../ImageCropper';
import { TEMPLATE_OPTIONS } from '../../constants';

const SwissDocument = lazy(() => import('../SwissDocument'));

const TemplateSkeleton = () => (
  <div className="w-full h-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center rounded-lg">
    <div className="text-slate-400 dark:text-gray-500 text-xs">...</div>
  </div>
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
  darkMode
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [visibleTemplates, setVisibleTemplates] = useState([]);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onNavigationVisibilityChange) onNavigationVisibilityChange(false);
      const r = new FileReader();
      r.onloadend = () => { setTempImage(r.result); setShowCropper(true); };
      r.readAsDataURL(file);
    }
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

  const cardCl = darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-white/80 border-gray-300';
  const titleCl = darkMode ? 'text-white' : 'text-text-main';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-text-secondary';

  return (
    <>
      <div className={`page page-enter-${animDir} reveal fade-enter max-w-6xl mx-auto pb-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. Upload Pet Photo */}
          <div className={`hand-drawn-border border-2 rounded-2xl p-6 ${cardCl} shadow-lg`}>
            <h3 className={`font-display font-bold text-xl mb-1 ${titleCl}`}>1. {t?.labels?.photo ?? 'Upload Pet Photo'}</h3>
            <p className={`font-sans text-sm mb-4 ${mutedCl}`}>
              {t?.ui?.photoHint ?? 'Clear photos with good lighting work best!'}
            </p>
            <div className="relative group cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className={`aspect-square max-w-[260px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all hand-drawn-border ${
                data.photo ? 'border-primary p-2' : 'theme-border theme-bg-secondary hover:theme-card-bg-hover'
              }`}>
                {data.photo ? (
                  <img src={data.photo} className="w-full h-full object-cover rounded-xl" alt="Pet" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-2">add_a_photo</span>
                    <span className={`font-sans text-sm font-medium ${mutedCl}`}>{t?.ui?.clickOrDrop ?? 'Click or drag & drop'}</span>
                    <span className={`font-sans text-xs ${mutedCl}`}>PNG, JPG up to 10MB</span>
                  </>
                )}
              </div>
            </div>
            {data.photo && (
              <button type="button" onClick={handleRecrop} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg theme-bg text-sm">
                <Crop size={14} />
                {t?.labels?.recrop ?? 'Recrop'}
              </button>
            )}
            <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border hand-drawn-border ${darkMode ? 'bg-green-900/20 border-green-600/50' : 'bg-green-50 border-green-200'}`}>
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">lock</span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                {t?.stepsNew?.step3?.badge ?? 'Processing stays local'}
              </span>
            </div>
          </div>

          {/* 2. Choose Style */}
          <div className={`hand-drawn-border border-2 rounded-2xl p-6 ${cardCl} shadow-lg`}>
            <h3 className={`font-display font-bold text-xl mb-1 ${titleCl}`}>2. {t?.templateSelection?.title ?? 'Choose Style'}</h3>
            <p className={`font-sans text-sm mb-4 ${mutedCl}`}>
              {t?.templateSelection?.subtitle ?? "Select a layout that matches your pet's personality."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {TEMPLATE_OPTIONS.map((opt, i) => (
                <div
                  key={opt.id}
                  className="flex flex-col items-center gap-2"
                  onMouseEnter={() => setHoveredTemplate(opt.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div
                    className={`relative w-full rounded-xl overflow-hidden border-2 transition-all hand-drawn-border ${
                      selectedTemplate === opt.id ? 'border-primary ring-2 ring-primary/30' : 'theme-border'
                    }`}
                    style={{ aspectRatio: '210/297' }}
                  >
                    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
                      {visibleTemplates.includes(opt.id) ? (
                        <Suspense fallback={<TemplateSkeleton />}>
                          <div style={{ width: '210mm', height: '297mm', transform: 'scale(0.15)', transformOrigin: 'center', flexShrink: 0 }} className="shadow">
                            <SwissDocument data={data} t={t} templateType={opt.id} />
                          </div>
                        </Suspense>
                      ) : (
                        <TemplateSkeleton />
                      )}
                    </div>
                    {hoveredTemplate === opt.id && (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30">
                        <Button
                          variant="primary"
                          className="text-sm py-2 px-4"
                          onClick={(e) => { e.stopPropagation(); onSelectTemplate(opt.id); showToast?.(t?.ui?.select ?? 'Selected', 'info'); }}
                        >
                          {t?.ui?.select ?? 'Select'}
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-sm py-2 px-4"
                          onClick={(e) => { e.stopPropagation(); onPreview?.(opt.id); }}
                        >
                          {t?.ui?.preview ?? 'Preview'}
                        </Button>
                      </div>
                    )}
                    {selectedTemplate === opt.id && (
                      <div className="absolute bottom-1 right-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
                        <span className="material-symbols-outlined text-sm">check</span>
                        {t?.ui?.select ?? 'Selected'}
                      </div>
                    )}
                  </div>
                  <span className={`font-sans text-sm font-semibold ${titleCl}`}>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCropper && tempImage && (
        <ImageCropper imageSrc={tempImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} aspectRatio={1} />
      )}
    </>
  );
});

Step3UploadSelect.displayName = 'Step3UploadSelect';

export default Step3UploadSelect;
