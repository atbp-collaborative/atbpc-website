/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/primitives/buttons/Button';
import { useTheme } from '@/context/ThemeContext';

interface StringListProps {
  mode: 'strings';
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
  helperText?: string;
  layout?: 'chips' | 'rows';
}

interface PairItem {
  title: string;
  description: string;
}

interface PairListProps {
  mode: 'pairs';
  items: PairItem[];
  onChange: (items: PairItem[]) => void;
  label: string;
  titlePlaceholder?: string;
  descPlaceholder?: string;
  helperText?: string;
}

export type DynamicListFieldProps = StringListProps | PairListProps;

export const DynamicListField: React.FC<DynamicListFieldProps> = (props) => {
  const { isDarkMode } = useTheme();
  const [newString, setNewString] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const inputClass = `w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${
    isDarkMode
      ? 'border-bright-gray/20 bg-vintage-charcoal/50 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'border-vintage-charcoal/20 bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

  if (props.mode === 'strings') {
    const { items = [], onChange, label, placeholder = 'Add item...', helperText, layout = 'chips' } = props;

    const handleAdd = () => {
      if (!newString.trim()) return;
      onChange([...items, newString.trim()]);
      setNewString('');
    };

    const handleRemove = (idx: number) => {
      onChange(items.filter((_, i) => i !== idx));
    };

    return (
      <div className="space-y-2">
        <label className="text-caption font-semibold uppercase tracking-wider block">
          {label} ({items.length})
        </label>
        {helperText && <p className="text-micro opacity-60">{helperText}</p>}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={placeholder}
            value={newString}
            onChange={(e) => setNewString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            className={inputClass}
          />
          <Button
            type="filled"
            onClick={handleAdd}
            disabled={!newString.trim()}
            className="!py-1.5 !px-3 text-mini shrink-0"
          >
            <Plus size={13} className="mr-1 inline" /> Add
          </Button>
        </div>

        {items.length > 0 && (
          layout === 'rows' ? (
            <div className="space-y-1.5 pt-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-caption ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-bright-gray'
                      : 'bg-black/5 border-black/10 text-vintage-charcoal'
                  }`}
                >
                  <span className="truncate flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer transition-colors shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {items.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-mini border ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-bright-gray'
                      : 'bg-black/5 border-black/10 text-vintage-charcoal'
                  }`}
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </span>
              ))}
            </div>
          )
        )}
      </div>
    );
  }

  // Pairs mode (e.g. Affiliations)
  const {
    items = [],
    onChange,
    label,
    titlePlaceholder = 'Affiliation / Title',
    descPlaceholder = 'Description...',
    helperText,
  } = props;

  const handleAddPair = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    onChange([...items, { title: newTitle.trim(), description: newDesc.trim() }]);
    setNewTitle('');
    setNewDesc('');
  };

  const handleRemovePair = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <label className="text-caption font-semibold uppercase tracking-wider block">
        {label} ({items.length})
      </label>
      {helperText && <p className="text-micro opacity-60">{helperText}</p>}

      {/* Existing pair items */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
              }`}
            >
              <div className="space-y-1 flex-1">
                <span className="font-semibold text-caption block">{item.title}</span>
                <p className="text-mini opacity-70 leading-relaxed">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePair(idx)}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer"
                title="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row for new pair */}
      <div
        className={`p-3 rounded-lg border space-y-2 ${
          isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
        }`}
      >
        <span className="text-micro uppercase font-semibold text-space-sparkle block">
          + Add New Entry
        </span>
        <input
          type="text"
          placeholder={titlePlaceholder}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className={inputClass}
        />
        <textarea
          placeholder={descPlaceholder}
          rows={2}
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className={inputClass}
        />
        <div className="flex justify-end pt-1">
          <Button
            type="filled"
            onClick={handleAddPair}
            disabled={!newTitle.trim() || !newDesc.trim()}
            className="!py-1.5 !px-3 text-mini"
          >
            <Plus size={13} className="mr-1 inline" /> Add Entry
          </Button>
        </div>
      </div>
    </div>
  );
};
