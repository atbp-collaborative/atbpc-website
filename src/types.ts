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
  image: string;
}

export interface MemberInvolvement {
  projectId: string;
  projectTitle: string;
  roleInProject: string;
  description: string;
}

export type MemberCategory = 'designers' | 'managers' | 'builders';

export interface Member {
  id: string;
  name: string;
  role: string;
  license: string;
  image: string;
  bio: string;
  fullBio: string;
  education: string[];
  categories: MemberCategory[];
  involvement: MemberInvolvement[];
}

