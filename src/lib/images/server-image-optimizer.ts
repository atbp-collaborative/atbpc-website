/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import sharp from 'sharp';

export interface OptimizedImageResult {
  buffer: Buffer;
  contentType: string;
  ext: string;
}

/**
 * Server-side image optimizer using Sharp.
 * Automatically:
 * 1. Auto-orients mobile photos according to EXIF rotation tags.
 * 2. Downscales dimensions to a maximum bounding box (default 1920x1920) preserving aspect ratio.
 * 3. Compresses to modern, high-efficiency WebP format (or preserves SVG / GIF).
 * 4. Strips unnecessary metadata bloat, reducing 10MB+ images to ~150KB–300KB.
 */
export async function optimizeImageBuffer(
  buffer: Buffer,
  rawMimeType?: string,
  options: { maxDimension?: number; quality?: number } = {}
): Promise<OptimizedImageResult> {
  const maxDim = options.maxDimension ?? 1920;
  const quality = options.quality ?? 82;

  // Pass non-raster formats (SVGs, GIFs) through unchanged
  if (
    rawMimeType === 'image/svg+xml' ||
    rawMimeType === 'image/gif'
  ) {
    const ext = rawMimeType === 'image/svg+xml' ? 'svg' : 'gif';
    return {
      buffer,
      contentType: rawMimeType,
      ext,
    };
  }

  try {
    const pipeline = sharp(buffer)
      .rotate() // Auto-orient based on EXIF tag
      .resize({
        width: maxDim,
        height: maxDim,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality });

    const optimizedBuffer = await pipeline.toBuffer();

    return {
      buffer: optimizedBuffer,
      contentType: 'image/webp',
      ext: 'webp',
    };
  } catch (err) {
    console.warn('[optimizeImageBuffer] Sharp optimization skipped or failed, using original buffer:', err);
    const fallbackExt = rawMimeType?.includes('png') ? 'png' : 'jpg';
    return {
      buffer,
      contentType: rawMimeType || 'image/jpeg',
      ext: fallbackExt,
    };
  }
}
