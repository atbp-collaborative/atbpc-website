import { FieldConfig, PhAddress, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields/types';
import { z } from 'zod';

export type PartnerFormVariant = 'supplier' | 'builder' | 'consultant';

export const PRONOUN_OPTIONS = ['He/Him', 'She/Her', 'They/Them', 'Prefer not to say'];

export interface PartnerFormFieldSet {
  leftColumnTop: FieldConfig[];
  leftColumnBottomGrid?: FieldConfig[]; // 2 cols for supplier, 3 cols for others
  rightColumnRowsTop: FieldConfig[][];
  rightColumnRowsMiddle?: FieldConfig[][];
  rightColumnRowsBottom?: FieldConfig[][];
}

const COMMON_RIGHT_TOP_ROWS: FieldConfig[][] = [
  [
    { type: 'text', name: 'firstName', label: 'First Name', badge: '!', wrapperClassName: 'sm:col-span-2' },
    { type: 'text', name: 'pseudonym', label: 'Pseudonym', badge: '!', wrapperClassName: 'sm:col-span-2' },
  ],
  [
    { type: 'text', name: 'middleName', label: 'Middle Name', note: "(Mother's Maiden Last Name)", wrapperClassName: 'sm:col-span-2' },
    { type: 'text', name: 'lastName', label: 'Last Name', badge: '!', wrapperClassName: 'sm:col-span-2' },
  ],
  [
    {
      type: 'select',
      name: 'pronoun',
      label: 'Pronoun',
      badge: '!',
      placeholder: '[ Select Pronouns ]',
      options: PRONOUN_OPTIONS,
      wrapperClassName: 'sm:col-span-2',
    },
    {
      type: 'select',
      name: 'titles',
      label: 'Titles',
      placeholder: '[ Select Title ]',
      options: ['Arch.', 'Engr.', 'IDr.', 'Atty.', 'Dr.'],
      wrapperClassName: 'sm:col-span-2',
    },
  ],
];

const COMMON_RIGHT_BOTTOM_ROWS: FieldConfig[][] = [
  [
    { type: 'text', name: 'facebook', label: 'Facebook', placeholder: 'Paste URL / Link / Handle', wrapperClassName: 'sm:col-span-1' },
    { type: 'text', name: 'instagram', label: 'Instagram', placeholder: 'Paste URL / Link / Handle', wrapperClassName: 'sm:col-span-1' },
  ],
];

export interface PartnerFormOptions {
  categories?: string[];
  specialties?: string[];
}

export const getPartnerFormFields = (
  variant: PartnerFormVariant,
  options: PartnerFormOptions = {}
): PartnerFormFieldSet => {
  const leftColumnTop: FieldConfig[] = [
    { type: 'text', name: 'companyName', label: 'Company Name / Registered Name', badge: '!' },
  ];

  if (variant === 'supplier') {
    if (options.categories) {
      leftColumnTop.push({
        type: 'select',
        name: 'category',
        label: 'Product Category',
        badge: '!',
        placeholder: '[ Select Product Category ]',
        options: options.categories,
      });
    }

    leftColumnTop.push({
      type: 'textarea',
      name: 'message',
      label: 'Message of Intent',
      badge: '!',
      placeholder: 'Please limit your message to a 200-word count. Be brief about your intent (kindly make the composition friendly but professional)',
      grow: true,
    });

    return {
      leftColumnTop,
      rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS,
    };
  }

  // builder or consultant
  if (options.specialties) {
    leftColumnTop.push({
      type: 'select',
      name: 'specialty',
      label: 'Specialty',
      badge: '!',
      placeholder: '[ Select Specialty ]',
      options: options.specialties,
      // @ts-ignore
      dense: true,
    });
  }

  leftColumnTop.push({
    type: 'textarea',
    name: 'message',
    label: 'Message of Intent',
    badge: '!',
    placeholder: 'Please limit your message to a 200-word count. Be brief about your intent (kindly make the composition friendly but professional)',
    grow: true,
  });

  return {
    leftColumnTop,
    rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS,
  };
};

export interface PartnerAddress extends PhAddress {
  type: string; // 'Office' | 'Warehouse' | 'Facility'
  landline: string;
  mapLink: string;
}

export interface PartnerContact {
  number: string;
  description: string;
}

export interface PartnerEmail {
  email: string;
  description: string; // 'Primary' | 'Personal' | 'Operations' etc
}

export const PARTNER_FORM_INITIAL_DATA = {
  companyName: '',
  category: '',
  message: '',
  specialty: '',
  licenseLink: '',
  firstName: '',
  pseudonym: '',
  middleName: '',
  lastName: '',
  pronoun: '',
  titles: '',
  addresses: [{ ...EMPTY_PH_ADDRESS, type: '', landline: '', mapLink: '' }] as PartnerAddress[],
  contacts: [{ number: '', description: '' }] as PartnerContact[],
  emails: [{ email: '', description: '' }] as PartnerEmail[],
  facebook: '',
  instagram: '',
  websiteLink: '',
  catalog: null as File | null,
  document: null as File | null,
  secRegistration: null as File | null,
  birRegistration: null as File | null,
  dtiRegistration: null as File | null,
  philgepsRegistration: null as File | null,
  prcLicense: null as File | null,
  ptrLicense: null as File | null,
};

export type PartnerFormData = typeof PARTNER_FORM_INITIAL_DATA;

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  category: z.string().optional(),
  message: z.string().min(1, "Message of Intent is required"),
  specialty: z.string().optional(),
  licenseLink: z.string().optional(),
  firstName: z.string().min(1, "First Name is required"),
  pseudonym: z.string().min(1, "Pseudonym is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  pronoun: z.string().min(1, "Pronoun is required"),
  titles: z.string().optional(),
  addresses: z.array(z.any()).min(1, "At least one address is required"),
  contacts: z.array(z.any()).min(1, "At least one contact is required"),
  emails: z.array(z.any()).min(1, "At least one email is required"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  websiteLink: z.string().optional(),
  catalog: z.any().optional(),
  document: z.any().optional(),
  secRegistration: z.any().optional(),
  birRegistration: z.any().optional(),
  dtiRegistration: z.any().optional(),
  philgepsRegistration: z.any().optional(),
  prcLicense: z.any().optional(),
  ptrLicense: z.any().optional(),
});

export function isPartnerAddressValid(address?: PartnerAddress | null): boolean {
  if (!address) return false;
  return Boolean(
    address.type?.trim() &&
    address.regionCode?.trim() &&
    address.cityCode?.trim() &&
    address.barangayCode?.trim()
  );
}

export function isPartnerEmailValid(item?: PartnerEmail | null): boolean {
  if (!item) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Boolean(item.email?.trim() && emailRegex.test(item.email.trim()) && item.description?.trim());
}

export function isPartnerContactValid(item?: PartnerContact | null): boolean {
  if (!item) return false;
  return Boolean(item.number?.trim() && item.description?.trim());
}

export function isPartnerDocumentsValid(
  docs: {
    secRegistration?: any;
    birRegistration?: any;
    dtiRegistration?: any;
    philgepsRegistration?: any;
    prcLicense?: any;
    ptrLicense?: any;
  },
  variant: PartnerFormVariant
): boolean {
  if (variant === 'consultant') {
    return Boolean(
      docs.birRegistration &&
      docs.dtiRegistration &&
      docs.prcLicense &&
      docs.ptrLicense
    );
  }
  return Boolean(
    docs.secRegistration &&
    docs.birRegistration &&
    docs.dtiRegistration
  );
}

export function isPartnerSocialValid(links: {
  facebook?: string | null;
  instagram?: string | null;
  websiteLink?: string | null;
}): boolean {
  return Boolean(
    links.facebook?.trim() ||
    links.instagram?.trim() ||
    links.websiteLink?.trim()
  );
}
