/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Member,
  Project,
  AdminUser,
  StudioWriteups,
  CareerPrivacyData,
  PartnerConditionsData,
  Role,
  Track,
  ProjectCategoryItem,
  ProjectTypologyItem,
  ContractTypeItem,
  License,
  ProjectRole,
} from '@/types';
import { MEMBERS_DATA } from '@/lib/dummy-data/works/members';
import { PROJECTS_DATA } from '@/lib/dummy-data/works/projects';
import { sortProjectsCanonically } from '@/lib/projects/project-helpers';
import { INITIAL_ROLES_DATA } from '@/lib/dummy-data/roles/roles-data';
import { CONTACT_INFO, ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';
import { legalModalData } from '@/lib/modals/legal';
import { ModalData } from '@/lib/modals/types';
import { DEFAULT_STUDIO_WRITEUPS } from '@/lib/constants/studio-writeups';

const STORAGE_KEYS = {
  MEMBERS: 'atbp_admin_members_v1',
  PROJECTS: 'atbp_admin_projects_v1',
  ROLES: 'atbp_admin_roles_v1',
  TRACKS: 'atbp_admin_tracks_v1',
  CATEGORIES: 'atbp_admin_categories_v1',
  TYPOLOGIES: 'atbp_admin_typologies_v1',
  CONTRACT_TYPES: 'atbp_admin_contract_types_v1',
  LICENSES: 'atbp_admin_licenses_v1',
  PROJECT_ROLES: 'atbp_admin_project_roles_v1',
  CONTACT: 'atbp_admin_contact_v1',
  PRIVACY: 'atbp_admin_privacy_v1',
  CAREER_PRIVACY: 'atbp_admin_career_privacy_v1',
  PARTNER_CONDITIONS: 'atbp_admin_partner_conditions_v1',
  LEGAL: 'atbp_admin_legal_v1',
  WRITEUPS: 'atbp_admin_writeups_v1',
  AUTH: 'atbp_admin_auth_user_v1',
};

const DEFAULT_WRITEUPS: StudioWriteups = DEFAULT_STUDIO_WRITEUPS;

export const DEFAULT_CAREER_PRIVACY: CareerPrivacyData = {
  title: 'Privacy Statement',
  subtitle: 'ATBP Collaborative • Data Privacy',
  badge: 'Republic Act No. 10173',
  items: [
    '<p>ATBP Collaborative is committed to safeguarding the privacy and personal credentials of all applicants in accordance with <a href="https://www.officialgazette.gov.ph/2012/08/15/republic-act-no-10173/" target="_blank" rel="noopener noreferrer" class="underline hover:text-space-sparkle transition-colors">Republic Act No. 10173</a> (Data Privacy Act of 2012).</p>',
    '<p>Any personal identifiers, contact numbers, links, video intros, or portfolio materials provided through this application portal are collected strictly for talent recruitment, portfolio evaluation, and potential employment assessment.</p>',
    '<p>Your information will remain strictly confidential within our practice management and will never be disclosed to third parties without your explicit consent.</p>',
  ],
  closeLabel: 'Understood',
};

export const DEFAULT_PARTNER_CONDITIONS: PartnerConditionsData = {
  builder: {
    title: 'General Conditions for Builder Partnership',
    subtitle: 'ATBP Collaborative • Builder Accreditation',
    badge: 'PCAB & Integrity Standards',
    items: [
      '<p>1. <strong>Licensing & Integrity:</strong> Partner builders must hold valid PCAB licenses and tax registrations (BIR / SEC / DTI) matching their declared scope of work and construction category.</p>',
      '<p>2. <strong>Workmanship Standards:</strong> All construction methods, site safety protocols, and material assemblies must adhere strictly to ATBP Collaborative architectural blueprints and specifications.</p>',
      '<p>3. <strong>Contractual Transparency:</strong> Sample contracts and project execution methodologies are verified for cost-transparency, delay penalties, and warranty guarantees.</p>',
    ],
  },
  consultant: {
    title: 'General Conditions for Consultant Partnership',
    subtitle: 'ATBP Collaborative • Consultant Accreditation',
    badge: 'PRC / PTR Professional Standards',
    items: [
      '<p>1. <strong>Professional Licensing:</strong> Partner consultants and specialist firms must hold active PRC/PTR professional licenses or accredited corporate engineering practice permits.</p>',
      '<p>2. <strong>Design Integrity & Calculation Standards:</strong> All technical calculations, BIM models, and structural/MEPFS drawings must align with national codes and studio specifications.</p>',
      '<p>3. <strong>Confidentiality & Peer Review:</strong> Information disclosed through this portal is safeguarded for studio project matching, fee estimations, and inter-practice collaboration.</p>',
    ],
  },
  supplier: {
    title: 'General Conditions for Product Qualification',
    subtitle: 'ATBP Collaborative • Supplier Accreditation',
    badge: 'Material Quality Verification',
    items: [
      '<p>1. <strong>Quality Verification:</strong> All submitted material specifications, MSDS documents, and physical catalogs are pre-screened according to strict structural, aesthetic, and environmental sustainability standards prior to studio specification.</p>',
      '<p>2. <strong>Warranty & Lead Times:</strong> Suppliers must provide verified lead times and manufacturer warranty coverage for custom millwork, finishes, and specialized hardware.</p>',
      '<p>3. <strong>Data Confidentiality:</strong> Product documentation provided through this portal will be archived exclusively for internal procurement, mock-up schedules, and client bill-of-quantity estimations.</p>',
    ],
  },
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getStored<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err: any) {
    if (err?.name === 'QuotaExceededError' || err?.code === 22 || err?.number === -2147024882) {
      console.warn(`[adminMockStorage] LocalStorage quota reached for key "${key}". Cleaning up stale cache.`);
      try {
        localStorage.removeItem(key);
      } catch {}
    } else {
      console.warn(`[adminMockStorage] Warning writing ${key} to localStorage:`, err?.message || err);
    }
  }
}

