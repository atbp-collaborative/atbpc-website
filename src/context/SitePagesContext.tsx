'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { SitePage } from '@/types';

interface SitePagesContextValue {
  sitePages: SitePage[];
  isSubpageDraft: (slugOrRoute: string) => boolean;
  getPageBySlug: (slugOrRoute: string) => SitePage | undefined;
}

const SitePagesContext = createContext<SitePagesContextValue | undefined>(undefined);

function normalizeSlug(path: string): string {
  return path.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
}

export function SitePagesProvider({
  sitePages = [],
  children,
}: {
  sitePages?: SitePage[];
  children: React.ReactNode;
}) {
  const value = useMemo(() => {
    const pageMap = new Map<string, SitePage>();

    sitePages.forEach((page) => {
      if (!page?.id) return;
      const normalizedId = normalizeSlug(page.id);
      pageMap.set(normalizedId, page);

      // Also index by last segment if id is a path like "studio/our-services/piecework-services"
      if (normalizedId.includes('/')) {
        const segments = normalizedId.split('/');
        const lastSegment = segments[segments.length - 1];
        if (lastSegment && !pageMap.has(lastSegment)) {
          pageMap.set(lastSegment, page);
        }
      }
    });

    const getPageBySlug = (slugOrRoute: string): SitePage | undefined => {
      const normalized = normalizeSlug(slugOrRoute);
      if (pageMap.has(normalized)) return pageMap.get(normalized);

      // Check last segment fallback
      if (normalized.includes('/')) {
        const segments = normalized.split('/');
        const last = segments[segments.length - 1];
        if (pageMap.has(last)) return pageMap.get(last);
      }
      return undefined;
    };

    const isSubpageDraft = (slugOrRoute: string): boolean => {
      const page = getPageBySlug(slugOrRoute);
      return Boolean(page?.isDraft);
    };

    return {
      sitePages,
      isSubpageDraft,
      getPageBySlug,
    };
  }, [sitePages]);

  return <SitePagesContext.Provider value={value}>{children}</SitePagesContext.Provider>;
}

export function useSitePages(): SitePagesContextValue {
  const context = useContext(SitePagesContext);
  if (!context) {
    return {
      sitePages: [],
      isSubpageDraft: () => false,
      getPageBySlug: () => undefined,
    };
  }
  return context;
}

export function useIsSubpageDraft(slugOrRoute: string): boolean {
  const { isSubpageDraft } = useSitePages();
  return isSubpageDraft(slugOrRoute);
}
