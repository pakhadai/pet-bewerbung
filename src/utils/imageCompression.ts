/**
 * Image compression utility - TypeScript
 */
const MAX_DIMENSION = 8000
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function checkDimensions(width: number, height: number): void {
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error(
      `Image dimensions too large. Maximum allowed is ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.`
    )
  }
}

interface ImageDims {
  width: number
  height: number
}

async function getImageDimensionsFromHeader(blob: Blob): Promise<ImageDims | null> {
  const buf = await blob.slice(0, 64 * 1024).arrayBuffer()
  const arr = new Uint8Array(buf)

  if (arr.length >= 24 && arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e) {
    const width = (arr[16] << 24) | (arr[17] << 16) | (arr[18] << 8) | arr[19]
    const height = (arr[20] << 24) | (arr[21] << 16) | (arr[22] << 8) | arr[23]
    if (width > 0 && height > 0 && width < 0xffff && height < 0xffff) return { width, height }
  }

  if (arr.length >= 10 && arr[0] === 0xff && arr[1] === 0xd8) {
    for (let i = 2; i < arr.length - 9; i++) {
      if (arr[i] === 0xff && (arr[i + 1] === 0xc0 || arr[i + 1] === 0xc1)) {
        const height = (arr[i + 5] << 8) | arr[i + 6]
        const width = (arr[i + 7] << 8) | arr[i + 8]
        if (width > 0 && height > 0) return { width, height }
        break
      }
      if (
        arr[i] === 0xff &&
        arr[i + 1] >= 0xc0 &&
        arr[i + 1] <= 0xcf &&
        arr[i + 1] !== 0xc4 &&
        arr[i + 1] !== 0xc8
      ) {
        const height = (arr[i + 5] << 8) | arr[i + 6]
        const width = (arr[i + 7] << 8) | arr[i + 8]
        if (width > 0 && height > 0) return { width, height }
        break
      }
    }
  }

  if (
    arr.length >= 30 &&
    arr[0] === 0x52 &&
    arr[1] === 0x49 &&
    arr[2] === 0x46 &&
    arr[3] === 0x46
  ) {
    if (arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50) {
      if (arr[12] === 0x56 && arr[13] === 0x50 && arr[14] === 0x38 && arr[15] === 0x58) {
        const width = 1 + (arr[24] | (arr[25] << 8) | (arr[26] << 16))
        const height = 1 + (arr[27] | (arr[28] << 8) | (arr[29] << 16))
        if (width > 0 && height > 0) return { width, height }
      }
    }
  }

  return null
}

type LoadedImage =
  | { bitmap: ImageBitmap; width: number; height: number; isBitmap: true }
  | { img: HTMLImageElement; width: number; height: number; isBitmap: false }

async function loadImageWithOrientation(source: Blob | File | string): Promise<LoadedImage> {
  if (typeof createImageBitmap !== 'function') {
    return loadImageLegacy(source)
  }
  try {
    let blob: Blob
    if (source instanceof Blob) {
      blob = source
    } else if (typeof source === 'string') {
      const res = await fetch(source)
      blob = await res.blob()
    } else {
      return loadImageLegacy(source)
    }

    if (blob.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`Image file too large. Maximum ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`)
    }
    const dims = await getImageDimensionsFromHeader(blob)
    if (dims) checkDimensions(dims.width, dims.height)

    const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' })
    checkDimensions(bitmap.width, bitmap.height)
    return { bitmap, width: bitmap.width, height: bitmap.height, isBitmap: true }
  } catch {
    const size = source instanceof Blob ? source.size : 0
    if (size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `Image too large or unsupported format. Maximum ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`
      )
    }
    return loadImageLegacy(source)
  }
}

function loadImageLegacy(source: Blob | File | string): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error('Failed to load image'))
    img.onload = () => {
      checkDimensions(img.naturalWidth, img.naturalHeight)
      resolve({ img, width: img.naturalWidth, height: img.naturalHeight, isBitmap: false })
    }
    img.src =
      typeof source === 'string'
        ? source
        : source instanceof Blob
          ? URL.createObjectURL(source)
          : ''
  })
}

function supportsWebP(): boolean {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

const WEBP_SUPPORTED = typeof document !== 'undefined' && supportsWebP()

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
  format?: 'webp' | 'jpeg'
  timeout?: number
  returnBlob?: boolean
}

