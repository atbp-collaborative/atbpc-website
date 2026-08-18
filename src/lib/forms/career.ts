import {
  FieldConfig,
  PhAddress,
  EMPTY_PH_ADDRESS,
} from "@/components/forms/form-fields";
import { z } from "zod";

/**
 * studio-regulars / internship-program / apprenticeship-program all render
 * CareerForm today with an identical field set — only the pre-selected
 * `structure` option differs (see CareerForm's `initialStructure` prop).
 * This is still keyed by program type so a future divergence (e.g. the
 * studio regulars type wanting a PRC-number field) is a data change here, not a
 * new component.
 */
export type CareerFormType = "internship" | "apprenticeship" | "studioRegulars";

const DEPARTMENTS = [
  "Architectural Design & Research",
  "Interior & Spatial Design",
  "Engineering & Construction Support",
  "Modular & F&B Practice",
  "Studio Operations & Administration",
];

const STRUCTURES = [
  "Full-Time Practice",
  "Apprenticeship / Junior Architect",
  "Project-Based Consultancy",
  "Internship Fellowship",
];

const LEFT_COLUMN_TOP: FieldConfig[] = [
  {
    type: "select",
    name: "department",
    label: "Department",
    badge: "!",
    options: DEPARTMENTS,
    placeholder: "In which department do you see your growth?",
  },
  {
    type: "select",
    name: "structure",
    label: "Structure",
    badge: "!",
    options: STRUCTURES,
    placeholder: "What kind of role are you exploring?",
  },
];

const JOB_DESCRIPTION_FIELD: FieldConfig = {
  type: "textarea",
  name: "jobDescription",
  label: "",
  placeholder: "Job Description Here",
  grow: true,
};

const UPLOAD_ROW: FieldConfig[] = [
  {
    type: "file",
    name: "resumeFile",
    label: "Resume",
    badge: "!",
    dropHint: "Click / Drag to Upload Resume",
    typeHint: "(PDF Only)",
  },
  {
    type: "textarea",
    name: "portfolioLink",
    label: "Portfolio",
    badge: "!",
    variant: "compact",
    placeholder: "Paste Here Link to Flipbook. (Sorry No PDF)",
  },
  {
    type: "textarea",
    name: "coverVideoLink",
    label: "Cover Video",
    badge: "!",
    variant: "compact",
    placeholder: "Paste Here Link to Cover Video",
  },
];

// Each entry is one visual row — 2 fields render as a 2-col grid, 1 renders full-width.
const RIGHT_COLUMN_ROWS: FieldConfig[][] = [
  [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      badge: "!",
      wrapperClassName: "sm:col-span-2",
    },
    {
      type: "text",
      name: "pseudonym",
      label: "Pseudonym",
      badge: "!",
      wrapperClassName: "sm:col-span-2",
    },
  ],
  [
    {
      type: "text",
      name: "middleName",
      label: "Middle Name",
      note: "(Mother's Maiden Last Name)",
      wrapperClassName: "sm:col-span-2",
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      badge: "!",
      wrapperClassName: "sm:col-span-2",
    },
  ],
  [
    {
      type: "text",
      name: "pronoun",
      label: "Pronoun",
      badge: "!",
      wrapperClassName: "sm:col-span-1",
    },
    {
      type: "text",
      name: "titles",
      label: "Titles",
      wrapperClassName: "sm:col-span-1",
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      badge: "!",
      wrapperClassName: "sm:col-span-2",
    },
  ],
  [{ type: "address", name: "address", label: "", dense: true }],
  [
    {
      type: "text",
      name: "contactNumber",
      label: "Contact Number",
      badge: "!",
      placeholder: "Must be Viber & Whatsapp Ready",
      wrapperClassName: "sm:col-span-1",
    },
    {
      type: "div",
      name: "emergencyContact",
      label: "Emergency Contact",
      wrapperClassName: "sm:col-span-1",
    },
    {
      type: "text",
      name: "facebook",
      label: "Facebook",
      placeholder: "Paste URL / Link / Handle",
      wrapperClassName: "sm:col-span-1",
    },
    {
      type: "text",
      name: "instagram",
      label: "Instagram",
      placeholder: "Paste URL / Link / Handle",
      wrapperClassName: "sm:col-span-1",
    },
  ],
];

const APPRENTICESHIP_DEPARTMENTS = [
  "Admin Team (Finance, Marketing, Coordination)",
  "Production Team (Design & Technical)",
  "Project Management Team (Procurement, Logistics, Administration)",
  "Construction Team (Supervision, Manpower)",
];

const APPRENTICESHIP_STRUCTURES = [
  "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)",
  "Vocational Internship (National Certificate Holder)",
  "Diversified Architectural Experience (3,840 logbook hours)",
];

