/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, ArrowUp, ArrowDown, ImageIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';
import { uploadProjectMediaAction } from '@/app/actions/admin-mutations';
import { downscaleImageFile } from '@/lib/images/client-image-resizer';
import { toast } from 'sonner';

interface ImageManagerFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
  single?: boolean;
  label?: string;
  helperText?: string;
  folder?: string;
  emptyFallbackSrc?: string;
  onUploaded?: (urls: string[]) => void;
}

export const ImageManagerField: React.FC<ImageManagerFieldProps> = ({
  images = [],
  onChange,
  single = false,
  label = 'Images',
  helperText = 'Upload images from your device.',
  folder = 'projects',
  emptyFallbackSrc,
  onUploaded,
}) => {
  const { isDarkMode } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null);

  const processFiles = async (files: FileList | File[]) => {
    const validImageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (validImageFiles.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WEBP, SVG).');
      return;
    }

    const filesToUpload = single ? [validImageFiles[0]] : validImageFiles;
    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (rawFile) => {
        // Automatically downscale large image files client-side before transmission
        const file = await downscaleImageFile(rawFile, 1920, 0.85);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await uploadProjectMediaAction(formData);
        if (res.success && res.url) {
          return res.url;
        }
        throw new Error(res.error || 'Failed to upload image to Supabase Storage');
      });

      const outcomes = await Promise.allSettled(uploadPromises);
      const uploadedUrls = outcomes
        .filter((outcome): outcome is PromiseFulfilledResult<string> => outcome.status === 'fulfilled')
        .map((outcome) => outcome.value);
      onUploaded?.(uploadedUrls);
      const failed = outcomes.find((outcome): outcome is PromiseRejectedResult => outcome.status === 'rejected');
      if (failed) throw failed.reason;

      if (single) {
        onChange([uploadedUrls[0]]);
      } else {
        onChange([...images, ...uploadedUrls]);
      }
      toast.success(
        single
          ? 'Image uploaded successfully to cloud storage'
          : `${uploadedUrls.length} image(s) uploaded successfully to cloud storage`
      );
    } catch (err: any) {
      console.error('Failed to upload image files:', err);
      toast.error(err?.message || 'Failed to upload image to cloud storage');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value so re-uploading the same file triggers change
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    const newArr = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    onChange(newArr);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const coverImage = images[0];
  const previewImage = coverImage === failedPreviewUrl && emptyFallbackSrc
    ? emptyFallbackSrc
    : coverImage;
  const subsequentImages = images.slice(1);

  return (
    <div className="space-y-4">
      {/* Header and label */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-caption font-semibold uppercase tracking-wider block">
            {label} {!single && `(${images.length})`}
          </label>
          {helperText && <p className="text-micro opacity-60 mt-0.5">{helperText}</p>}
        </div>


      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={!single}
        className="hidden"
      />

      {isUploading && (
        <div className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-space-sparkle/10 border border-space-sparkle/30 text-space-sparkle text-caption font-medium animate-pulse">
          <RefreshCw size={16} className="animate-spin" />
          <span>Uploading image(s) to cloud storage... Please wait</span>
        </div>
      )}

      {/* Upload Dropzone (shown when empty, or as compact trigger when images exist) */}
      {images.length === 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={triggerUpload}
          className={`p-8 rounded-xl border-2 border-dashed text-center space-y-3 cursor-pointer transition-all ${
            dragOver
              ? 'border-space-sparkle bg-space-sparkle/10'
              : isDarkMode
              ? 'border-white/15 bg-white/5 hover:border-space-sparkle/60 hover:bg-white/10'
              : 'border-black/15 bg-black/5 hover:border-space-sparkle/60 hover:bg-black/10'
          }`}
        >
          {emptyFallbackSrc ? (
            <div className={`relative mx-auto overflow-hidden ${single ? 'w-24 h-24 rounded-full' : 'w-full max-w-[280px] aspect-video rounded-lg'}`}>
              <Image
                src={emptyFallbackSrc}
                alt={single ? 'Fallback profile avatar' : 'Project image placeholder'}
                fill
                sizes={single ? '96px' : '280px'}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-space-sparkle/15 text-space-sparkle">
              <Upload size={22} />
            </div>
          )}
          <div className="space-y-1">
            <p className="text-caption font-medium">
              Click to upload or drag & drop image {single ? 'file' : 'files'}
            </p>
            <p className="text-micro opacity-50">PNG, JPG, WEBP, or SVG accepted</p>
          </div>
        </div>
      ) : (
        /* Image Display Section: 1st picture is full width, remaining pictures in grid */
        <div className="space-y-3">
          {/* Primary / 1st Picture: Full Width */}
          <div
            className={`relative w-full rounded-xl border overflow-hidden group transition-all ${
              isDarkMode ? 'border-white/15 bg-white/5' : 'border-black/15 bg-black/5'
            }`}
          >
            <div
              className={`relative w-full ${
                single
                  ? 'aspect-[4/5] sm:aspect-[3/4] max-h-[460px]'
                  : 'aspect-video sm:aspect-16/9'
              }`}
            >
              <Image
                src={previewImage}
                alt={single ? 'Profile portrait preview' : 'Cover image preview'}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                onError={() => {
                  if (emptyFallbackSrc && previewImage !== emptyFallbackSrc) {
                    setFailedPreviewUrl(coverImage);
                  }
                }}
              />
            </div>

            {/* Overlay Bar */}
            <div className="p-2.5 flex items-center justify-between bg-vintage-charcoal/90 text-white backdrop-blur-xs">
              <span className="text-micro font-mono uppercase tracking-wider font-semibold text-space-sparkle flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-space-sparkle" />
                #1 {single ? 'Profile Portrait' : 'Cover Image'}
              </span>

              <div className="flex items-center gap-1.5">
                {single ? (
                  <button
                    type="button"
                    onClick={triggerUpload}
                    className="flex items-center gap-1 px-2 py-1 text-micro rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    title="Replace Portrait"
                  >
                    <RefreshCw size={12} /> Replace
                  </button>
                ) : (
                  subsequentImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(0, 'down')}
                      className="p-1 hover:bg-white/20 rounded cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(0)}
                  className="p-1 text-red-400 hover:bg-red-500/20 rounded cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Subsequent Pictures (Gallery #2+): Grid Layout */}
          {!single && subsequentImages.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-micro font-semibold uppercase tracking-wider opacity-60 block">
                Gallery Photos ({subsequentImages.length})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subsequentImages.map((url, i) => {
                  const actualIdx = i + 1;
                  return (
                    <div
                      key={actualIdx}
                      className={`relative rounded-lg border overflow-hidden group ${
                        isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
                      }`}
                    >
                      <div className="relative aspect-video w-full">
                        <Image
                          src={url}
                          alt={`Gallery Preview #${actualIdx + 1}`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>

                      {/* Item controls */}
                      <div className="p-2 flex items-center justify-between bg-vintage-charcoal/85 text-white backdrop-blur-xs">
                        <span className="text-micro truncate max-w-[80px] font-mono">
                          #{actualIdx + 1}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMove(actualIdx, 'up')}
                            className="p-1 hover:bg-white/20 rounded cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(actualIdx, 'down')}
                            disabled={actualIdx === images.length - 1}
                            className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(actualIdx)}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add More Button at bottom of photography list */}
          {!single && (
            <div className="pt-2">
              <Button
                type="ghost"
                onClick={triggerUpload}
                className="w-full !py-2.5 text-mini border border-dashed border-black/20 dark:border-white/20 hover:border-space-sparkle flex items-center justify-center gap-1.5"
              >
                <Upload size={14} className="mr-1 inline" /> Add More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
