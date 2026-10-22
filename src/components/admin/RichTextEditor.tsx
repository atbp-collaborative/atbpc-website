/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  Minus,
  RemoveFormatting,
  Undo,
  Redo,
  Code,
  Eye,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Compose policy text here...',
  minHeight = '280px',
  disabled = false,
}: RichTextEditorProps) {
  const { isDarkMode } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync external value changes into editor DOM only when content differs
  useEffect(() => {
    if (!isCodeView && editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isCodeView]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (disabled || isCodeView) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInsertLink = () => {
    if (!linkUrl) {
      setLinkInputOpen(false);
      return;
    }
    restoreSelection();
    const formattedUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('mailto:')
      ? linkUrl
      : `https://${linkUrl}`;
    executeCommand('createLink', formattedUrl);
    setLinkUrl('');
    setLinkInputOpen(false);
  };

  const openLinkPrompt = () => {
    saveSelection();
    setLinkInputOpen(true);
  };

  const toolbarBtnClass = (active = false) =>
    `p-1.5 rounded transition-all cursor-pointer flex items-center justify-center shrink-0 ${
      active
        ? 'bg-space-sparkle text-white'
        : isDarkMode
          ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white'
          : 'hover:bg-black/10 text-vintage-charcoal/80 hover:text-black'
    }`;

  return (
    <div
      className={`rounded-xl border transition-all overflow-hidden flex flex-col ${
        isDarkMode
          ? 'border-bright-gray/20 bg-vintage-charcoal/40 text-bright-gray'
          : 'border-vintage-charcoal/20 bg-white text-vintage-charcoal'
      }`}
    >
      {/* Toolbar */}
      <div
        className={`p-2 border-b flex flex-wrap items-center gap-1 text-mini select-none ${
          isDarkMode ? 'border-white/10 bg-vintage-charcoal/60' : 'border-black/10 bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-0.5 pr-2 border-r border-black/10 dark:border-white/10">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('undo');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('redo');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={14} />
          </button>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-black/10 dark:border-white/10">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Underline (Ctrl+U)"
          >
            <Underline size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </button>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-black/10 dark:border-white/10">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h2>');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Heading 2"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h3>');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Heading 3"
          >
            <Heading3 size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<p>');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Paragraph"
          >
            <Pilcrow size={14} />
          </button>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-black/10 dark:border-white/10">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<blockquote>');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Blockquote"
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertHorizontalRule');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Horizontal Divider"
          >
            <Minus size={14} />
          </button>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-black/10 dark:border-white/10">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              openLinkPrompt();
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Insert Link"
          >
            <LinkIcon size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('unlink');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Remove Link"
          >
            <Unlink size={14} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('removeFormat');
            }}
            disabled={disabled || isCodeView}
            className={toolbarBtnClass()}
            title="Clear Formatting"
          >
            <RemoveFormatting size={14} />
          </button>
        </div>

        {/* View Toggle */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCodeView((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-micro font-mono uppercase tracking-wider transition-all cursor-pointer ${
              isCodeView
                ? 'bg-space-sparkle text-white font-semibold'
                : isDarkMode
                  ? 'hover:bg-white/10 text-bright-gray/70'
                  : 'hover:bg-black/10 text-vintage-charcoal/70'
            }`}
            title={isCodeView ? 'Switch to Visual WYSIWYG editor' : 'Switch to Raw HTML editor'}
          >
            {isCodeView ? (
              <>
                <Eye size={13} />
                <span>Visual</span>
              </>
            ) : (
              <>
                <Code size={13} />
                <span>HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Link Input Dialog Popup */}
      {linkInputOpen && (
        <div
          className={`p-2.5 border-b flex items-center gap-2 ${
            isDarkMode ? 'bg-vintage-charcoal border-white/10' : 'bg-gray-100 border-black/10'
          }`}
        >
          <span className="text-micro font-semibold uppercase tracking-wider opacity-70">Link URL:</span>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInsertLink();
              } else if (e.key === 'Escape') {
                setLinkInputOpen(false);
              }
            }}
            autoFocus
            className={`flex-1 px-2.5 py-1 text-caption rounded border outline-none ${
              isDarkMode
                ? 'bg-vintage-charcoal/80 border-white/20 text-white focus:border-space-sparkle'
                : 'bg-white border-black/20 text-black focus:border-space-sparkle'
            }`}
          />
          <button
            type="button"
            onClick={handleInsertLink}
            className="px-3 py-1 bg-space-sparkle text-white text-micro font-semibold rounded cursor-pointer hover:opacity-90"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkInputOpen(false)}
            className="px-2 py-1 text-micro opacity-70 hover:opacity-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Content Area */}
      {isCodeView ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="<p>Enter raw HTML content here...</p>"
          style={{ minHeight }}
          className={`w-full p-4 font-mono text-micro sm:text-caption leading-relaxed outline-none resize-y border-none ${
            isDarkMode ? 'bg-vintage-charcoal/80 text-emerald-300' : 'bg-gray-900 text-emerald-400'
          }`}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="p-4 sm:p-5 outline-none overflow-y-auto leading-relaxed text-caption prose dark:prose-invert max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none [&_h2]:text-body [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h3]:text-caption [&_h3]:font-bold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_p]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2.5 [&_blockquote]:border-l-2 [&_blockquote]:border-space-sparkle [&_blockquote]:pl-3.5 [&_blockquote]:italic [&_blockquote]:opacity-85 [&_blockquote]:my-3 [&_a]:text-space-sparkle [&_a]:underline [&_hr]:my-4 [&_hr]:border-black/10 dark:[&_hr]:border-white/10"
        />
      )}
    </div>
  );
}