/**
 * Ensures initial mock data exists in localStorage
 */
export function initializeAdminStorage(): void {
  if (!isClient()) return;

  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    // Seed initial members with isDraft: false (except mark one as draft for demonstration)
    const seededMembers = MEMBERS_DATA.map((m, idx) => ({
      ...m,
      isDraft: idx === MEMBERS_DATA.length - 1, // last one as draft demo
    }));
    setStored(STORAGE_KEYS.MEMBERS, seededMembers);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    // Seed initial projects with isDraft: false (except mark one as draft for demonstration)
    const seededProjects = PROJECTS_DATA.map((p, idx) => ({
      ...p,
      isDraft: idx === PROJECTS_DATA.length - 1,
    }));
    setStored(STORAGE_KEYS.PROJECTS, seededProjects);
  }

  if (!localStorage.getItem(STORAGE_KEYS.ROLES)) {
    setStored(STORAGE_KEYS.ROLES, INITIAL_ROLES_DATA);
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONTACT)) {
    setStored(STORAGE_KEYS.CONTACT, CONTACT_INFO);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRIVACY)) {
    setStored(STORAGE_KEYS.PRIVACY, privacyPolicyModalData.contents);
  }

  if (!localStorage.getItem(STORAGE_KEYS.LEGAL)) {
    setStored(STORAGE_KEYS.LEGAL, legalModalData.contents);
  }

  if (!localStorage.getItem(STORAGE_KEYS.WRITEUPS)) {
    setStored(STORAGE_KEYS.WRITEUPS, DEFAULT_WRITEUPS);
  }
}

// ==========================================
// MEMBERS (PEOPLE) CRUD
// ==========================================

export function getMembers(): Member[] {
  initializeAdminStorage();
  return getStored<Member[]>(STORAGE_KEYS.MEMBERS, MEMBERS_DATA);
}

export function getMemberById(id: string): Member | undefined {
  const members = getMembers();
  return members.find((m) => m.id === id);
}

