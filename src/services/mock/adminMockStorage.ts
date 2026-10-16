/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Member, Project, AdminUser, StudioWriteups } from '@/types';
import { MEMBERS_DATA } from '@/lib/dummy-data/works/members';
import { PROJECTS_DATA } from '@/lib/dummy-data/works/projects';
import { CONTACT_INFO, ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';
import { legalModalData } from '@/lib/modals/legal';
import { ModalData } from '@/lib/modals/types';

const STORAGE_KEYS = {
  MEMBERS: 'atbp_admin_members_v1',
  PROJECTS: 'atbp_admin_projects_v1',
  CONTACT: 'atbp_admin_contact_v1',
  PRIVACY: 'atbp_admin_privacy_v1',
  LEGAL: 'atbp_admin_legal_v1',
  WRITEUPS: 'atbp_admin_writeups_v1',
  AUTH: 'atbp_admin_auth_user_v1',
};

const DEFAULT_WRITEUPS: StudioWriteups = {
  tagline: 'Designing with Values. Building with Culture. Managing with Integrity.',
  subSlogan: 'A Philippine architectural and design-build practice dedicated to cultural truth, spatial poetry, and structural honesty.',
  philosophy: 'ATBP Collaborative operates under the licensed architectural practice of Architect Marchie Teodoro Borja. We champion honest construction standards, non-hidden markups, and contextual architecture suited to the Philippine climate and socio-economic landscape.',
  cultureStatement: 'From indigenous vernacular tectonics to contemporary tropical minimalism, our works celebrate local craftsmanship, passive cooling, and enduring craftsmanship.'
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
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
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
  return getStored<Project[]>(STORAGE_KEYS.PROJECTS, PROJECTS_DATA);
}

export function getProjectById(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

export function saveProject(project: Project): Project {
  const projects = getProjects();
  const existingIdx = projects.findIndex((p) => p.id === project.id);

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
// RESET TO SYSTEM DEFAULTS
// ==========================================

export function resetAdminStorageToDefaults(): void {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.CONTACT);
  localStorage.removeItem(STORAGE_KEYS.PRIVACY);
  localStorage.removeItem(STORAGE_KEYS.LEGAL);
  localStorage.removeItem(STORAGE_KEYS.WRITEUPS);
  initializeAdminStorage();
}