export const STRUCTURE_DESCRIPTIONS: Record<string, string> = {
  "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)":
    "This program is designed for current students seeking to fulfill their academic internship requirements under CHED Memorandum Order No. 104, Series of 2017. You will work on real-world projects under the guidance of licensed professionals, gaining practical experience in design, project coordination, and administration while earning academic credits.\n\nFor more details, refer to the official guidelines: [CMO-NO.-104-S.-2017.pdf](https://legacy.ched.gov.ph/wp-content/uploads/2018/03/CMO-NO.-104-S.-2017.pdf).",

  "Vocational Internship (National Certificate Holder)":
    "Designed for National Certificate (NC) holders from vocational institutions seeking practical training and competency reinforcement. This internship focuses on hands-on production, design implementation, and technical skill refinement, helping you bridge the gap between vocational certification and industry-standard production workflows.",

  "Diversified Architectural Experience (3,840 logbook hours)":
    "This program provides the 3,840 logbook hours of Diversified Architectural Experience required for BS Architecture graduates to qualify for the Architect Licensure Examination (ALE) in the Philippines. Under the mentorship of registered and licensed architects, you will gain comprehensive exposure to architectural design, construction supervision, project management, and contract documents as prescribed by the Professional Regulation Commission (PRC) guidelines."
};

const APPRENTICESHIP_LEFT_COLUMN_TOP: FieldConfig[] = [
  {
    type: "select",
    name: "department",
    label: "Department",
    badge: "!",
    options: APPRENTICESHIP_DEPARTMENTS,
    placeholder: "[ Select Team ]",
  },
  {
    type: "select",
    name: "structure",
    label: "Structure",
    badge: "!",
    options: APPRENTICESHIP_STRUCTURES,
    placeholder: "What kind of role are you exploring?",
  },
];

const APPRENTICESHIP_JOB_DESCRIPTION_FIELD: FieldConfig = {
  type: "div",
  name: "jobDescription",
  label: "",
  placeholder: "Please select an apprenticeship/internship structure above to view the corresponding program description and requirements.",
  grow: true,
};

const APPRENTICESHIP_UPLOAD_ROW: FieldConfig[] = [
  {
    type: "file",
    name: "resumeFile",
    label: "Resumé",
    badge: "!",
    dropHint: "Click / Drag to Upload Resumé",
    typeHint: "(PDF Only)",
  },
  {
    type: "textarea",
    name: "portfolioLink",
    label: "Portfolio",
    badge: "!",
    variant: "compact",
    placeholder: "Paste Here Link to Flipbook. (Sorry No PDF)",
  },
  {
    type: "textarea",
    name: "coverVideoLink",
    label: "Cover Video",
    badge: "!",
    variant: "compact",
    placeholder: "Paste Here Link to Cover Video",
  },
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

const APPRENTICESHIP_FIELD_SET: CareerFormFieldSet = {
  leftColumnTop: APPRENTICESHIP_LEFT_COLUMN_TOP,
  jobDescriptionField: APPRENTICESHIP_JOB_DESCRIPTION_FIELD,
  uploadRow: APPRENTICESHIP_UPLOAD_ROW,
  rightColumnRows: RIGHT_COLUMN_ROWS,
};

export const CAREER_FORM_FIELDS: Record<CareerFormType, CareerFormFieldSet> = {
  internship: DEFAULT_FIELD_SET,
  apprenticeship: APPRENTICESHIP_FIELD_SET,
  studioRegulars: DEFAULT_FIELD_SET,
};

export const CAREER_FORM_INITIAL_DATA = {
  department: "",
  structure: "",
  jobDescription: "",
  resumeFile: null as File | null,
  portfolioLink: "",
  coverVideoLink: "",
  firstName: "",
  pseudonym: "",
  middleName: "",
  lastName: "",
  pronoun: "",
  titles: "",
  address: EMPTY_PH_ADDRESS as PhAddress,
  contactNumber: "",
  email: "",
  facebook: "",
  instagram: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactNumber: "",
};

export type CareerFormData = typeof CAREER_FORM_INITIAL_DATA;

/**
 * Scalar fields that must be filled before Submit unlocks. `(!)`-badged fields
 * (Pseudonym, Resume, Portfolio, Cover Video) stay optional — the address's
 * Region/City/Barangay are checked separately since they're nested.
 */
export const CAREER_FORM_REQUIRED_FIELDS: (keyof CareerFormData)[] = [
  "department",
  "structure",
  "firstName",
  "pseudonym",
  "lastName",
  "pronoun",
  "contactNumber",
  "email",
];

export const careerSchema = z.object({
  department: z.string().min(1, "Department is required"),
  structure: z.string().min(1, "Structure is required"),
  jobDescription: z.string().optional(),
  resumeFile: z.any().refine((file) => file !== null, "Resume is required"),
  portfolioLink: z.string().min(1, "Portfolio Link is required"),
  coverVideoLink: z.string().min(1, "Cover Video Link is required"),
  firstName: z.string().min(1, "First Name is required"),
  pseudonym: z.string().min(1, "Pseudonym is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  pronoun: z.string().min(1, "Pronoun is required"),
  titles: z.string().optional(),
  address: z.object({
    regionCode: z.string().min(1, "Region is required"),
    cityCode: z.string().min(1, "City is required"),
    barangayCode: z.string().min(1, "Barangay is required"),
    streetAddress: z.string().optional(),
  }),
  contactNumber: z.string().min(1, "Contact Number is required"),
  email: z.string().email("Invalid email address"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
});