export function saveMember(member: Member): Member {
  const members = getMembers();
  const existingIdx = members.findIndex((m) => m.id === member.id);

  let updatedMembers: Member[];
  if (existingIdx >= 0) {
    updatedMembers = [...members];
    updatedMembers[existingIdx] = member;
  } else {
    updatedMembers = [member, ...members];
  }

  setStored(STORAGE_KEYS.MEMBERS, updatedMembers);

  // Sync project titles in member involvements
  syncInvolvementsWithProjects(member);

  return member;
}

export function deleteMember(id: string): void {
  const members = getMembers();
  const updated = members.filter((m) => m.id !== id);
  setStored(STORAGE_KEYS.MEMBERS, updated);
}

export function toggleMemberDraft(id: string): Member | undefined {
  const members = getMembers();
  const target = members.find((m) => m.id === id);
  if (!target) return undefined;

  target.isDraft = !target.isDraft;
  setStored(STORAGE_KEYS.MEMBERS, members);
  return target;
}

// ==========================================
// PROJECTS CRUD
// ==========================================

export function getProjects(): Project[] {
  initializeAdminStorage();
  return sortProjectsCanonically(getStored<Project[]>(STORAGE_KEYS.PROJECTS, PROJECTS_DATA));
}

export function getProjectById(identifier: string): Project | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === identifier || (p.slug && p.slug === identifier));
}

export function saveProject(project: Project): Project {
  const projects = getProjects();
  const existingIdx = projects.findIndex(
    (p) => p.id === project.id || (Boolean(p.slug && project.slug) && p.slug === project.slug)
  );

  let updatedProjects: Project[];
  if (existingIdx >= 0) {
    updatedProjects = [...projects];
    updatedProjects[existingIdx] = project;
  } else {
    updatedProjects = [project, ...projects];
  }

  setStored(STORAGE_KEYS.PROJECTS, updatedProjects);

  // Sync project title changes back into any members who reference this project
  const members = getMembers();
  let membersChanged = false;
  const updatedMembers = members.map((m) => {
    let memberChanged = false;
    const newInvolvements = (m.involvement || []).map((inv) => {
      if (inv.projectId === project.id && inv.projectTitle !== project.title) {
        memberChanged = true;
        return { ...inv, projectTitle: project.title };
      }
      return inv;
    });

    if (memberChanged) {
      membersChanged = true;
      return { ...m, involvement: newInvolvements };
    }
    return m;
  });

  if (membersChanged) {
    setStored(STORAGE_KEYS.MEMBERS, updatedMembers);
  }

  return project;
}


export function reorderProjects(items: { id: string; sortOrder: number }[]): Project[] {
  const projects = getProjects();
  const orderMap = new Map(items.map((i) => [i.id, i.sortOrder]));
  const updated = projects.map((p) => {
    const nextOrder = orderMap.get(p.id);
    return nextOrder !== undefined ? { ...p, sortOrder: nextOrder } : p;
  });
  const sorted = sortProjectsCanonically(updated);
  setStored(STORAGE_KEYS.PROJECTS, sorted);
  return sorted;
}

export function deleteProject(id: string): void {
  const projects = getProjects();
  const updated = projects.filter((p) => p.id !== id);
  setStored(STORAGE_KEYS.PROJECTS, updated);

  // Remove this project from any member involvements
  const members = getMembers();
  const updatedMembers = members.map((m) => ({
    ...m,
    involvement: (m.involvement || []).filter((inv) => inv.projectId !== id),
  }));
  setStored(STORAGE_KEYS.MEMBERS, updatedMembers);
}

export function toggleProjectDraft(id: string): Project | undefined {
  const projects = getProjects();
  const target = projects.find((p) => p.id === id);
  if (!target) return undefined;

  target.isDraft = !target.isDraft;
  setStored(STORAGE_KEYS.PROJECTS, projects);
  return target;
}

// ==========================================
// BI-DIRECTIONAL PROJECT-MEMBER ASSOCIATION
// ==========================================

