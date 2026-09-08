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
  location: { lat: number; lng: number; address?: string } | null;
  date?: string;
  startTime?: string;
  endTime?: string;
  projectCategory: string;
  projectTypology: string;
  projectType: string;
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
  location: null,
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
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact Number is required"),
  address: z.object({
    regionCode: z.string().min(1, "Region is required"),
    cityCode: z.string().min(1, "City is required"),
    barangayCode: z.string().min(1, "Barangay is required"),
    streetAddress: z.string().optional(),
  }),
  clientAddress: z.object({
    regionCode: z.string().min(1, "Region is required"),
    cityCode: z.string().min(1, "City is required"),
    barangayCode: z.string().optional(), // only region/city required for clientAddress variant
    streetAddress: z.string().optional(),
  }),
  meetingType: z.enum(['meet-up', 'online', '']),
  venue: z.string().optional(),
  location: z.any().optional().nullable(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  projectCategory: z.string().optional(),
  projectTypology: z.string().optional(),
  projectType: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.meetingType === '') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Meeting Type is required", path: ['meetingType'] });
  } else if (data.meetingType === 'meet-up') {
    if (!data.venue) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Venue is required for meet-up", path: ['venue'] });
    }
    if (!data.location) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Location is required for meet-up", path: ['location'] });
    }
  }
});
