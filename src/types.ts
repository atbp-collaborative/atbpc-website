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
  isDraft?: boolean;
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
  iconName: 'Layers' | 'LayoutGrid' | 'Briefcase' | 'RefreshCw' | 'MapPin' | string;
  desc: string;
  image: string;
}

export interface MemberInvolvement {
  projectId: string;
  projectTitle: string;
  roleInProject: string;
  description: string;
}

export interface Track {
  id: string;
  code: string;
  name: string;
  trackType: 'professional' | 'internship' | 'apprenticeship';
  requiredHours?: number | null;
  governingBody?: string;
  description?: string;
  sortOrder?: number;
}

export interface ProjectCategoryItem {
  id: string;
  name: string;
  tagline: string;
  heroImageUrl?: string;
  sortOrder?: number;
}

export interface ProjectTypologyItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface ContractTypeItem {
  id: string;
  code: string;
  name: string;
  serviceTier: 'comprehensive' | 'piecework' | 'consultation' | 'construction';
  contractModel: string;
  description?: string;
  sortOrder?: number;
}

export type MemberCategory = 'designers' | 'managers' | 'builders';
export type RoleCategory = MemberCategory;
export type RoleTrack = 'internship' | 'professionals';

export interface Role {
  id: string;
  title: string;
  code?: string;
  category: RoleCategory;
  track: RoleTrack;
  department?: string;
  description?: string;
  isDraft?: boolean;
}

export interface MemberAffiliation {
  title: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  pseudonym?: string;
  pronouns?: string;
  titles?: string;
  role: string;
  roles?: string[];
  primaryRoleId?: string;
  trackId?: string;
  license?: string;
  professionalLicenseTitle?: string;
  licenseNumber?: string;
  image: string;
  bio: string;
  fullBio: string;
  personalEmail?: string;
  contactNumber?: string;
  portfolioUrl?: string;
  dateOfHiring?: string;
  dateOfSeparation?: string | null;
  isCurrentlyHired?: boolean;
  affiliations: MemberAffiliation[];
  categories: MemberCategory[];
  involvement: MemberInvolvement[];
  isDraft?: boolean;
  displayOrder?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'superadmin' | 'admin' | 'editor';
}

export interface StudioWriteups {
  tagline: string;
  subSlogan: string;
  philosophy: string;
  cultureStatement: string;
}