export interface ProjectTeamMemberEntry {
  memberId: string;
  memberName: string;
  memberRole: string;
  memberImage: string;
  roleInProject: string;
  description: string;
}

/**
 * Returns all members who are associated with a given project
 */
export function getTeamMembersForProject(projectId: string): ProjectTeamMemberEntry[] {
  const members = getMembers();
  const team: ProjectTeamMemberEntry[] = [];

  for (const m of members) {
    const inv = (m.involvement || []).find((i) => i.projectId === projectId);
    if (inv) {
      team.push({
        memberId: m.id,
        memberName: m.name,
        memberRole: m.role,
        memberImage: m.image,
        roleInProject: inv.roleInProject,
        description: inv.description,
      });
    }
  }

  return team;
}

/**
 * Directly associates a member to a project with a role & description.
 * Updates the member's involvement array and persists it.
 */
export function associateMemberToProject(
  memberId: string,
  projectId: string,
  roleInProject: string,
  description: string = ''
): void {
  const members = getMembers();
  const projects = getProjects();
  const member = members.find((m) => m.id === memberId);
  const project = projects.find((p) => p.id === projectId);

  if (!member || !project) return;

  const currentInvolvements = member.involvement || [];
  const existingIdx = currentInvolvements.findIndex((inv) => inv.projectId === projectId);

  const newEntry = {
    projectId: project.id,
    projectTitle: project.title,
    roleInProject: roleInProject.trim() || 'Contributor',
    description: description.trim(),
  };

  if (existingIdx >= 0) {
    currentInvolvements[existingIdx] = newEntry;
  } else {
    currentInvolvements.push(newEntry);
  }

  member.involvement = currentInvolvements;
  setStored(STORAGE_KEYS.MEMBERS, members);
}

/**
 * Disassociates a member from a project.
 */
export function disassociateMemberFromProject(memberId: string, projectId: string): void {
  const members = getMembers();
  const member = members.find((m) => m.id === memberId);
  if (!member) return;

  member.involvement = (member.involvement || []).filter((inv) => inv.projectId !== projectId);
  setStored(STORAGE_KEYS.MEMBERS, members);
}

/**
 * Syncs projectTitle in a member's involvement entries with current project titles
 */
function syncInvolvementsWithProjects(member: Member): void {
  const projects = getProjects();
  let changed = false;

  const updatedInvolvements = (member.involvement || []).map((inv) => {
    const proj = projects.find((p) => p.id === inv.projectId);
    if (proj && proj.title !== inv.projectTitle) {
      changed = true;
      return { ...inv, projectTitle: proj.title };
    }
    return inv;
  });

  if (changed) {
    member.involvement = updatedInvolvements;
    const members = getMembers().map((m) => (m.id === member.id ? member : m));
    setStored(STORAGE_KEYS.MEMBERS, members);
  }
}

// ==========================================
// GENERAL INFO CRUD (Contact, Privacy, Legal, Writeups)
// ==========================================

export function getContactInfo(): ContactInfo {
  initializeAdminStorage();
  return getStored<ContactInfo>(STORAGE_KEYS.CONTACT, CONTACT_INFO);
}

export function saveContactInfo(data: ContactInfo): ContactInfo {
  setStored(STORAGE_KEYS.CONTACT, data);
  return data;
}

export function getPrivacyPolicy(): ModalData {
  initializeAdminStorage();
  return getStored<ModalData>(STORAGE_KEYS.PRIVACY, privacyPolicyModalData.contents);
}

export function savePrivacyPolicy(data: ModalData): ModalData {
  setStored(STORAGE_KEYS.PRIVACY, data);
  return data;
}

export function getCareerPrivacy(): CareerPrivacyData {
  initializeAdminStorage();
  return getStored<CareerPrivacyData>(STORAGE_KEYS.CAREER_PRIVACY, DEFAULT_CAREER_PRIVACY);
}

