import { FieldConfig, PhAddress, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields';

export type PartnerFormVariant = 'supplier' | 'builder' | 'consultant';

export interface PartnerFormFieldSet {
  leftColumnTop: FieldConfig[];
  leftColumnBottomGrid?: FieldConfig[]; // 2 cols for supplier, 3 cols for others
  rightColumnRowsTop: FieldConfig[][];
  rightColumnRowsMiddle?: FieldConfig[][];
  rightColumnRowsBottom: FieldConfig[][];
}

const COMMON_RIGHT_TOP_ROWS: FieldConfig[][] = [
  [
    { type: 'text', name: 'firstName', label: 'First Name', wrapperClassName: 'sm:col-span-2' },
    { type: 'text', name: 'pseudonym', label: 'Pseudonym', badge: '!', wrapperClassName: 'sm:col-span-2' },
  ],
  [
    { type: 'text', name: 'middleName', label: 'Middle Name', note: "(Mother's Maiden Last Name)", wrapperClassName: 'sm:col-span-2' },
    { type: 'text', name: 'lastName', label: 'Last Name', wrapperClassName: 'sm:col-span-2' },
  ],
  [
    { type: 'text', name: 'pronoun', label: 'Pronoun', wrapperClassName: 'sm:col-span-2' },
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
    { type: 'text', name: 'companyName', label: 'Company Name' }
  ];

  if (variant === 'supplier') {
    if (options.categories) {
      leftColumnTop.push({
        type: 'select',
        name: 'category',
        label: 'Brief Description',
        placeholder: 'What category?',
        options: options.categories
      });
    }

    leftColumnTop.push({
      type: 'textarea',
      name: 'message',
      label: '',
      placeholder: 'Message (200 Word Count)',
      grow: true
    });

    const leftColumnBottomGrid: FieldConfig[] = [
      { type: 'file', name: 'catalog', label: 'Catalog', badge: '!', typeHint: '(PDF Only)' },
      { type: 'textarea', name: 'websiteLink', label: 'Website', badge: '!', placeholder: 'Paste Here Link to Website', variant: 'compact' },
    ];

    return {
      leftColumnTop,
      leftColumnBottomGrid,
      rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS,
      rightColumnRowsBottom: COMMON_RIGHT_BOTTOM_ROWS
    };
  }

  // builder or consultant
  if (options.specialties) {
    leftColumnTop.push({
      type: 'select',
      name: 'specialty',
      label: 'Specialty',
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
    placeholder: 'Message (200 Word Count)',
    grow: true
  });

  const leftColumnBottomGrid: FieldConfig[] = [
    { type: 'textarea', name: 'profileLink', label: 'Profile', badge: '!', placeholder: 'Paste Here Link to Flipbook. (Sorry No PDF)', variant: 'compact' },
    { type: 'file', name: 'document', label: 'Documents', badge: '!', dropHint: 'Sample Contract', typeHint: '(PDF)' },
    { type: 'textarea', name: 'coverVideoLink', label: 'Cover Video', badge: '!', placeholder: 'Paste Here Link to Cover Video', variant: 'compact' },
  ];

  const rightColumnRowsMiddle: FieldConfig[][] = [
    [
      { type: 'text', name: 'licenseLink', label: variant === 'builder' ? 'PCAB License' : 'PRC / PTR License', badge: '!', wrapperClassName: 'sm:col-span-2' },
      { type: 'file', name: 'secRegistration', label: 'SEC Registration', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', wrapperClassName: 'sm:col-span-2', variant: 'compact' }
    ],
    [
      { type: 'file', name: 'birRegistration', label: 'BIR Registration', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', wrapperClassName: 'sm:col-span-2', variant: 'compact' },
      { type: 'file', name: 'dtiRegistration', label: 'DTI Registration', badge: '!', typeHint: '(PDF, JPG, GIF, PNG)', wrapperClassName: 'sm:col-span-2', variant: 'compact' }
    ]
  ];

  return {
    leftColumnTop,
    leftColumnBottomGrid,
    rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS,
    rightColumnRowsMiddle,
    rightColumnRowsBottom: COMMON_RIGHT_BOTTOM_ROWS
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
};

export type PartnerFormData = typeof PARTNER_FORM_INITIAL_DATA;
