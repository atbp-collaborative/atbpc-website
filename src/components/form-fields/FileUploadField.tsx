'use client';

import React, { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { FileFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type FileUploadFieldProps = FileFieldConfig & FieldRenderProps<File | null>;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  name,
  label,
  badge,
  accept = '.pdf',
  dropHint = 'Click / Drag to Upload',
  typeHint,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidType = (file: File) => (accept.includes('pdf') ? file.type === 'application/pdf' : true);

  const acceptFile = (file: File) => {
    if (!isValidType(file)) {
      alert(`Please upload a ${accept} file for ${label}.`);
      return;
    }
    onChange(name, file);
  };

  return (
    <div className="space-y-1">
      <label className="text-micro font-archivo font-semibold block opacity-90 truncate">
        {label}
        {badge && <span className="text-space-sparkle font-normal"> ({badge})</span>}
      </label>
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) acceptFile(e.target.files[0]);
        }}
        accept={accept}
        className="hidden"
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) acceptFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`h-20 p-2 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          dragOver ? 'border-space-sparkle bg-space-sparkle/10' : styles.borderColor
        }`}
      >
        {value ? (
          <div className="space-y-0.5 max-w-full px-1">
            <FileText size={16} className="mx-auto text-space-sparkle" />
            <p className="text-micro font-archivo font-medium truncate opacity-90">{value.name}</p>
            <p className="text-micro font-archivo opacity-60">{formatFileSize(value.size)}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload size={14} className="mx-auto opacity-70" />
            <p className="text-micro font-archivo leading-tight font-medium opacity-80">
              {dropHint} {typeHint && <span className="block opacity-60 text-micro font-archivo">{typeHint}</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