export function saveCareerPrivacy(data: CareerPrivacyData): CareerPrivacyData {
  setStored(STORAGE_KEYS.CAREER_PRIVACY, data);
  return data;
}

export function getPartnerConditions(): PartnerConditionsData {
  initializeAdminStorage();
  return getStored<PartnerConditionsData>(STORAGE_KEYS.PARTNER_CONDITIONS, DEFAULT_PARTNER_CONDITIONS);
}

export function savePartnerConditions(data: PartnerConditionsData): PartnerConditionsData {
  setStored(STORAGE_KEYS.PARTNER_CONDITIONS, data);
  return data;
}

export function getLegalNotices(): ModalData {
  initializeAdminStorage();
  return getStored<ModalData>(STORAGE_KEYS.LEGAL, legalModalData.contents);
}

export function saveLegalNotices(data: ModalData): ModalData {
  setStored(STORAGE_KEYS.LEGAL, data);
  return data;
}

export function getStudioWriteups(): StudioWriteups {
  initializeAdminStorage();
  return getStored<StudioWriteups>(STORAGE_KEYS.WRITEUPS, DEFAULT_WRITEUPS);
}

export function saveStudioWriteups(data: StudioWriteups): StudioWriteups {
  setStored(STORAGE_KEYS.WRITEUPS, data);
  return data;
}

// ==========================================
// AUTHENTICATION SIMULATION
// ==========================================

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1',
  email: 'admin@atbpcollaborative.com',
  name: 'Marchie Borja',
  role: 'superadmin',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
};

export function getAdminSession(): AdminUser | null {
  if (!isClient()) return DEFAULT_ADMIN;
  return getStored<AdminUser | null>(STORAGE_KEYS.AUTH, DEFAULT_ADMIN);
}

export function setAdminSession(user: AdminUser | null): void {
  setStored(STORAGE_KEYS.AUTH, user);
}

