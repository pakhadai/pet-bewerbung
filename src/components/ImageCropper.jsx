import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check, RotateCcw } from 'lucide-react';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 1, t }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const cropW = Math.min(width, height * aspectRatio) * 0.9;
    const cropH = cropW / aspectRatio;
    const x = (width - cropW) / 2;
    const y = (height - cropH) / 2;
    setCrop({
      unit: 'px',
      width: cropW,
      height: cropH,
      x,
      y,
    });
  }, [aspectRatio]);

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !imageSrc) return;
    setIsProcessing(true);

    const image = imgRef.current;
    const drawToCanvas = (source) => {
      const scaleX = source.naturalWidth ? source.naturalWidth / image.width : 1;
      const scaleY = source.naturalHeight ? source.naturalHeight / image.height : 1;
      const srcW = completedCrop.width * scaleX;
      const srcH = completedCrop.height * scaleY;
      const maxDim = 800;
      let outW = Math.min(maxDim, srcW);
      let outH = Math.min(maxDim, srcH);
      const cropAspect = srcW / srcH;
      if (outW / outH !== cropAspect) {
        if (cropAspect > 1) outH = outW / cropAspect;
        else outW = outH * cropAspect;
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(outW);
      canvas.height = Math.round(outH);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const sx = completedCrop.x * scaleX;
      const sy = completedCrop.y * scaleY;
      ctx.drawImage(source, sx, sy, srcW, srcH, 0, 0, outW, outH);
      return canvas;
    };

    const finish = (canvas) => {
      canvas.toBlob(
        (blob) => {
          try {
            if (!isMountedRef.current) return;
            if (!blob) {
              setIsProcessing(false);
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
              if (!isMountedRef.current) return;
              onCropComplete(reader.result);
              setIsProcessing(false);
            };
            reader.readAsDataURL(blob);
          } finally {
            canvas.width = 0;
            canvas.height = 0;
          }
        },
        'image/jpeg',
        0.85
      );
    };

    if (typeof createImageBitmap === 'function') {
      let bitmap;
      const canvas = document.createElement('canvas');
      try {
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
        const scaleX = bitmap.width / image.width;
        const scaleY = bitmap.height / image.height;
        const srcW = completedCrop.width * scaleX;
        const srcH = completedCrop.height * scaleY;
        const maxDim = 800;
        let outW = Math.min(maxDim, srcW);
        let outH = Math.min(maxDim, srcH);
        const cropAspect = srcW / srcH;
        if (outW / outH !== cropAspect) {
          if (cropAspect > 1) outH = outW / cropAspect;
          else outW = outH * cropAspect;
        }
        canvas.width = Math.round(outW);
        canvas.height = Math.round(outH);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, completedCrop.x * scaleX, completedCrop.y * scaleY, srcW, srcH, 0, 0, outW, outH);
        bitmap.close();
        bitmap = null;
        finish(canvas);
        return;
      } catch {
        /* fallback to img */
      } finally {
        if (bitmap) bitmap.close();
      }
    }
    const fallbackCanvas = drawToCanvas(image);
    finish(fallbackCanvas);
  }, [completedCrop, onCropComplete, imageSrc]);

  const useFullImage = useCallback(async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const finish = (canvas) => {
      canvas.toBlob(
        (blob) => {
          if (!isMountedRef.current) return;
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            if (!isMountedRef.current) return;
            onCropComplete(reader.result);
            setIsProcessing(false);
          };
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        0.85
      );
    };

    if (typeof createImageBitmap === 'function') {
      try {
        const res = await fetch(imageSrc);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
        if (!isMountedRef.current) {
          bitmap.close();
          return;
        }
        const maxSize = 800;
        let { width, height } = bitmap;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();
        finish(canvas);
        return;
      } catch {
        /* fallback */
      }
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!isMountedRef.current) return;
      const canvas = document.createElement('canvas');
      const maxSize = 800;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      finish(canvas);
    };
    img.onerror = () => {
      if (isMountedRef.current) setIsProcessing(false);
    };
    img.src = imageSrc;
  }, [imageSrc, onCropComplete]);

  const resetCrop = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const cropW = Math.min(width, height * aspectRatio) * 0.9;
      const cropH = cropW / aspectRatio;
      const x = (width - cropW) / 2;
      const y = (height - cropH) / 2;
      setCrop({
        unit: 'px',
        width: cropW,
        height: cropH,
        x,
        y,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
      <div className="relative max-w-lg w-full rounded-2xl border-2 hand-drawn-border shadow-xl theme-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-600">
          <h3 className="theme-text font-bold text-lg">Foto zuschneiden</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
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
        
        <div className="flex items-center justify-between p-4 border-t border-gray-300 dark:border-gray-600 gap-2">
          <button
            onClick={resetCrop}
            disabled={isProcessing}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 hand-drawn-border theme-card hover:opacity-80 transition-all disabled:opacity-50 h-10"
          >
            <RotateCcw size={16} className="theme-text-muted" />
            <span className="text-sm theme-text">Reset</span>
          </button>
          <button
            onClick={useFullImage}
            disabled={isProcessing}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 hand-drawn-border theme-card hover:opacity-80 transition-all disabled:opacity-50 h-10 text-sm theme-text"
          >
            Ganzes Bild
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex items-center justify-center px-4 py-2.5 rounded-xl border-2 hand-drawn-border theme-card hover:opacity-80 transition-all disabled:opacity-50 h-10 text-sm theme-text"
          >
            Abbrechen
          </button>
          <button
            onClick={getCroppedImg}
            disabled={isProcessing || !completedCrop}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-50 h-10 text-sm font-medium hand-drawn-button"
          >
            <Check size={16} />
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
