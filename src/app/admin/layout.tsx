/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { Metadata } from 'next';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'ATBPC Admin Dashboard',
  description: 'ATBP Collaborative Admin Management System',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
