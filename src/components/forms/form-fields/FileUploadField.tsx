'use client';

import React, { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { FileFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type FileUploadFieldProps = Omit<FileFieldConfig, 'type'> & { type?: FileFieldConfig['type'] } & FieldRenderProps<File | null>;

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
  variant = 'default',
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

  const isCompact = variant === 'compact';

  return (
    <div className={`flex flex-col justify-end h-full ${isCompact ? 'space-y-0.5' : 'space-y-1'}`}>
      <label className={`${isCompact ? 'text-caption font-semibold' : 'text-micro font-archivo font-semibold'} block opacity-90 truncate`}>
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
        className={`${
          isCompact 
            ? 'h-[34px] px-3 py-1.5 flex-row justify-start text-left' 
            : 'h-20 p-2 flex-col justify-center text-center'
        } border rounded-xl flex items-center cursor-pointer transition-all ${
          dragOver ? 'border-space-sparkle bg-space-sparkle/10' : styles.borderColor
        }`}
      >
        {value ? (
          <div className={`max-w-full overflow-hidden flex items-center ${isCompact ? 'gap-2 w-full' : 'flex-col space-y-0.5 px-1'}`}>
            <FileText size={isCompact ? 14 : 16} className={`shrink-0 text-space-sparkle ${!isCompact && 'mx-auto'}`} />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className={`${isCompact ? 'text-caption' : 'text-micro font-archivo'} font-medium truncate opacity-90`}>{value.name}</p>
              {!isCompact && <p className="text-micro font-archivo opacity-60">{formatFileSize(value.size)}</p>}
            </div>
          </div>
        ) : (
          <div className={`flex items-center ${isCompact ? 'gap-2 w-full' : 'flex-col space-y-1 w-full'}`}>
            <Upload size={14} className={`shrink-0 opacity-70 ${!isCompact && 'mx-auto'}`} />
            <p className={`${isCompact ? 'text-caption truncate' : 'text-micro font-archivo leading-tight'} font-medium opacity-80`}>
              {dropHint} {typeHint && <span className={`${isCompact ? 'inline' : 'block'} opacity-60 ${isCompact ? '' : 'text-micro font-archivo'}`}>{typeHint}</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
