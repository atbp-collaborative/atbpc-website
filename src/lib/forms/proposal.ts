import { ChoiceCardFieldConfig, ChipMultiSelectFieldConfig, FieldConfig } from '@/components/forms/form-fields';

export const STEP1_PROJECT_TYPE_FIELD: ChoiceCardFieldConfig = {
  type: 'choice-card',
  name: 'projectType',
  label: '',
  columns: 2,
  options: [
    { id: 'Residential', label: 'Residential Dwelling', desc: 'Custom ground-up houses or massive full-scale renovations.' },
    { id: 'Condo Fit-out', label: 'Condominium Interior Fit-out', desc: 'Sleek modular built-ins and custom space layouts.' },
    { id: 'Kiosk', label: 'Specialty Retail Kiosk', desc: 'F&B units or mall-based commercial express counters.' },
    { id: 'Retail Fit-out', label: 'Commercial / Retail Store Fit-out', desc: 'Fashion boutiques, modern offices, or restaurant spots.' },
    { id: 'Production Outsourcing', label: 'B2B Production Drawings', desc: 'Detailed CAD Permitting & shop drawing outsourcing.' },
  ],
};

export const STEP2_INCOME_CATEGORY_FIELD: ChoiceCardFieldConfig = {
  type: 'choice-card',
  name: 'incomeCategory',
  label: '',
  columns: 3,
  options: [
    { id: 'Mid-Income', label: 'Mid-Income Project', highlight: '₱350k - ₱1.5M', desc: 'Suited for boutiques, F&B kiosks, and premium modular condo layouts.' },
    { id: 'Mid-High-Income', label: 'Mid-High-Income Project', highlight: '₱1.5M - ₱5M', desc: 'Suited for complete residential overhauls, high-end retail, and larger suites.' },
    { id: 'High-Income', label: 'High-Income Project', highlight: '₱5M - ₱15M+', desc: 'Suited for ground-up concrete villas, mansions, or global outsourcing contracts.' },
  ],
};

export const STEP2_SCOPE_FIELD: ChipMultiSelectFieldConfig = {
  type: 'chip-multiselect',
  name: 'scopeNeeded',
  label: 'What architectural services do you require? (Select all that apply)',
  options: [
    'Architecture Design', 'Interior Fit-Out', 'Project Management',
    'Structural Engineering', 'Plumbing & Sanitary Design',
    'BIM Modeling / Rendering', 'General Construction / Contracting', 'Outsourced Drafting',
  ],
};

export const STEP3_FIELDS: FieldConfig[] = [
  { type: 'text', name: 'name', label: 'Your Complete Name', required: true, placeholder: 'e.g., Adrian Mores' },
  { type: 'email', name: 'email', label: 'Email Address', required: true, placeholder: 'e.g., adrian@domain.com' },
  { type: 'tel', name: 'phone', label: 'Mobile Contact Number', required: true, placeholder: 'e.g., +63 917 123 4567' },
  { type: 'tel', name: 'viber', label: 'Viber Number (If different)', placeholder: 'e.g., Same as Mobile' },
  {
    type: 'select',
    name: 'timeline',
    label: 'Onboarding Timeline',
    placeholder: '-- Select Timeline Preference --',
    options: [
      { value: 'Immediate', label: 'Immediate / Within 30 days' },
      { value: 'Quarterly', label: 'This Quarter / 2-3 months' },
      { value: 'Planning', label: 'Just planning / 6+ months' },
    ],
    wrapperClassName: 'col-span-1 sm:col-span-2',
  },
  {
    type: 'textarea',
    name: 'additionalDetails',
    label: 'Briefly Outline Site Location & Requirements',
    placeholder: 'Describe lot dimension, specific subdivision regulations, structural parameters...',
    rows: 3,
    wrapperClassName: 'col-span-1 sm:col-span-2',
  },
];
