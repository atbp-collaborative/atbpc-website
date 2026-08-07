import { FieldConfig, PhAddress, EMPTY_PH_ADDRESS } from './form-fields';

/**
 * studio-regulars / internship-program / apprenticeship-program all render
 * CareerForm today with an identical field set — only the pre-selected
 * `structure` option differs (see CareerForm's `initialStructure` prop).
 * This is still keyed by program type so a future divergence (e.g. the
 * studio regulars type wanting a PRC-number field) is a data change here, not a
 * new component.
 */
export type CareerFormType = 'internship' | 'apprenticeship' | 'studioRegulars';

const DEPARTMENTS = [
  'Architectural Design & Research',
  'Interior & Spatial Design',
  'Engineering & Construction Support',
  'Modular & F&B Practice',
  'Studio Operations & Administration',
];

const STRUCTURES = [
  'Full-Time Practice',
  'Apprenticeship / Junior Architect',
  'Project-Based Consultancy',
  'Internship Fellowship',
];

const LEFT_COLUMN_TOP: FieldConfig[] = [
  { type: 'select', name: 'department', label: 'Department', options: DEPARTMENTS, placeholder: 'In which department do you see your growth?' },
  { type: 'select', name: 'structure', label: 'Structure', options: STRUCTURES, placeholder: 'What kind of role are you exploring?' },
];

const JOB_DESCRIPTION_FIELD: FieldConfig = {
  type: 'textarea', name: 'jobDescription', label: '', placeholder: 'Job Description Here', grow: true,
};

const UPLOAD_ROW: FieldConfig[] = [
  { type: 'file', name: 'resumeFile', label: 'Resume', badge: '!', dropHint: 'Click / Drag to Upload Resume', typeHint: '(PDF Only)' },
  { type: 'textarea', name: 'portfolioLink', label: 'Portfolio', badge: '!', variant: 'compact', placeholder: 'Paste Here Link to Flipbook. (Sorry No PDF)' },
  { type: 'textarea', name: 'coverVideoLink', label: 'Cover Video', badge: '!', variant: 'compact', placeholder: 'Paste Here Link to Cover Video' },
];

// Each entry is one visual row — 2 fields render as a 2-col grid, 1 renders full-width.
const RIGHT_COLUMN_ROWS: FieldConfig[][] = [
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
  [{ type: 'address', name: 'address', label: 'Address', dense: true }],
  [
    { type: 'text', name: 'contactNumber', label: 'Contact Number', placeholder: 'Must be Viber & Whatsapp Ready' },
    { type: 'text', name: 'facebook', label: 'Facebook', placeholder: 'Paste URL / Link / Handle' },
  ],
  [
    { type: 'email', name: 'email', label: 'Email Address' },
    { type: 'text', name: 'instagram', label: 'Instagram', placeholder: 'Paste URL / Link / Handle' },
  ],
];

export interface CareerFormFieldSet {
  leftColumnTop: FieldConfig[];
  jobDescriptionField: FieldConfig;
  uploadRow: FieldConfig[];
  rightColumnRows: FieldConfig[][];
}

const DEFAULT_FIELD_SET: CareerFormFieldSet = {
  leftColumnTop: LEFT_COLUMN_TOP,
  jobDescriptionField: JOB_DESCRIPTION_FIELD,
  uploadRow: UPLOAD_ROW,
  rightColumnRows: RIGHT_COLUMN_ROWS,
};

export const CAREER_FORM_FIELDS: Record<CareerFormType, CareerFormFieldSet> = {
  internship: DEFAULT_FIELD_SET,
  apprenticeship: DEFAULT_FIELD_SET,
  studioRegulars: DEFAULT_FIELD_SET,
};

export const CAREER_FORM_INITIAL_DATA = {
  department: '',
  structure: '',
  jobDescription: '',
  resumeFile: null as File | null,
  portfolioLink: '',
  coverVideoLink: '',
  firstName: '',
  pseudonym: '',
  middleName: '',
  lastName: '',
  pronoun: '',
  titles: '',
  address: EMPTY_PH_ADDRESS as PhAddress,
  contactNumber: '',
  email: '',
  facebook: '',
  instagram: '',
};

export type CareerFormData = typeof CAREER_FORM_INITIAL_DATA;

/**
 * Scalar fields that must be filled before Submit unlocks. `(!)`-badged fields
 * (Pseudonym, Resume, Portfolio, Cover Video) stay optional — the address's
 * Region/City/Barangay are checked separately since they're nested.
 */
export const CAREER_FORM_REQUIRED_FIELDS: (keyof CareerFormData)[] = [
  'department',
  'structure',
  'firstName',
  'lastName',
  'contactNumber',
  'email',
];
