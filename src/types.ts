/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  mainCategory?: 'Shelter' | 'Livelihood' | 'Community' | 'Residential' | 'Commercial' | 'Institutional' | string;
  subcategory?: string;
  location: string;
  year: string;
  clientType: 'Mid-Income' | 'Mid-High-Income' | 'High-Income';
  description: string;
  fullWriteup: string;
  images: string[];
  video?: string;
  status: 'completed' | 'ongoing' | 'schematics';
  specs: {
    area?: string;
    scope: string;
    duration: string;
    materials?: string[];
  };
}

export interface SurveyResponse {
  name: string;
  email: string;
  phone: string;
  viber?: string;
  projectType: string;
  incomeCategory: string;
  budgetRange: string;
  scopeNeeded: string[];
  timeline: string;
  additionalDetails?: string;
}

export interface Service {
  title: string;
  iconName: 'Layers' | 'LayoutGrid' | 'Briefcase' | 'RefreshCw';
  desc: string;
}