export function clearAdminSession(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

// ==========================================
// ROLES CRUD & ASSIGNMENTS
// ==========================================

export function getRoles(): Role[] {
  initializeAdminStorage();
  return getStored<Role[]>(STORAGE_KEYS.ROLES, INITIAL_ROLES_DATA);
}

export function getRoleById(id: string): Role | undefined {
  const roles = getRoles();
  return roles.find((r) => r.id === id);
}

export function saveRole(role: Role): Role {
  const roles = getRoles();
  const existingIdx = roles.findIndex((r) => r.id === role.id);
  let updatedRoles: Role[];

  if (existingIdx >= 0) {
    updatedRoles = [...roles];
    updatedRoles[existingIdx] = role;
  } else {
    updatedRoles = [role, ...roles];
  }

  setStored(STORAGE_KEYS.ROLES, updatedRoles);
  return role;
}

export function deleteRole(id: string): void {
  const roles = getRoles();
  const updatedRoles = roles.filter((r) => r.id !== id);
  setStored(STORAGE_KEYS.ROLES, updatedRoles);

  // Also remove from any member currently assigned to this role
  const members = getMembers();
  let modified = false;
  const updatedMembers = members.map((m) => {
    if (m.roles && m.roles.includes(id)) {
      modified = true;
      return {
        ...m,
        roles: m.roles.filter((rId) => rId !== id),
      };
    }
    return m;
  });

  if (modified) {
    setStored(STORAGE_KEYS.MEMBERS, updatedMembers);
  }
}

export function toggleRoleDraft(id: string): Role | null {
  const roles = getRoles();
  const target = roles.find((r) => r.id === id);
  if (!target) return null;

  target.isDraft = !target.isDraft;
  saveRole(target);
  return target;
}

export function assignRoleToMember(memberId: string, roleId: string): void {
  const members = getMembers();
  const member = members.find((m) => m.id === memberId);
  if (!member) return;

  const currentRoles = member.roles || [];
  if (!currentRoles.includes(roleId)) {
    member.roles = [...currentRoles, roleId];
    saveMember(member);
  }
}

export function unassignRoleFromMember(memberId: string, roleId: string): void {
  const members = getMembers();
  const member = members.find((m) => m.id === memberId);
  if (!member || !member.roles) return;

  member.roles = member.roles.filter((r) => r !== roleId);
  saveMember(member);
}

export function setMemberRoles(memberId: string, roleIds: string[]): void {
  const members = getMembers();
  const member = members.find((m) => m.id === memberId);
  if (!member) return;

  member.roles = roleIds;
  saveMember(member);
}

// ==========================================
// TRACKS, CATEGORIES, TYPOLOGIES, CONTRACT TYPES
// ==========================================

export const INITIAL_TRACKS_DATA: Track[] = [
  {
    id: 'PROF',
    code: 'PROF',
    name: 'Professional Practice',
    trackType: 'professional',
    requiredHours: null,
    governingBody: 'PRC / BOA / Internal',
    description: 'Full-time licensed and experienced studio professionals directing design, engineering, and construction.',
    sortOrder: 10,
  },
  {
    id: 'INTERN_CHED_240',
    code: 'INT-CHED',
    name: 'Curriculum-based Architecture Intern',
    trackType: 'internship',
    requiredHours: 240,
    governingBody: 'CHED CMO No. 104, Series of 2017',
    description: 'Academic internship for undergraduate architecture students completing curriculum requirements.',
    sortOrder: 20,
  },
  {
    id: 'INTERN_VOC',
    code: 'INT-VOC',
    name: 'Vocational Technical Intern',
    trackType: 'internship',
    requiredHours: 300,
    governingBody: 'TESDA',
    description: 'Vocational technical hands-on internship for National Certificate (NC) holders.',
    sortOrder: 30,
  },
  {
    id: 'APPRENTICE_ALE_3840',
    code: 'APP-ALE',
    name: 'Diversified Architectural Experience (ALE)',
    trackType: 'apprenticeship',
    requiredHours: 3840,
    governingBody: 'PRC-BOA',
    description: 'PRC-mandated 3,840 logbook hours under registered and licensed architects qualifying for the ALE.',
    sortOrder: 40,
  },
];

export const INITIAL_PROJECT_CATEGORIES: ProjectCategoryItem[] = [
  {
    id: 'Shelter',
    name: 'Shelter',
    tagline: 'for the way you live',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/categories/shelter.jpg',
    sortOrder: 1,
  },
  {
    id: 'Livelihood',
    name: 'Livelihood',
    tagline: 'where passion takes form',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/categories/livelihood.jpg',
    sortOrder: 2,
  },
  {
    id: 'Community',
    name: 'Community',
    tagline: 'spaces that connect us',
    heroImageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/categories/community.jpg',
    sortOrder: 3,
  },
];

export const INITIAL_PROJECT_TYPOLOGIES: ProjectTypologyItem[] = [
  { id: 'tiny-living', categoryId: 'Shelter', name: 'Tiny Living', description: 'Compact, high-efficiency micro-dwellings and optimized tropical living spaces.', sortOrder: 10 },
  { id: 'multi-generational', categoryId: 'Shelter', name: 'Multi-Generational', description: 'Cohesive, flexible residential compounds accommodating multi-tier family living.', sortOrder: 20 },
  { id: 'vacation-homes', categoryId: 'Shelter', name: 'Vacation Homes', description: 'Tranquil retreat residences and tropical lifestyle estates focused on nature immersion.', sortOrder: 30 },
  { id: 'food-and-beverage', categoryId: 'Livelihood', name: 'Food & Beverage', description: 'Specialty cafes, restaurants, and experiential culinary retail environments.', sortOrder: 40 },
  { id: 'retail-and-lifestyle', categoryId: 'Livelihood', name: 'Retail & Lifestyle', description: 'Bespoke brand boutiques, concept stores, and commercial lifestyle spaces.', sortOrder: 50 },
  { id: 'workspaces', categoryId: 'Livelihood', name: 'Workspaces', description: 'Collaborative corporate offices, agile production studios, and tech headquarters.', sortOrder: 60 },
  { id: 'shared-spaces', categoryId: 'Community', name: 'Shared Spaces', description: 'Civic hubs, communal pavilions, and neighborhood activity center architecture.', sortOrder: 70 },
  { id: 'shared-places', categoryId: 'Community', name: 'Shared Places', description: 'Urban parks, multi-use public grounds, and pedestrian gathering places.', sortOrder: 80 },
  { id: 'sacred-structures', categoryId: 'Community', name: 'Sacred Structures', description: 'Chapels, contemplative sanctuaries, and heritage spiritual assemblies.', sortOrder: 90 },
];

export const INITIAL_CONTRACT_TYPES: ContractTypeItem[] = [
  { id: 'comprehensive-design', code: 'SCOPE-COMP-DESIGN', name: 'Comprehensive Design Services', serviceTier: 'comprehensive', contractModel: 'Design-Build (Turnkey)', description: 'End-to-end design covering architectural, structural, MEPFS, and statutory permits.', sortOrder: 10 },
  { id: 'comprehensive-management', code: 'SCOPE-COMP-MGMT', name: 'Comprehensive Management Services', serviceTier: 'comprehensive', contractModel: 'Construction Management', description: 'Critical path oversight, procurement direction, and subcontractor supervision.', sortOrder: 20 },
  { id: 'building-construction', code: 'SCOPE-BUILD-CONST', name: 'Building Construction Services', serviceTier: 'construction', contractModel: 'Turnkey Construction', description: 'Ground-up general contracting, civil works, and turn-key structural execution.', sortOrder: 30 },
  { id: 'piecework-interiors', code: 'SCOPE-PIECE-INT', name: 'Architectural Interiors & Detailing', serviceTier: 'piecework', contractModel: 'Unit-Rate Deliverables', description: 'Bespoke interior fit-out, joinery detailing, and material finish schedules.', sortOrder: 40 },
  { id: 'consultation-retainer', code: 'SCOPE-CONSULT-RETAIN', name: 'Consultation & Retainer Services', serviceTier: 'consultation', contractModel: 'Strategic Advisory Retainer', description: 'Ongoing architectural consulting, portfolio feasibility, and client-rep audits.', sortOrder: 50 },
];

export const INITIAL_LICENSES_DATA: License[] = [
  { id: 'lic-arch', title: 'Architect', abbreviation: 'RLA', sortOrder: 10, isActive: true },
  { id: 'lic-int-des', title: 'Interior Designer', abbreviation: 'IDr', sortOrder: 20, isActive: true },
  { id: 'lic-master-plumb', title: 'Master Plumber', abbreviation: 'RMP', sortOrder: 30, isActive: true },
  { id: 'lic-master-elec', title: 'Master Electrician', abbreviation: 'RME', sortOrder: 40, isActive: true },
  { id: 'lic-cpa', title: 'Accountant', abbreviation: 'CPA', sortOrder: 50, isActive: true },
  { id: 'lic-civil-eng', title: 'Civil Engineer', abbreviation: 'CE', sortOrder: 60, isActive: true },
  { id: 'lic-struct-eng', title: 'Structural Engineer', abbreviation: 'SE', sortOrder: 70, isActive: true },
  { id: 'lic-sanitary-eng', title: 'Sanitary Engineer', abbreviation: 'SanE', sortOrder: 80, isActive: true },
  { id: 'lic-reg-elec-eng', title: 'Registered Electrical Engineer', abbreviation: 'REE', sortOrder: 90, isActive: true },
  { id: 'lic-prof-elec-eng', title: 'Professional Electrical Engineer', abbreviation: 'PEE', sortOrder: 100, isActive: true },
  { id: 'lic-mech-eng', title: 'Mechanical Engineer', abbreviation: 'ME', sortOrder: 110, isActive: true },
];

export const INITIAL_PROJECT_ROLES_DATA: ProjectRole[] = [
  { id: 'proj-role-arch-design', code: 'PR-ARCH', name: 'Architectural Design', description: 'Spatial programming, schematic concepts, exterior massing, and construction drawings.', isActive: true },
  { id: 'proj-role-cost-est', code: 'PR-COST', name: 'Cost Estimates', description: 'Bill of quantities, cost feasibility, material takeoffs, and procurement budget control.', isActive: true },
  { id: 'proj-role-elec-sys', code: 'PR-ELEC', name: 'Electrical Systems', description: 'Power distribution, lighting fixture layout, auxiliary communication, and solar load calculations.', isActive: true },
  { id: 'proj-role-plumb-sys', code: 'PR-PLUMB', name: 'Plumbing Systems', description: 'Sanitary piping, domestic potable water supply, rainwater catchment, and drainage routing.', isActive: true },
  { id: 'proj-role-bim-lead', code: 'PR-BIM', name: 'BIM Lead', description: 'Building information modeling coordination, 3D clash detection, and parametric Revit/IFC execution.', isActive: true },
  { id: 'proj-role-arch-rend', code: 'PR-REND', name: 'Architectural Renderer', description: 'Photorealistic visual simulation, lighting ambiance studies, material texture mapping, and animations.', isActive: true },
];

export function getTracks(): Track[] {
  initializeAdminStorage();
  return getStored<Track[]>(STORAGE_KEYS.TRACKS, INITIAL_TRACKS_DATA);
}

export function getLicenses(): License[] {
  initializeAdminStorage();
  return getStored<License[]>(STORAGE_KEYS.LICENSES, INITIAL_LICENSES_DATA);
}

export function getProjectRoles(): ProjectRole[] {
  initializeAdminStorage();
  return getStored<ProjectRole[]>(STORAGE_KEYS.PROJECT_ROLES, INITIAL_PROJECT_ROLES_DATA);
}

export function saveProjectRole(projectRole: ProjectRole): ProjectRole {
  const list = getProjectRoles();
  const idx = list.findIndex((r) => r.id === projectRole.id);

  let updated: ProjectRole[];
  if (idx >= 0) {
    updated = [...list];
    updated[idx] = projectRole;
  } else {
    updated = [...list, projectRole];
  }

  setStored(STORAGE_KEYS.PROJECT_ROLES, updated);
  return projectRole;
}

export function deleteProjectRole(id: string): void {
  const list = getProjectRoles();
  const updated = list.filter((r) => r.id !== id);
  setStored(STORAGE_KEYS.PROJECT_ROLES, updated);
}

export function getProjectCategories(): ProjectCategoryItem[] {
  initializeAdminStorage();
  return getStored<ProjectCategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_PROJECT_CATEGORIES);
}

