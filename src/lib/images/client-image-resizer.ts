/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Client-side image pre-scaler using HTMLCanvasElement / createImageBitmap.
 * Scales large photos (e.g. 5MB-25MB camera shots) down to a maximum bounding box
 * (default 1920x1920) before network transmission, reducing payload size by ~90-95%
 * in a few milliseconds and eliminating upload bottlenecks.
 */
export async function downscaleImageFile(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<File> {
  // Pass non-raster images (SVGs, animated GIFs) through unchanged
  if (
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif' ||
    !file.type.startsWith('image/')
  ) {
    return file;
  }

  // If running in an environment without DOM/Canvas support, fallback to original
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;

    // If image is already smaller than max bounds and under 800KB, no resize needed
    if (width <= maxDimension && height <= maxDimension && file.size < 800 * 1024) {
      bitmap.close();
      return file;
    }

    // Calculate proportional downscaled dimensions
    let targetWidth = width;
    let targetHeight = height;

    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        targetWidth = maxDimension;
        targetHeight = Math.round((height * maxDimension) / width);
      } else {
        targetHeight = maxDimension;
        targetWidth = Math.round((width * maxDimension) / height);
      }
    }

    // Render to off-screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    // Convert canvas to WebP Blob (falls back to JPEG if WebP unsupported)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            // Fallback to JPEG if browser fails on WebP
            canvas.toBlob((jpegBlob) => resolve(jpegBlob), 'image/jpeg', quality);
          }
        },
        'image/webp',
        quality
      );
    });

    if (!blob) {
      return file;
    }

    const outputExt = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const newFileName = `${baseName}.${outputExt}`;

    return new File([blob], newFileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn('[downscaleImageFile] Client downscale skipped, using original file:', err);
    return file;
  }
}
