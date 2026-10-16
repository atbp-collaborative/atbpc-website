/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, ArrowUp, ArrowDown, ImageIcon } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';

interface ImageManagerFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
  single?: boolean;
  label?: string;
  helperText?: string;
}

const PRESET_ARCHITECTURAL_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
];

export const ImageManagerField: React.FC<ImageManagerFieldProps> = ({
  images = [],
  onChange,
  single = false,
  label = 'Images',
  helperText = 'Add URLs for images stored in Supabase or hosted externally.',
}) => {
  const { isDarkMode } = useTheme();
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = (urlToAdd?: string) => {
    const url = (urlToAdd || newUrl).trim();
    if (!url) return;

    if (single) {
      onChange([url]);
    } else {
      onChange([...images, url]);
    }
    setNewUrl('');
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

  const inputClass = `w-full text-caption px-3 py-2 rounded-lg border outline-none ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-caption font-semibold uppercase tracking-wider block">
          {label} ({images.length})
        </label>
        {helperText && <p className="text-micro opacity-60 mt-0.5">{helperText}</p>}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="https://images.unsplash.com/... or supabase storage URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className={inputClass}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          type="filled"
          onClick={() => handleAdd()}
          disabled={!newUrl.trim()}
          className="!py-2 !px-4 text-mini shrink-0"
        >
          <Plus size={14} className="mr-1 inline" /> {single ? 'Set' : 'Add'}
        </Button>
      </div>

      {/* Quick preset selector for testing convenience */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-micro opacity-60">Quick Presets:</span>
        {PRESET_ARCHITECTURAL_IMAGES.slice(0, 4).map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAdd(preset)}
            className="text-micro px-2 py-0.5 rounded border border-black/10 dark:border-white/10 hover:border-space-sparkle text-space-sparkle cursor-pointer"
          >
            Preset {idx + 1}
          </button>
        ))}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg border overflow-hidden group ${
                isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
              }`}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Overlay controls */}
              <div className="p-2 flex items-center justify-between bg-vintage-charcoal/85 text-white backdrop-blur-xs">
                <span className="text-micro truncate max-w-[90px] font-mono">
                  #{idx + 1} {idx === 0 ? '(Cover)' : ''}
                </span>

                <div className="flex items-center gap-1">
                  {!single && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                        title="Move up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1 hover:bg-white/20 rounded disabled:opacity-30 cursor-pointer"
                        title="Move down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded cursor-pointer"
                    title="Remove image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-lg border border-dashed border-black/15 dark:border-white/15 text-center space-y-1">
          <ImageIcon size={24} className="mx-auto opacity-40 text-space-sparkle" />
          <p className="text-mini opacity-60">No images added yet.</p>
        </div>
      )}
    </div>
  );
};
