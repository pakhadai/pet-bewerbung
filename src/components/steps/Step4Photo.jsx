/**
 * Step4Photo.jsx
 * 
 * STEP: 4 (in App.tsx: step === 4)
 * 
 * This component handles ONLY photo upload with cropping functionality.
 * Separated from template selection for better mobile UX.
 */
import React, { useState, useEffect } from 'react';
import { Crop, Camera, Upload } from 'lucide-react';
import ImageCropper from '../ImageCropper';

const Step4Photo = React.memo(({
  data,
  updateData,
  t,
  animDir,
  onNavigationVisibilityChange,
  darkMode
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (onNavigationVisibilityChange) onNavigationVisibilityChange(!showCropper);
  }, [showCropper, onNavigationVisibilityChange]);

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

  const handleCropCancel = () => { 
    setShowCropper(false); 
    setTempImage(null); 
  };

  const handleRecrop = () => {
    if (data.photo) {
      if (onNavigationVisibilityChange) onNavigationVisibilityChange(false);
      setTempImage(data.photo);
      setShowCropper(true);
    }
  };

  const handleRemovePhoto = () => {
    updateData('photo', null);
  };

  const cardCl = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300';
  const textMain = darkMode ? 'text-white' : 'text-text-main';
  const textMuted = darkMode ? 'text-gray-400' : 'text-text-secondary';

  return (
    <>
      <div className={`page page-enter-${animDir} reveal fade-enter w-full max-w-2xl mx-auto pb-32`}>
        <div className={`hand-drawn-border border-2 rounded-2xl p-6 md:p-8 ${cardCl} shadow-lg`}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
              <Camera size={32} className="text-primary" />
            </div>
            <h2 className={`font-display font-bold text-2xl md:text-3xl mb-2 ${textMain}`}>
              {t?.stepsNew?.step4?.title ?? 'Foto hochladen'}
            </h2>
            <p className={`font-sans text-sm md:text-base ${textMuted}`}>
              {t?.stepsNew?.step4?.subtitle ?? 'Ein gutes Foto macht den ersten Eindruck'}
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`relative min-h-[350px] md:min-h-[400px] hand-drawn-border border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all ${
              darkMode 
                ? 'bg-white/5 hover:bg-white/10 border-gray-500' 
                : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
            } ${isDragging ? (darkMode ? 'bg-primary/20 border-primary' : 'bg-primary/10 border-primary') : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="step4-photo-input"
            />
            
            {data.photo ? (
              <div className="relative flex flex-col items-center gap-4 z-20">
                <div className="relative w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden border-4 hand-drawn-border border-primary shadow-xl">
                  <img src={data.photo} className="w-full h-full object-cover" alt="Pet" />
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRecrop(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hand-drawn-button hover:bg-primary-dark transition-colors"
                  >
                    <Crop size={16} />
                    {t?.labels?.recrop ?? 'Neu zuschneiden'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemovePhoto(); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold hand-drawn-button transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {t?.labels?.remove ?? 'Entfernen'}
                  </button>
                </div>
                
                <p className={`text-sm ${textMuted} text-center`}>
                  {t?.step4?.changePhotoHint ?? 'Klicken Sie auf das Bild oder ziehen Sie ein neues hierher'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className={`w-24 h-24 flex items-center justify-center rounded-full transition-transform ${
                  darkMode ? 'bg-primary/30' : 'bg-primary/20'
                } ${isDragging ? 'scale-110' : ''}`}>
                  <Upload size={40} className="text-primary" />
                </div>
                
                <div className="text-center">
                  <p className={`text-2xl font-display font-bold mb-2 ${textMain}`}>
                    {t?.ui?.clickOrDrop ?? 'Klicken oder per Drag & Drop'}
                  </p>
                  <p className={`text-sm ${textMuted}`}>
                    PNG, JPG {t?.step4?.maxSize ?? 'bis zu 10MB'}
                  </p>
                </div>
                
                <div className={`mt-4 px-4 py-2 rounded-full border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <p className={`text-xs ${textMuted}`}>
                    {t?.step4?.tipFormat ?? 'Tipp: Hochformat (3:4) funktioniert am besten'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Privacy badge */}
          <div className={`mt-6 flex items-center gap-3 px-4 py-3 rounded-xl border-2 hand-drawn-border ${
            darkMode ? 'bg-green-900/20 border-green-600/50' : 'bg-green-50 border-green-200'
          }`}>
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 sketch-icon-filled">verified_user</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
              {t?.step4?.photoPrivacy ?? 'Ihr Foto wird niemals hochgeladen. Alles passiert lokal in Ihrem Browser.'}
            </span>
          </div>

          {/* Tips section */}
          <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <h4 className={`font-display font-bold text-sm mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              {t?.step4?.tipsTitle ?? 'Tipps für ein perfektes Foto:'}
            </h4>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                {t?.step4?.tip1 ?? 'Gute Beleuchtung (natürliches Licht ist ideal)'}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                {t?.step4?.tip2 ?? 'Tier schaut in die Kamera'}
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm mt-0.5">check</span>
                {t?.step4?.tip3 ?? 'Neutraler Hintergrund'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showCropper && tempImage && (
        <ImageCropper 
          imageSrc={tempImage} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCropCancel} 
          aspectRatio={3/4} 
          t={t} 
        />
      )}
    </>
  );
});

Step4Photo.displayName = 'Step4Photo';

export default Step4Photo;
