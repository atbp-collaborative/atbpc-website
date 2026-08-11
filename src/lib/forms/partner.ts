import { FieldConfig, PhAddress, EMPTY_PH_ADDRESS } from '@/components/forms/form-fields';

export type PartnerFormVariant = 'supplier' | 'builder' | 'consultant';

export interface PartnerFormFieldSet {
  leftColumnTop: FieldConfig[];
  leftColumnBottomGrid?: FieldConfig[]; // 2 cols for supplier, 3 cols for others
  rightColumnRowsTop: FieldConfig[][];
  addressField: FieldConfig;
  rightColumnRowsBottom: FieldConfig[][];
}

const COMMON_RIGHT_TOP_ROWS: FieldConfig[][] = [
  [
    { type: 'text', name: 'firstName', label: 'First Name' },
    { type: 'text', name: 'pseudonym', label: 'Pseudonym', badge: '!' },
  ],
  [
    { type: 'text', name: 'middleName', label: 'Middle Name', note: "(Mother's Maiden Last Name)" },
    { type: 'text', name: 'lastName', label: 'Last Name' },
  ],
  [
    { type: 'text', name: 'pronoun', label: 'Pronoun' },
    { type: 'text', name: 'titles', label: 'Titles' },
  ],
];

const COMMON_ADDRESS_FIELD: FieldConfig = { type: 'address', name: 'address', label: 'Addresses (Office / Warehouse / Facility)', dense: true };

const COMMON_RIGHT_BOTTOM_ROWS: FieldConfig[][] = [
  [
    { type: 'text', name: 'contactNumber', label: 'Contact Number', placeholder: 'Viber & Whatsapp Ready' },
    { type: 'text', name: 'landline', label: 'Landline', placeholder: 'Viber & Whatsapp Ready' },
  ],
  [
    { type: 'email', name: 'email', label: 'Email Address' }
  ],
  [
    { type: 'text', name: 'facebook', label: 'Facebook', placeholder: 'Paste URL / Link / Handle' },
    { type: 'text', name: 'instagram', label: 'Instagram', placeholder: 'Paste URL / Link / Handle' },
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
      addressField: COMMON_ADDRESS_FIELD,
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

  const leftColumnBottomGrid: FieldConfig[] = [
    { type: 'textarea', name: 'profileLink', label: 'Profile', badge: '!', placeholder: 'Paste Here Link to Flipbook. (Sorry No PDF)', variant: 'compact' },
    { type: 'file', name: 'document', label: 'Documents', badge: '!', dropHint: 'Sample Contract', typeHint: '(PDF)' },
    { type: 'textarea', name: 'coverVideoLink', label: 'Cover Video', badge: '!', placeholder: 'Paste Here Link to Cover Video', variant: 'compact' },
    { type: 'textarea', name: 'mapLink', label: 'Map', badge: '!', placeholder: 'Map Link to Office / HQ. (Sorry No PDF)', variant: 'compact' },
    { type: 'textarea', name: 'licenseLink', label: 'License', badge: '!', placeholder: variant === 'builder' ? 'PCAB License Verification (Link to PCAB)' : 'PRC / PTR License Verification (Link to License)', variant: 'compact' },
    { type: 'file', name: 'registration', label: 'Registration', badge: '!', dropHint: 'SEC / BIR / DTI Verification', typeHint: '(Consolidated PDF)' },
  ];

  return {
    leftColumnTop,
    leftColumnBottomGrid,
    rightColumnRowsTop: COMMON_RIGHT_TOP_ROWS,
    addressField: COMMON_ADDRESS_FIELD,
    rightColumnRowsBottom: COMMON_RIGHT_BOTTOM_ROWS
  };
};

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
  address: EMPTY_PH_ADDRESS as PhAddress,
  contactNumber: '',
  landline: '',
  email: '',
  facebook: '',
  instagram: '',
  websiteLink: '',
  catalog: null as File | null,
  document: null as File | null,
  registration: null as File | null,
};

export type PartnerFormData = typeof PARTNER_FORM_INITIAL_DATA;
