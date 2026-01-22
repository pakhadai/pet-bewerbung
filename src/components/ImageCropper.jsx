import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCcw } from 'lucide-react';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 1 }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
    
    // Center the crop
    const { width, height } = e.currentTarget;
    const size = Math.min(width, height) * 0.8;
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x,
      y,
    });
  }, []);

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Output size (max 800x800 for performance)
    const outputSize = Math.min(800, completedCrop.width * scaleX);
    canvas.width = outputSize;
    canvas.height = outputSize;
    
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputSize,
      outputSize
    );

    // Convert to base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.85);
    onCropComplete(base64Image);
  }, [completedCrop, onCropComplete]);

  const resetCrop = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const size = Math.min(width, height) * 0.8;
      const x = (width - size) / 2;
      const y = (height - size) / 2;
      
      setCrop({
        unit: 'px',
        width: size,
        height: size,
        x,
        y,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="theme-card rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b theme-border">
          <h3 className="theme-text font-bold text-lg">Foto zuschneiden</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full theme-bg hover:bg-opacity-80 transition-all"
          >
            <X size={20} className="theme-text-muted" />
          </button>
        </div>
        
        <div className="p-4 flex justify-center bg-black/20">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={false}
            className="max-h-[60vh]"
          >
            <img
              src={imageSrc}
              onLoad={onImageLoad}
              alt="Crop preview"
              className="max-h-[60vh] max-w-full"
            />
          </ReactCrop>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t theme-border">
          <button
            onClick={resetCrop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg theme-bg hover:bg-opacity-80 transition-all theme-text-muted"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border theme-border theme-text hover:bg-opacity-80 transition-all"
            >
              Abbrechen
            </button>
            <button
              onClick={getCroppedImg}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
            >
              <Check size={18} />
              Fertig
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
