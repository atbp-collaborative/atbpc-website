/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * UUID v4 validator
 */
export function isUuid(str?: string | null): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str.trim());
}

/**
 * Clean, readable slug generator for projects.
 * Guaranteed to generate human-readable kebab-case strings and never a UUID.
 */
export function generateProjectSlug(title?: string, year?: string): string {
  if (!title || !title.trim()) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `project-${year || new Date().getFullYear()}-${randomSuffix}`;
  }

  const clean = title
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return clean || `project-${Math.floor(100 + Math.random() * 900)}`;
}

/**
 * Canonical Database Project Categories (The 3 Core Pillars)
 */
export const CANONICAL_CATEGORIES = ['Shelter', 'Livelihood', 'Community'] as const;
export type CanonicalCategoryId = (typeof CANONICAL_CATEGORIES)[number];

const CATEGORY_MAP: Record<string, CanonicalCategoryId> = {
  shelter: 'Shelter',
  residential: 'Shelter',
  livelihood: 'Livelihood',
  commercial: 'Livelihood',
  community: 'Community',
  institutional: 'Community',
};

export function normalizeCategoryId(categoryOrId?: string | null): CanonicalCategoryId {
  if (!categoryOrId) return 'Shelter';
  const key = categoryOrId.toLowerCase().trim();
  return CATEGORY_MAP[key] || 'Shelter';
}

/**
 * Canonical Database Project Typologies (foreign key values in project_typologies table)
 */
const TYPOLOGY_SLUG_MAP: Record<string, string> = {
  // Shelter
  'tiny living': 'tiny-living',
  'tiny-living': 'tiny-living',
  'tinyliving': 'tiny-living',
  'multi-generational': 'multi-generational',
  'multigenerational': 'multi-generational',
  'multi generational': 'multi-generational',
  'vacation homes': 'vacation-homes',
  'vacation-homes': 'vacation-homes',
  'vacationhomes': 'vacation-homes',

  // Livelihood
  'food & beverage': 'food-and-beverage',
  'food and beverage': 'food-and-beverage',
  'food-and-beverage': 'food-and-beverage',
  'food-beverage': 'food-and-beverage',
  'retail & lifestyle': 'retail-and-lifestyle',
  'retail and lifestyle': 'retail-and-lifestyle',
  'retail-and-lifestyle': 'retail-and-lifestyle',
  'retail-lifestyle': 'retail-and-lifestyle',
  'workspaces': 'workspaces',
  'workspace': 'workspaces',

  // Community
  'shared spaces': 'shared-spaces',
  'shared-spaces': 'shared-spaces',
  'shared places': 'shared-places',
  'shared-places': 'shared-places',
  'sacred structures': 'sacred-structures',
  'sacred-structures': 'sacred-structures',
};

const TYPOLOGY_NAME_MAP: Record<string, string> = {
  'tiny-living': 'Tiny Living',
  'multi-generational': 'Multi-Generational',
  'vacation-homes': 'Vacation Homes',
  'food-and-beverage': 'Food & Beverage',
  'retail-and-lifestyle': 'Retail & Lifestyle',
  'workspaces': 'Workspaces',
  'shared-spaces': 'Shared Spaces',
  'shared-places': 'Shared Places',
  'sacred-structures': 'Sacred Structures',
};

export function normalizeTypologyId(typologyOrName?: string | null): string {
  if (!typologyOrName) return 'tiny-living';
  const key = typologyOrName.toLowerCase().trim();
  return TYPOLOGY_SLUG_MAP[key] || 'tiny-living';
}

export function getTypologyName(typologyIdOrName?: string | null): string {
  if (!typologyIdOrName) return 'Multi-Generational';
  const slug = normalizeTypologyId(typologyIdOrName);
  return TYPOLOGY_NAME_MAP[slug] || typologyIdOrName;
}

/**
 * Canonical Database Contract Types (foreign key values in contract_types table)
 */
const CONTRACT_TYPE_MAP: Record<string, string> = {
  'comprehensive-design': 'comprehensive-design',
  'comprehensive design': 'comprehensive-design',
  'comprehensive design services': 'comprehensive-design',
  'comprehensive-management': 'comprehensive-management',
  'comprehensive management': 'comprehensive-management',
  'comprehensive management services': 'comprehensive-management',
  'building-construction': 'building-construction',
  'building construction': 'building-construction',
  'building construction services': 'building-construction',
  'piecework-interiors': 'piecework-interiors',
  'architectural interiors & detailing': 'piecework-interiors',
  'piecework': 'piecework-interiors',
  'consultation-retainer': 'consultation-retainer',
  'consultation & retainer services': 'consultation-retainer',
  'consultation': 'consultation-retainer',
};

export function normalizeContractTypeId(contractTypeOrId?: string | null): string | null {
  if (!contractTypeOrId) return null;
  const key = contractTypeOrId.toLowerCase().trim();
  return CONTRACT_TYPE_MAP[key] || 'comprehensive-design';
}
