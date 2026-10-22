/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RoleCrudPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface AdminTypePermissions {
  people: RoleCrudPermission;
  roles: RoleCrudPermission;
  projects: RoleCrudPermission;
  content: RoleCrudPermission;
  generalInfo: RoleCrudPermission;
}

export interface RbacMatrixSettings {
  admin: AdminTypePermissions;
  editor: AdminTypePermissions;
  updatedAt?: string;
}

export const DEFAULT_RBAC_PERMISSIONS: RbacMatrixSettings = {
  admin: {
    people: { create: true, read: true, update: true, delete: false },
    roles: { create: true, read: true, update: true, delete: false },
    projects: { create: true, read: true, update: true, delete: false },
    content: { create: true, read: true, update: true, delete: false },
    generalInfo: { create: false, read: true, update: true, delete: false },
  },
  editor: {
    people: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    projects: { create: false, read: true, update: true, delete: false },
    content: { create: false, read: false, update: false, delete: false },
    generalInfo: { create: false, read: false, update: false, delete: false },
  },
};