export const compressImage = (
  file: File,
  options: CompressOptions = {}
): Promise<string | Blob> => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.8,
    maxSizeKB = 500,
    format = WEBP_SUPPORTED ? 'webp' : 'jpeg',
    timeout = 10000,
    returnBlob = false,
  } = options

  const mime = format === 'webp' ? 'image/webp' : 'image/jpeg'

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Image compression timeout - image too large'))
    }, timeout)
    if (!file.type.startsWith('image/')) {
      clearTimeout(timeoutId)
      reject(new Error('File is not an image'))
      return
    }

    const processImage = async () => {
      const canvas = document.createElement('canvas')
      let loaded: LoadedImage | null = null
      try {
        loaded = await loadImageWithOrientation(file)
        clearTimeout(timeoutId)
        let { width, height } = loaded
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        if (loaded.isBitmap) {
          ctx.drawImage(loaded.bitmap, 0, 0, width, height)
        } else {
          ctx.drawImage(loaded.img, 0, 0, width, height)
        }

        const maxSizeBytes = maxSizeKB * 1024
        const getBlob = (mimeType: string, q: number) =>
          new Promise<Blob | null>((res) => {
            canvas.toBlob(res, mimeType, q)
          })

        const compressIteratively = async (): Promise<string | Blob> => {
          let effectiveMime = mime
          let minQ = 0.3
          let maxQ = quality
          let bestBlob: Blob | null = null
          for (let i = 0; i < 3; i++) {
            const mid = (minQ + maxQ) / 2
            let blob: Blob | null
            try {
              blob = await getBlob(effectiveMime, mid)
            } catch (err) {
              console.warn('toBlob failed, fallback to JPEG:', err)
              effectiveMime = 'image/jpeg'
              blob = await getBlob(effectiveMime, mid)
            }
            if (!blob) break
            bestBlob = blob
            if (blob.size <= maxSizeBytes) {
              minQ = mid
              break
            }
            maxQ = mid
          }
          if (!bestBlob) bestBlob = (await getBlob('image/jpeg', 0.5))!

          if (returnBlob) return bestBlob
          return new Promise<string>((res, rej) => {
            const reader = new FileReader()
            reader.onloadend = () => res(reader.result as string)
            reader.onerror = rej
            reader.readAsDataURL(bestBlob!)
          })
        }

        const result = await compressIteratively()
        resolve(result)
      } catch (err) {
        clearTimeout(timeoutId)
        reject(err)
      } finally {
        canvas.width = 0
        canvas.height = 0
        if (loaded?.isBitmap && 'bitmap' in loaded && loaded.bitmap) loaded.bitmap.close()
      }
    }

    processImage()
  })
}

export async function toJpegDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl
  if (dataUrl.startsWith('data:image/jpeg')) return dataUrl

  if (typeof createImageBitmap === 'function') {
    let bitmap: ImageBitmap | undefined
    const canvas = document.createElement('canvas')
    try {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      if (blob.size > MAX_FILE_SIZE_BYTES) {
        throw new Error(`Image too large. Maximum ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`)
      }
      const dims = await getImageDimensionsFromHeader(blob)
      if (dims) checkDimensions(dims.width, dims.height)
      bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' })
      checkDimensions(bitmap.width, bitmap.height)
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(bitmap, 0, 0)
      bitmap.close()
      bitmap = undefined
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            canvas.width = 0
            canvas.height = 0
            if (!b) {
              reject(new Error('Failed to convert to JPEG'))
              return
            }
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(b)
          },
          'image/jpeg',
          0.85
        )
      })
    } catch {
      /* fallback below */
    } finally {
      if (bitmap) bitmap.close()
      canvas.width = 0
      canvas.height = 0
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error('Failed to load image'))
    img.onload = () => {
      checkDimensions(img.naturalWidth, img.naturalHeight)
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to convert to JPEG'))
            return
          }
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        },
        'image/jpeg',
        0.85
      )
    }
    img.src = dataUrl
  })
}

export const getBase64Size = (base64: string): number => {
  const base64String = base64.split(',')[1] || base64
  return Math.round((base64String.length * 3) / 4)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default compressImage
