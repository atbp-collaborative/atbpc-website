import { useEffect, useState } from 'react';

export function useContentProtection(enabled: boolean = false) {
  const [isShielded, setIsShielded] = useState(false);

  useEffect(() => {
    // Content protection strictly applies to public pages, never administrative routes
    const isInsideAdmin =
      typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

    if (!enabled || isInsideAdmin) {
      setIsShielded(false);
      return;
    }

    const isCurrentPathAdmin = () => {
      return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    };

    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      if (isCurrentPathAdmin()) return true;
      e.preventDefault();
      return false;
    };

    // 2. Disable Dragging (Images, Links, Text)
    const handleDragStart = (e: DragEvent) => {
      if (isCurrentPathAdmin()) return true;
      e.preventDefault();
      return false;
    };

    // 3. Disable Text Selection Start
    const handleSelectStart = (e: Event) => {
      if (isCurrentPathAdmin()) return true;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // 4. Disable Copy / Cut
    const handleCopyCut = (e: ClipboardEvent) => {
      if (isCurrentPathAdmin()) return true;
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return true;
      }
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '');
      }
      return false;
    };

    // 5. Intercept Hotkeys (Save, Print, DevTools, View Source, Screenshot)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCurrentPathAdmin()) return true;
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Block Snipping Tool (Win+Shift+S) and Mac Screenshots (Cmd+Shift+3/4/5)
      if (
        (e.metaKey && e.shiftKey && key === 's') ||
        (e.metaKey && e.shiftKey && (key === '3' || key === '4' || key === '5'))
      ) {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        setIsShielded(true);
        setTimeout(() => setIsShielded(false), 2500);
        return false;
      }

      // Block Save (Ctrl+S / Cmd+S) - Ensure it doesn't catch Win+Shift+S by checking shiftKey
      if (isCmdOrCtrl && key === 's' && !e.shiftKey) {
        e.preventDefault();
        return false;
      }

      // Block Print (Ctrl+P / Cmd+P)
      if (isCmdOrCtrl && key === 'p') {
        e.preventDefault();
        return false;
      }

      // Block View Source (Ctrl+U / Cmd+U)
      if (isCmdOrCtrl && key === 'u') {
        e.preventDefault();
        return false;
      }

      // Block DevTools (F12, Ctrl+Shift+I, Cmd+Opt+I, Ctrl+Shift+J, Cmd+Opt+J, Ctrl+Shift+C, Cmd+Opt+C)
      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (e.metaKey && e.altKey && (key === 'i' || key === 'j' || key === 'c'))
      ) {
        e.preventDefault();
        return false;
      }

      // Block PrintScreen / PrtScn key
      if (e.key === 'PrintScreen' || e.key === 'PrtScn' || key === 'printscreen') {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        setIsShielded(true);
        setTimeout(() => setIsShielded(false), 1500);
        return false;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isCurrentPathAdmin()) return;
      const key = e.key.toLowerCase();
      if (e.key === 'PrintScreen' || e.key === 'PrtScn' || key === 'printscreen') {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        setIsShielded(true);
        setTimeout(() => setIsShielded(false), 1500);
      }

      if (
        (e.metaKey && e.shiftKey && key === 's') ||
        (e.metaKey && e.shiftKey && (key === '3' || key === '4' || key === '5'))
      ) {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        setIsShielded(true);
        setTimeout(() => setIsShielded(false), 2500);
      }
    };

    // 6. DRM Screen Blur on Window Blur & Visibility Change (Public Only)
    const handleBlur = () => {
      if (isCurrentPathAdmin()) return;
      setIsShielded(true);
    };

    const handleFocus = () => {
      setIsShielded(false);
    };

    const handleVisibilityChange = () => {
      if (isCurrentPathAdmin()) {
        setIsShielded(false);
        return;
      }
      if (document.hidden) {
        setIsShielded(true);
      } else {
        setIsShielded(false);
      }
    };

    // Attach event listeners
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('dragstart', handleDragStart, true);
    window.addEventListener('selectstart', handleSelectStart, true);
    window.addEventListener('copy', handleCopyCut, true);
    window.addEventListener('cut', handleCopyCut, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('dragstart', handleDragStart, true);
      window.removeEventListener('selectstart', handleSelectStart, true);
      window.removeEventListener('copy', handleCopyCut, true);
      window.removeEventListener('cut', handleCopyCut, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return { isShielded };
}
