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
    { type: 'text', name: 'titles', label: 'Titles', wrapperClassName: 'sm:col-span-2' },
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
  typologies?: string[];
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
        placeholder: 'What category?',
        options: options.categories
      });
    }

    leftColumnTop.push({
      type: 'textarea',
      name: 'message',
      label: '',
      badge: '!',
      placeholder: 'Message (200 Word Count)',
      grow: true
    });

    const leftColumnBottomGrid: FieldConfig[] = [
      { type: 'file', name: 'catalog', label: 'Catalog', badge: '!', typeHint: '(PDF Only)' },
      { type: 'textarea', name: 'websiteLink', label: 'Website', placeholder: 'Paste Here Link to Website', variant: 'compact' },
      { type: 'file', name: 'sourceOfIncome', label: 'Source of Income' }
    ];

    return {
      leftColumnTop,
      leftColumnBottomGrid,
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
      placeholder: 'What Specialty?',
      options: options.specialties,
      // @ts-ignore
      dense: true
    });
  }

  if (options.typologies) {
    leftColumnTop.push({
      type: 'select',
      name: 'typology',
      label: 'Specialized Typology',
      badge: '!',
      placeholder: 'What Typology?',
      options: options.typologies,
      // @ts-ignore
      dense: true
    });
  }

  leftColumnTop.push({
    type: 'textarea',
    name: 'message',
    label: '',
    badge: '!',
    placeholder: 'Message (200 Word Count)',
    grow: true
  });

  const leftColumnBottomGrid: FieldConfig[] = [
    { type: 'textarea', name: 'profileLink', label: 'Profile', badge: '!', placeholder: 'Paste Here Link to Flipbook. (Sorry No PDF)', variant: 'compact' },
    { type: 'file', name: 'document', label: 'Documents', badge: '!', dropHint: 'Sample Contract', typeHint: '(PDF)' },
    { type: 'textarea', name: 'coverVideoLink', label: 'Cover Video', placeholder: 'Paste Here Link to Cover Video', variant: 'compact' },
    { type: 'file', name: 'sourceOfIncome', label: 'Source of Income' }
  ];

  return {
    leftColumnTop,
    leftColumnBottomGrid,
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
  typology: '',
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
  sourceOfIncome: null as File | null,
};

export type PartnerFormData = typeof PARTNER_FORM_INITIAL_DATA;

export const partnerSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  category: z.string().optional(), // conditionally required
  message: z.string().min(1, "Message is required"),
  specialty: z.string().optional(), // conditionally required
  typology: z.string().optional(), // conditionally required
  profileLink: z.string().min(1, "Profile Link is required"),
  coverVideoLink: z.string().optional(),
  mapLink: z.string().min(1, "Map Link is required"),
  licenseLink: z.string().min(1, "License Link is required"),
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
  sourceOfIncome: z.any().refine((file) => file !== null, "Source of Income is required"),
});