export function getProjectTypologies(): ProjectTypologyItem[] {
  initializeAdminStorage();
  return getStored<ProjectTypologyItem[]>(STORAGE_KEYS.TYPOLOGIES, INITIAL_PROJECT_TYPOLOGIES);
}

export function getContractTypes(): ContractTypeItem[] {
  initializeAdminStorage();
  return getStored<ContractTypeItem[]>(STORAGE_KEYS.CONTRACT_TYPES, INITIAL_CONTRACT_TYPES);
}

// ==========================================
// RESET TO SYSTEM DEFAULTS
// ==========================================

export function resetAdminStorageToDefaults(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.ROLES);
  localStorage.removeItem(STORAGE_KEYS.TRACKS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.TYPOLOGIES);
  localStorage.removeItem(STORAGE_KEYS.CONTRACT_TYPES);
  localStorage.removeItem(STORAGE_KEYS.CONTACT);
  localStorage.removeItem(STORAGE_KEYS.PRIVACY);
  localStorage.removeItem(STORAGE_KEYS.CAREER_PRIVACY);
  localStorage.removeItem(STORAGE_KEYS.PARTNER_CONDITIONS);
  localStorage.removeItem(STORAGE_KEYS.LEGAL);
  localStorage.removeItem(STORAGE_KEYS.WRITEUPS);
  initializeAdminStorage();
}

