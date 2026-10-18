/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectMediaItem {
  id?: string;
  mediaUrl: string;
  caption?: string;
  isCover?: boolean;
  sortOrder?: number;
}

export interface Project {
  id: string;
  projectCode?: string; // YYNN format, e.g. 2601
  title: string;
  category: string;
  categoryId?: string;
  typologyId?: string;
  contractTypeId?: string;
  floorAreaSqm?: number;
  mainCategory?: 'Shelter' | 'Livelihood' | 'Community' | 'Residential' | 'Commercial' | 'Institutional' | string;
  subcategory?: string;
  location: string;
  year: string;
  clientType: 'Mid-Income' | 'Mid-High-Income' | 'High-Income';
  description: string;
  fullWriteup: string;
  images: string[];
  media?: ProjectMediaItem[];
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
  trackId?: string;
  department?: string;
  description?: string;
  isActive?: boolean;
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
  middleName?: string | null;
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

export interface SitePage {
  id: string;
  title: string;
  subtitle: string;
  heroImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isDraft: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavigationCardItem {
  id: string;
  hubId: string;
  cardKey: string;
  title: string;
  tagline: string;
  subtext: string;
  tags: string[];
  imageUrl: string;
  targetHref: string;
  sortOrder: number;
  isDraft: boolean;
}

export interface ServicePillar {
  title: string;
  desc: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  sectionTag: string;
  tagline: string;
  description: string;
  extraDescription?: string | null;
  imageUrl?: string | null;
  subtext: string;
  pillars: ServicePillar[];
  contentColumns: unknown[];
  sortOrder: number;
  isDraft: boolean;
}

export interface ProcessPhilosophy {
  id: string;
  title: string;
  sectionTag: string;
  tagline: string;
  description: string;
  extraDescription?: string | null;
  imageUrl?: string | null;
  subtext: string;
  pillars: ServicePillar[];
  sortOrder: number;
  isDraft: boolean;
}

export interface StageGroup {
  id: string;
  processPageId: string;
  name: string;
  colSpan: number;
  sortOrder: number;
  isDraft: boolean;
  stages?: ProcessStageItem[];
}

export interface ProcessStageItem {
  id: string;
  processPageId: string;
  stageGroupId?: string | null;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  duration: string;
  sortOrder: number;
  isDraft: boolean;
}

export interface HomeSlideItem {
  id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
  isDraft: boolean;
}

export interface HomepageSlogans {
  slogans: string[];
  heroSubtext: string[];
}


