import { useEffect, useState } from 'react';

export function useContentProtection(enabled: boolean = false) {
  const [isShielded, setIsShielded] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsShielded(false);
      return;
    }

    // 1. Disable Right Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Dragging (Images, Links, Text)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 3. Disable Text Selection Start
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // 4. Disable Copy / Cut
    const handleCopyCut = (e: ClipboardEvent) => {
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
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Block Save (Ctrl+S / Cmd+S)
      if (isCmdOrCtrl && key === 's') {
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
      if (e.key === 'PrintScreen' || e.key === 'PrtScn' || e.key.toLowerCase() === 'printscreen') {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
        setIsShielded(true);
        setTimeout(() => setIsShielded(false), 1500);
      }
    };

    // 6. Netflix-style DRM Screen Blur / Blackout on Window Blur & Visibility Change
    const handleBlur = () => {
      setIsShielded(true);
    };

    const handleFocus = () => {
      setIsShielded(false);
    };

    const handleVisibilityChange = () => {
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
