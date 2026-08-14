'use client';

import { useEffect } from 'react';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `ATBPC | ${title}` : 'ATBPC';
  }, [title]);
}
