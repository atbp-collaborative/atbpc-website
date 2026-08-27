import { FieldConfig, PhAddress, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields';
import { z } from 'zod';

export type PartnerFormVariant = 'supplier' | 'builder' | 'consultant';

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
    { type: 'text', name: 'pronoun', label: 'Pronoun', badge: '!', wrapperClassName: 'sm:col-span-2' },
    {
      type: 'select',
      name: 'titles',
      label: 'Titles',
      placeholder: '[ Select Title ]',
      options: ['Arch.', 'Engr.', 'IDr.', 'Atty.', 'Dr.'],
      wrapperClassName: 'sm:col-span-2'
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
    { type: 'text', name: 'companyName', label: 'Company Name / Registered Name', badge: '!' }
  ];

  if (variant === 'supplier') {
    if (options.categories) {
      leftColumnTop.push({
        type: 'select',
        name: 'category',
        label: 'Brief Description',
        badge: '!',
        placeholder: '[ Select Category ]',
        options: options.categories
      });
    }

    leftColumnTop.push({
      type: 'textarea',
      name: 'message',
      label: '',
      badge: '!',
      placeholder: 'Please limit your message to a 200-word count. Be brief about your intent (kindly make the composition friendly but professional)',
      grow: true
    });

    return {
      leftColumnTop,
      rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS
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
      dense: true
    });
  }



  leftColumnTop.push({
    type: 'textarea',
    name: 'message',
    label: '',
    badge: '!',
    placeholder: 'Please limit your message to a 200-word count. Be brief about your intent (kindly make the composition friendly but professional)',
    grow: true
  });

  return {
    leftColumnTop,
    rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS
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
  profileLink: '',
  coverVideoLink: '',
  mapLink: '',
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
  sourceOfIncome: null as File | null,
  prcLicense: null as File | null,
  ptrLicense: null as File | null,
};

export type PartnerFormData = typeof PARTNER_FORM_INITIAL_DATA;

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  category: z.string().optional(), // conditionally required
  message: z.string().min(1, "Message is required"),
  specialty: z.string().optional(), // conditionally required
  profileLink: z.string().optional(),
  coverVideoLink: z.string().optional(),
  mapLink: z.string().min(1, "Map Link is required"),
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
  catalog: z.any().optional(), // conditionally required for suppliers
  document: z.any().optional(), // conditionally required
  secRegistration: z.any().refine((file) => file !== null, "SEC Registration is required"),
  birRegistration: z.any().refine((file) => file !== null, "BIR Registration is required"),
  dtiRegistration: z.any().refine((file) => file !== null, "DTI Registration is required"),
  philgepsRegistration: z.any().optional(),
  sourceOfIncome: z.any().optional(),
  prcLicense: z.any().optional(),
  ptrLicense: z.any().optional(),
});
