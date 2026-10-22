/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PROJECT_PLACEHOLDER_IMAGE = '/images/project-house-placeholder.svg';

export const MAIN_CATEGORIES = [
  'Shelter',
  'Livelihood',
  'Community',
  'Residential',
  'Commercial',
  'Institutional',
] as const;

export type MainCategory = (typeof MAIN_CATEGORIES)[number];

export const TYPOLOGY_MAP: Record<string, string[]> = {
  Shelter: ['Tiny Living', 'Multi-Generational', 'Vacation Homes'],
  Livelihood: ['Food & Beverage', 'Retail & Lifestyle', 'Workspaces'],
  Community: ['Shared Spaces', 'Shared Places', 'Sacred Structures'],
  Residential: ['Tiny Living', 'Multi-Generational', 'Vacation Homes'],
  Commercial: ['Food & Beverage', 'Retail & Lifestyle', 'Workspaces'],
  Institutional: ['Shared Spaces', 'Shared Places', 'Sacred Structures'],
};

export const ALL_TYPOLOGIES: string[] = [
  'Tiny Living',
  'Multi-Generational',
  'Vacation Homes',
  'Food & Beverage',
  'Retail & Lifestyle',
  'Workspaces',
  'Shared Spaces',
  'Shared Places',
  'Sacred Structures',
];

export function getTypologiesForCategory(category?: string): string[] {
  if (!category || category === 'all') {
    return ALL_TYPOLOGIES;
  }
  return TYPOLOGY_MAP[category] || ALL_TYPOLOGIES;
}
