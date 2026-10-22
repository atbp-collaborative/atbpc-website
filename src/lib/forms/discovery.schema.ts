import { FieldConfig, PhAddress, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields/types';
import { z } from 'zod';

export interface DiscoverySessionFormData {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: PhAddress;
  clientAddress: PhAddress;
  meetingType: 'meet-up' | 'online' | '';
  venue: string;
  location: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  projectCategory: string;
  projectTypology: string;
  projectType: string;
  calBookingId?: string;
}

export const INITIAL_DISCOVERY_DATA: DiscoverySessionFormData = {
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  address: EMPTY_PH_ADDRESS,
  clientAddress: EMPTY_PH_ADDRESS,
  meetingType: '',
  venue: '',
  location: '',
  date: '',
  startTime: '',
  endTime: '',
  projectCategory: '',
  projectTypology: '',
  projectType: '',
};

export const DISCOVERY_LEFT_FIELDS: FieldConfig[] = [
  { type: 'text', name: 'firstName', label: 'Given Name', required: true },
  { type: 'text', name: 'middleName', label: 'Middle Name' },
  { type: 'text', name: 'lastName', label: 'Last Name', required: true },
  { type: 'text', name: 'title', label: 'Title / Suffix / Prefix', placeholder: 'e.g. Mr., Ms., Dr., Jr.' },
  { type: 'tel', name: 'contactNumber', label: 'Contact No.', required: true },
  { type: 'email', name: 'email', label: 'Email Address', required: true },
];

export const discoverySchema = z.object({
  firstName: z.string().min(1, "Given Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  address: z.object({
    country: z.string().optional(),
    regionCode: z.string().optional(),
    regionName: z.string().optional(),
    provinceCode: z.string().optional(),
    provinceName: z.string().optional(),
    cityCode: z.string().optional(),
    cityName: z.string().optional(),
    barangayCode: z.string().optional(),
    barangayName: z.string().optional(),
    addressLine: z.string().optional(),
    streetAddress: z.string().optional(),
  }).passthrough().optional(),
  clientAddress: z.any().optional(),
  meetingType: z.enum(['meet-up', 'online', '']),
  venue: z.string().optional(),
  location: z.any().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  projectCategory: z.string().min(1, "Project Category is required"),
  projectTypology: z.string().min(1, "Project Typology is required"),
  projectType: z.string().min(1, "Project Type is required"),
  calBookingId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.meetingType === '') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Meeting Type is required", path: ['meetingType'] });
  } else if (data.meetingType === 'meet-up') {
    const ven = typeof data.venue === 'string' ? data.venue.trim() : '';
    const loc = typeof data.location === 'string' ? data.location.trim() : (data.location?.address || '');
    if (!ven) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Venue is required for meet-up", path: ['venue'] });
    }
    if (!loc) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Location map link is required for meet-up", path: ['location'] });
    }
  }
});

/**
 * Validation helpers for individual discovery form sections (DRY & SoC)
 */
export function isClientDetailsValid(data: DiscoverySessionFormData): boolean {
  if (!data) return false;
  const firstName = typeof data.firstName === 'string' ? data.firstName.trim() : '';
  const lastName = typeof data.lastName === 'string' ? data.lastName.trim() : '';
  const contactNumber = typeof data.contactNumber === 'string' ? data.contactNumber.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';

  if (!firstName || !lastName || !contactNumber || !email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isProjectDetailsValid(data: DiscoverySessionFormData): boolean {
  if (!data) return false;
  const cat = typeof data.projectCategory === 'string' ? data.projectCategory.trim() : '';
  const typ = typeof data.projectTypology === 'string' ? data.projectTypology.trim() : '';
  const pType = typeof data.projectType === 'string' ? data.projectType.trim() : '';
  if (!cat || !typ || !pType) return false;

  const addr = data.address;
  if (!addr) return false;
  const hasRegion = Boolean(addr.regionCode?.trim() || addr.regionName?.trim());
  const hasCity = Boolean(addr.cityCode?.trim() || addr.cityName?.trim());
  const hasBarangay = Boolean(addr.barangayCode?.trim() || addr.barangayName?.trim());
  return hasRegion && hasCity && hasBarangay;
}

export function isVenueDetailsValid(data: DiscoverySessionFormData): boolean {
  if (!data) return false;
  const ven = typeof data.venue === 'string' ? data.venue.trim() : '';
  const loc = typeof data.location === 'string' ? data.location.trim() : (typeof data.location === 'object' && data.location ? 'valid' : '');
  return Boolean(ven && loc);
}

export function isDiscoveryFormComplete(data: DiscoverySessionFormData): boolean {
  if (!data) return false;
  if (!isClientDetailsValid(data)) return false;
  if (!isProjectDetailsValid(data)) return false;
  if (!data.meetingType) return false;
  if (data.meetingType === 'meet-up' && !isVenueDetailsValid(data)) return false;
  return true;
}
