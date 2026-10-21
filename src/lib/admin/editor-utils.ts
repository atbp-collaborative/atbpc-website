/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModalSection } from '@/lib/modals/types';

/**
 * Converts legacy structured sections (title, text, list) into clean HTML for the rich text editor.
 */
export function convertLegacySectionsToHtml(introText?: string, sections?: ModalSection[]): string {
  const parts: string[] = [];

  if (introText && introText.trim()) {
    parts.push(`<p>${introText.trim()}</p>`);
  }

  if (sections && sections.length > 0) {
    for (const section of sections) {
      if (section.title && section.title.trim()) {
        parts.push(`<h3>${section.title.trim()}</h3>`);
      }
      if (section.text && section.text.trim()) {
        parts.push(`<p>${section.text.trim()}</p>`);
      }
      if (section.list && section.list.length > 0) {
        const listItems = section.list
          .filter((item) => Boolean(item && item.trim()))
          .map((item) => `<li>${item.trim()}</li>`)
          .join('');
        if (listItems) {
          parts.push(`<ul>${listItems}</ul>`);
        }
      }
    }
  }

  return parts.join('\n');
}

/**
 * Converts legacy array of HTML item clauses (e.g. from CareerPrivacy or PartnerConditions) into continuous HTML.
 */
export function convertLegacyItemsToHtml(items?: string[]): string {
  if (!items || items.length === 0) return '';
  return items.filter((item) => Boolean(item && item.trim())).join('\n');
}

/**
 * Performs a deep value comparison to check if two form states differ (dirty tracking).
 */
export function isFormDirty<T>(current: T | null | undefined, initial: T | null | undefined): boolean {
  if (current === initial) return false;
  if (!current || !initial) return true;
  return JSON.stringify(current) !== JSON.stringify(initial);
}
