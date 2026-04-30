/**
 * Step4Photo - Photo upload with cropping
 */

import { Camera, Crop, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useWizardContext } from '../../context/WizardContext'
import { useFormStore } from '../../stores/formStore'
import type { FormData } from '../../types/form'
import compressImage from '../../utils/imageCompression'
import ImageCropper from '../ImageCropper'
import MaterialIcon from '../MaterialIcon'

interface Step4PhotoProps {
  onNavigationVisibilityChange?: (visible: boolean) => void
  showToast?: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  embedded?: boolean
}

const Step4Photo: React.FC<Step4PhotoProps> = ({
  onNavigationVisibilityChange,
  showToast,
  embedded = false,
}) => {
  const data = useFormStore((s) => s.data) as FormData
  const updateData = useFormStore((s) => s.updateData)
  const { t, animDir, darkMode } = useWizardContext()
  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isWindowDragging, setIsWindowDragging] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const dragDepthRef = useRef(0)

  useEffect(() => {
    onNavigationVisibilityChange?.(!showCropper)
  }, [showCropper, onNavigationVisibilityChange])

  useEffect(
    () => () => {
      if (tempImage && tempImage.startsWith('blob:')) {
        URL.revokeObjectURL(tempImage)
      }
    },
    [tempImage]
  )

  useEffect(() => {
    const hasFiles = (event: DragEvent): boolean =>
      Array.from(event.dataTransfer?.types ?? []).includes('Files')

    const handleWindowDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return
      dragDepthRef.current += 1
      setIsWindowDragging(true)
    }

    const handleWindowDragOver = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      setIsWindowDragging(true)
    }

    const handleWindowDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
      if (dragDepthRef.current === 0) setIsWindowDragging(false)
    }

    const handleWindowDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      dragDepthRef.current = 0
      setIsWindowDragging(false)
      const file = event.dataTransfer?.files?.[0]
      if (file) {
        void processFile(file)
      }
    }

    window.addEventListener('dragenter', handleWindowDragEnter)
    window.addEventListener('dragover', handleWindowDragOver)
    window.addEventListener('dragleave', handleWindowDragLeave)
    window.addEventListener('drop', handleWindowDrop)

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter)
      window.removeEventListener('dragover', handleWindowDragOver)
      window.removeEventListener('dragleave', handleWindowDragLeave)
      window.removeEventListener('drop', handleWindowDrop)
    }
  }, [])

  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const ACCEPT_ATTR = 'image/jpeg,image/png,image/webp,image/heic,image/heif'
  const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ])
  const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'])

  const isSupportedImageFile = (file: File): boolean => {
    const mime = (file.type || '').toLowerCase()
    if (mime && ALLOWED_MIME_TYPES.has(mime)) return true
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    return ALLOWED_EXTENSIONS.has(ext)
  }

  const isHeicLikeFile = (file: File): boolean => {
    const mime = (file.type || '').toLowerCase()
    if (mime === 'image/heic' || mime === 'image/heif') return true
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    return ext === 'heic' || ext === 'heif'
  }

  const processFile = async (file: File) => {
    if (!file) return
    const isHeicLike = isHeicLikeFile(file)
    if (!isSupportedImageFile(file)) {
      showToast?.(
        t?.step4?.invalidImage ??
          'Ungültiges Bildformat. Bitte JPG, PNG, WEBP oder HEIC/HEIF hochladen.',
        'error'
      )
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      showToast?.(t?.step4?.fileTooLarge ?? 'Datei zu groß. Max. 10 MB.', 'error')
      return
    }
    if (isHeicLike) {
      const isApplePlatform = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)
      if (!isApplePlatform) {
        showToast?.(
          t?.step4?.heicFallback ??
            'HEIC/HEIF can be unstable on some browsers. If this file fails, please convert it to JPG and upload again.',
          'info'
        )
      }
    }
    onNavigationVisibilityChange?.(false)
    setIsCompressing(true)
    try {
      const blob = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
        maxSizeKB: 500,
        returnBlob: true,
      })
      if (!(blob instanceof Blob)) throw new Error('Expected Blob from compressor')
      const url = URL.createObjectURL(blob)
      setTempImage(url)
      setShowCropper(true)
    } catch {
      showToast?.(
        isHeicLike
          ? (t?.step4?.heicFallback ??
              'HEIC/HEIF can be unstable on some browsers. If this file fails, please convert it to JPG and upload again.')
          : (t?.step4?.invalidImage ??
              'Bild konnte nicht verarbeitet werden. Bitte JPG, PNG, WEBP oder HEIC/HEIF verwenden.'),
        'error'
      )
    } finally {
      setIsCompressing(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) processFile(file)
  }

  const handleCropComplete = (img: string) => {
    updateData('photo', img)
    setShowCropper(false)
    if (tempImage && tempImage.startsWith('blob:')) {
      URL.revokeObjectURL(tempImage)
    }
    setTempImage(null)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    if (tempImage && tempImage.startsWith('blob:')) {
      URL.revokeObjectURL(tempImage)
    }
    setTempImage(null)
  }

  const handleRecrop = () => {
    if (data.photo) {
      onNavigationVisibilityChange?.(false)
      setTempImage(data.photo)
      setShowCropper(true)
    }
  }

  const handleRemovePhoto = () => {
    updateData('photo', null)
  }

  const cardCl = darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
  const textMain = darkMode ? 'text-white' : 'text-text-main'
  const textMuted = darkMode ? 'text-gray-400' : 'text-text-secondary'

  return (
    <>
      <div
        className={
          embedded
            ? ''
            : `page page-enter-${animDir} reveal fade-enter w-full max-w-2xl mx-auto pb-32`
        }
      >
        <div
          className={
            embedded ? '' : `hand-drawn-border border-2 rounded-2xl p-6 md:p-8 ${cardCl} shadow-lg`
          }
        >
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}
            >
              <Camera size={32} className="text-primary" />
            </div>
            <h2 className={`font-display font-bold text-2xl md:text-3xl mb-2 ${textMain}`}>
              {t?.stepsNew?.step4?.title ?? 'Foto hochladen'}
            </h2>
            <p className={`font-sans text-sm md:text-base ${textMuted}`}>
              {t?.stepsNew?.step4?.subtitle ?? 'Ein gutes Foto macht den ersten Eindruck'}
            </p>
          </div>

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
              accept={ACCEPT_ATTR}
              onChange={handleFileSelect}
              disabled={isCompressing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-wait"
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
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRecrop()
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hand-drawn-button hover:bg-primary-dark transition-colors"
                  >
                    <Crop size={16} />
                    {t?.labels?.recrop ?? 'Neu zuschneiden'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemovePhoto()
                    }}
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
                  {t?.step4?.changePhotoHint ??
                    'Klicken Sie auf das Bild oder ziehen Sie ein neues hierher'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-24 h-24 flex items-center justify-center rounded-full transition-transform ${darkMode ? 'bg-primary/30' : 'bg-primary/20'} ${isDragging ? 'scale-110' : ''}`}
                >
                  <Upload size={40} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-display font-bold mb-2 ${textMain}`}>
                    {t?.ui?.clickOrDrop ?? 'Klicken oder per Drag & Drop'}
                  </p>
                  <p className={`text-sm ${textMuted}`}>
                    JPG, PNG, WEBP, HEIC/HEIF {t?.step4?.maxSize ?? 'bis zu 10MB'}
                  </p>
                </div>
                <div
                  className={`mt-4 px-4 py-2 rounded-full border-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  <p className={`text-xs ${textMuted}`}>
                    {t?.step4?.tipFormat ?? 'Tipp: Hochformat (3:4) funktioniert am besten'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
            <h4
              className={`font-display font-bold text-sm mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}
            >
              {t?.step4?.tipsTitle ?? 'Tipps für ein perfektes Foto:'}
            </h4>
            <ul className={`text-xs space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              <li className="flex items-start gap-2">
                <MaterialIcon name="check" className="text-sm mt-0.5 shrink-0" />
                {t?.step4?.tip1 ?? 'Gute Beleuchtung (natürliches Licht ist ideal)'}
              </li>
              <li className="flex items-start gap-2">
                <MaterialIcon name="check" className="text-sm mt-0.5 shrink-0" />
                {t?.step4?.tip2 ?? 'Tier schaut in die Kamera'}
              </li>
              <li className="flex items-start gap-2">
                <MaterialIcon name="check" className="text-sm mt-0.5 shrink-0" />
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
          aspectRatio={3 / 4}
          t={t}
        />
      )}

      {isWindowDragging && !showCropper && (
        <div className="fixed inset-0 z-[70] pointer-events-none bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6">
          <div className="hand-drawn-border border-2 border-dashed border-primary rounded-2xl px-8 py-10 bg-white/95 dark:bg-gray-900/95 text-center shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-center mb-4">
              <Upload size={40} className="text-primary" />
            </div>
            <p className="font-display font-bold text-2xl text-text-main dark:text-white">
              {t?.ui?.clickOrDrop ?? 'Drop photo here'}
            </p>
            <p className="mt-2 text-sm text-text-secondary dark:text-gray-300">
              {t?.step4?.photoHint ?? 'Clear photos with good lighting work best!'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Step4Photo
