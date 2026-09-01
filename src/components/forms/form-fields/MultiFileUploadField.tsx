'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { getFieldThemeStyles } from './fieldStyles';

interface Base64File {
  name: string;
  type: string;
  size: number;
  content: string; // base64
}

interface MultiFileUploadFieldProps {
  name: string;
  label?: string;
  note?: string;
  accept?: string;
  value: Base64File[];
  onChange: (name: string, value: Base64File[]) => void;
  isDarkMode: boolean;
}

export const MultiFileUploadField: React.FC<MultiFileUploadFieldProps> = ({
  name,
  label,
  note,
  accept = '.pdf',
  value = [],
  onChange,
  isDarkMode,
}) => {
  const styles = getFieldThemeStyles('neutral', isDarkMode);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: Base64File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Only process if it matches accept (very basic check)
      if (accept.includes('pdf') && file.type !== 'application/pdf') {
        alert(`Please upload only PDF files.`);
        continue;
      }

      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        content: base64,
      });
    }

    if (newFiles.length > 0) {
      onChange(name, [...value, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(name, newFiles);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      {label && (
        <label className="text-caption font-sans font-medium text-space-sparkle flex flex-col sm:flex-row sm:items-baseline">
          <span>{label}</span>
          {note && <span className="sm:ml-2 mt-1 sm:mt-0 text-micro opacity-60 font-normal">{note}</span>}
        </label>
      )}

      <div
        className={`w-full min-h-24 p-4 rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? 'border-space-sparkle bg-space-sparkle/10' : `${styles.borderColor.replace('border-vintage-charcoal/30', 'border-vintage-charcoal/30').replace('border-bright-gray/30', 'border-bright-gray/30')} bg-transparent hover:bg-space-sparkle/5`
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="opacity-50 mb-2" size={24} />
        <p className="text-sm opacity-80 text-center">Click or drag files here to upload</p>
      </div>
      
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => processFiles(e.target.files)}
        accept={accept}
        multiple
        className="hidden"
      />

      {value.length > 0 && (
        <div className="mt-3 space-y-2">
          {value.map((file, idx) => (
            <div key={idx} className={`flex items-center justify-between p-2 rounded border ${styles.borderColor} bg-space-sparkle/5`}>
              <div className="flex items-center space-x-3 overflow-hidden">
                <FileIcon size={16} className="shrink-0 opacity-70" />
                <span className="text-sm truncate font-medium opacity-90">{file.name}</span>
                <span className="text-xs opacity-50 shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="p-1 rounded-full hover:bg-space-sparkle/20 transition-colors"
                title="Remove file"
              >
                <X size={14} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
