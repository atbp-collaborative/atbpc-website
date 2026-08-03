import { usePathname } from 'next/navigation';

export interface ActiveNav {
  isWorksActive: boolean;
  isStudioActive: boolean;
  isContactActive: boolean;
  currentCategoryFilter: string;
}

/**
 * Single source of truth for which top-level nav section is "active" for a
 * given pathname. Mirrors Header.tsx's own computation — kept as a shared
 * hook so Header and MobileDrawer can't drift out of sync with each other.
 */
export function useActiveNav(): ActiveNav {
  const pathname = usePathname();

  const worksSlug = pathname.startsWith('/works/') ? pathname.split('/')[2] : null;
  const currentCategoryFilter = worksSlug ? decodeURIComponent(worksSlug) : 'All';

  const isWorksActive = pathname.startsWith('/works');
  const isStudioActive =
    pathname.startsWith('/our-services') ||
    pathname.startsWith('/our-people') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/studio/');
  const isContactActive =
    pathname.startsWith('/contact') ||
    pathname === '/career' ||
    pathname === '/supplier' ||
    pathname === '/builder' ||
    pathname === '/consultant';

  return { isWorksActive, isStudioActive, isContactActive, currentCategoryFilter };
}
