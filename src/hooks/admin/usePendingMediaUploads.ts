'use client';

import { useCallback, useRef } from 'react';
import { deleteStorageFileAction } from '@/app/actions/admin-mutations';

export function usePendingMediaUploads() {
  const pending = useRef(new Set<string>());

  const track = useCallback((urls: string[]) => {
    urls.forEach((url) => pending.current.add(url));
  }, []);

  const cleanup = useCallback(async (keep: string[] = []) => {
    const retained = new Set(keep);
    const snapshot = [...pending.current];
    const discarded = snapshot.filter((url) => !retained.has(url));
    const results = await Promise.all(discarded.map((url) => deleteStorageFileAction(url)));
    results.forEach((result, index) => {
      if (!result.success) console.warn('Pending upload cleanup failed', discarded[index], result.error);
      else pending.current.delete(discarded[index]);
    });
    snapshot.filter((url) => retained.has(url)).forEach((url) => pending.current.delete(url));
  }, []);

  return { track, cleanup };
}
