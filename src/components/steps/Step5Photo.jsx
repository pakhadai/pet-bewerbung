import React, { useState } from 'react';
import { Camera, Crop } from 'lucide-react';
import ImageCropper from '../ImageCropper';

const Step5Photo = React.memo(({ data, onFileChange, updateData, t, animDir, onNavigationVisibilityChange }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  // Hide navigation when cropper opens, show when it closes
  React.useEffect(() => {
    if (onNavigationVisibilityChange) {
      onNavigationVisibilityChange(!showCropper);
    }
  }, [showCropper, onNavigationVisibilityChange]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Hide navigation immediately when file is selected
      if (onNavigationVisibilityChange) {
        onNavigationVisibilityChange(false);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    updateData('photo', croppedImage);
    setShowCropper(false);
    setTempImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
  };

  const handleRecrop = () => {
    if (data.photo) {
      // Hide navigation immediately when recrop starts
      if (onNavigationVisibilityChange) {
        onNavigationVisibilityChange(false);
      }
      setTempImage(data.photo);
      setShowCropper(true);
    }
  };

  return (
    <>
      <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 text-center max-w-lg mx-auto`}>
        <div className="relative group cursor-pointer inline-block w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`aspect-square w-full max-w-[240px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
            data.photo
              ? 'border-primary p-2'
              : 'theme-border theme-bg-secondary hover:theme-card-bg-hover hover:scale-105'
          }`}>
            {data.photo ? (
              <img
                src={data.photo}
                className="w-full h-full object-cover rounded-xl shadow-sm"
                alt="Pet"
              />
            ) : (
              <>
                <div className="w-14 h-14 theme-bg-secondary rounded-full flex items-center justify-center mb-3 theme-text-muted">
                  <Camera size={28} />
                </div>
                <span className="theme-text font-medium">{t.labels.photo}</span>
              </>
            )}
          </div>
        </div>
        
        {data.photo && (
          <button
            onClick={handleRecrop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg theme-bg hover:bg-opacity-80 transition-all theme-text-muted text-sm"
          >
            <Crop size={16} />
            {t.labels?.recrop || 'Bild zuschneiden'}
          </button>
        )}
      </div>

      {showCropper && tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={1}
        />
      )}
    </>
  );
});

Step5Photo.displayName = 'Step5Photo';

export default Step5Photo;
