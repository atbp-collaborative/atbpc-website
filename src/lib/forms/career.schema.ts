import {
  FieldConfig,
  PhAddress,
  EMPTY_PH_ADDRESS,
} from "@/components/forms/form-fields/types";
import { z } from "zod";

export interface FacultyContactInfo {
  name: string;
  contactNumber: string;
  landline: string;
  email: string;
}

export type FacultyContacts = {
  dean: FacultyContactInfo;
  chairperson: FacultyContactInfo;
  ojtInstructor: FacultyContactInfo;
  guidanceOfficer: FacultyContactInfo;
  disciplineOfficer: FacultyContactInfo;
};

export const EMPTY_FACULTY_CONTACT: FacultyContactInfo = { name: "", contactNumber: "", landline: "", email: "" };

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
    placeholder: "[ Select Department ]",
  },
  {
    type: "select",
    name: "structure",
    label: "Structure",
    badge: "!",
    options: STRUCTURES,
    placeholder: "[ Select Role ]",
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
  [{ type: "address", name: "applicantAddress", label: "", dense: true }],
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
    "This program is designed for current students seeking to fulfill their academic internship requirements under [CHED Memorandum Order No. 104, Series of 2017](https://legacy.ched.gov.ph/wp-content/uploads/2018/03/CMO-NO.-104-S.-2017.pdf). You will work on real-world projects under the guidance of licensed professionals, gaining practical experience in design, project coordination, and administration while earning academic credits.\n\nFor more details, refer to the official guidelines: [CMO-NO.-104-S.-2017.pdf](https://legacy.ched.gov.ph/wp-content/uploads/2018/03/CMO-NO.-104-S.-2017.pdf).",

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
    placeholder: "[ Select Role ]",
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

const STUDIO_REGULARS_DEPARTMENTS = [
  "Admin Team (Finance, Marketing, Coordination)",
  "Production Team (Design & Technical)",
  "Construction Team (Supervision, Manpower)",
];

const STUDIO_REGULARS_LEFT_COLUMN_TOP: FieldConfig[] = [
  {
    type: "select",
    name: "department",
    label: "Department",
    badge: "!",
    options: STUDIO_REGULARS_DEPARTMENTS,
    placeholder: "[ Select Department ]",
  },
  {
    type: "select",
    name: "structure",
    label: "Structure",
    badge: "!",
    options: [],
    placeholder: "[ Select Role ]",
  },
];

const STUDIO_REGULARS_FIELD_SET: CareerFormFieldSet = {
  leftColumnTop: STUDIO_REGULARS_LEFT_COLUMN_TOP,
  jobDescriptionField: JOB_DESCRIPTION_FIELD,
  uploadRow: UPLOAD_ROW,
  rightColumnRows: RIGHT_COLUMN_ROWS,
};

export const CAREER_FORM_FIELDS: Record<CareerFormType, CareerFormFieldSet> = {
  internship: DEFAULT_FIELD_SET,
  apprenticeship: APPRENTICESHIP_FIELD_SET,
  studioRegulars: STUDIO_REGULARS_FIELD_SET,
};

export const CAREER_FORM_INITIAL_DATA = {
  department: "",
  structure: "",
  resumeFile: null as File | null,
  portfolioLink: "",
  coverVideoLink: "",
  firstName: "",
  pseudonym: "",
  middleName: "",
  lastName: "",
  pronoun: "",
  titles: "",
  applicantAddress: EMPTY_PH_ADDRESS as PhAddress,
  contactNumber: "",
  email: "",
  facebook: "",
  instagram: "",
  emergencyContactPerson: {
    name: "",
    relationship: "",
    number: "",
    landline: "",
    email: "",
    sameAsApplicant: true,
    address: EMPTY_PH_ADDRESS as PhAddress,
  },
  // Dynamic Documents fields
  ojtRequirementsFile: null as File | null,
  moaFile: null as File | null,
  contractFile: null as File | null,
  enrolmentFormFile: null as File | null,
  schoolIdFile: null as File | null,
  clearanceFile: null as File | null,
  diplomaFile: null as File | null,
  prcIdFile: null as File | null,
  validIdFile: null as File | null,
  tinIdFile: null as File | null,
  facultyContacts: {
    dean: { ...EMPTY_FACULTY_CONTACT },
    chairperson: { ...EMPTY_FACULTY_CONTACT },
    ojtInstructor: { ...EMPTY_FACULTY_CONTACT },
    guidanceOfficer: { ...EMPTY_FACULTY_CONTACT },
    disciplineOfficer: { ...EMPTY_FACULTY_CONTACT },
  } as FacultyContacts,
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
  "portfolioLink",
  "coverVideoLink",
];

export const careerSchema = z.object({
  department: z.string().min(1, "Department is required"),
  structure: z.string().min(1, "Structure is required"),
  resumeFile: z.any().optional().nullable(),
  portfolioLink: z.string().min(1, "Portfolio Link is required"),
  coverVideoLink: z.string().min(1, "Cover Video Link is required"),
  firstName: z.string().min(1, "First Name is required"),
  pseudonym: z.string().min(1, "Pseudonym is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last Name is required"),
  pronoun: z.string().min(1, "Pronoun is required"),
  titles: z.string().optional(),
  applicantAddress: z.object({
    regionCode: z.string().min(1, "Region is required"),
    cityCode: z.string().min(1, "City is required"),
    barangayCode: z.string().min(1, "Barangay is required"),
    streetAddress: z.string().optional(),
  }),
  contactNumber: z.string().min(1, "Contact Number is required"),
  email: z.string().email("Invalid email address"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  emergencyContactPerson: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    number: z.string().optional(),
    landline: z.string().optional(),
    email: z.string().optional(),
    sameAsApplicant: z.boolean().optional(),
    address: z.object({
      regionCode: z.string().optional(),
      cityCode: z.string().optional(),
      barangayCode: z.string().optional(),
      streetAddress: z.string().optional(),
    }).optional(),
  }).optional(),
  // New Document fields
  ojtRequirementsFile: z.any().optional().nullable(),
  moaFile: z.any().optional().nullable(),
  contractFile: z.any().optional().nullable(),
  enrolmentFormFile: z.any().optional().nullable(),
  schoolIdFile: z.any().optional().nullable(),
  clearanceFile: z.any().optional().nullable(),
  diplomaFile: z.any().optional().nullable(),
  prcIdFile: z.any().optional().nullable(),
  validIdFile: z.any().optional().nullable(),
  tinIdFile: z.any().optional().nullable(),
  facultyContacts: z.object({
    dean: z.object({
      name: z.string().min(1, "Required"),
      contactNumber: z.string().min(1, "Required"),
      email: z.string().min(1, "Required"),
      landline: z.string().optional(),
    }),
    chairperson: z.object({
      name: z.string().min(1, "Required"),
      contactNumber: z.string().min(1, "Required"),
      email: z.string().min(1, "Required"),
      landline: z.string().optional(),
    }),
    ojtInstructor: z.object({
      name: z.string().min(1, "Required"),
      contactNumber: z.string().min(1, "Required"),
      email: z.string().min(1, "Required"),
      landline: z.string().optional(),
    }),
    guidanceOfficer: z.object({
      name: z.string().min(1, "Required"),
      contactNumber: z.string().min(1, "Required"),
      email: z.string().min(1, "Required"),
      landline: z.string().optional(),
    }),
    disciplineOfficer: z.object({
      name: z.string().min(1, "Required"),
      contactNumber: z.string().min(1, "Required"),
      email: z.string().min(1, "Required"),
      landline: z.string().optional(),
    }),
  }).optional(),
});

export function getRequiredDocumentFields(structure: string): string[] {
  if (!structure) return [];
  if (
    structure === "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)" ||
    structure === "Vocational Internship (National Certificate Holder)"
  ) {
    return ["resumeFile", "ojtRequirementsFile", "moaFile", "contractFile", "enrolmentFormFile", "schoolIdFile"];
  } else if (structure === "Diversified Architectural Experience (3,840 logbook hours)") {
    return ["resumeFile", "clearanceFile", "diplomaFile"];
  } else {
    // Regular
    return ["resumeFile", "validIdFile", "tinIdFile"];
  }
}

export function getDocumentFieldsForStructure(structure: string): { name: string; label: string; required: boolean }[] {
  if (!structure) return [];
  if (
    structure === "Curriculum-based Internship (CHED Memorandum Order No. 104, Series of 2017)" ||
    structure === "Vocational Internship (National Certificate Holder)"
  ) {
    return [
      { name: "resumeFile", label: "Resumé", required: true },
      { name: "ojtRequirementsFile", label: "OJT Requirements", required: true },
      { name: "moaFile", label: "Memorandum of Agreement", required: true },
      { name: "contractFile", label: "Contract", required: true },
      { name: "enrolmentFormFile", label: "Enrolment Form", required: true },
      { name: "schoolIdFile", label: "School ID", required: true },
    ];
  } else if (structure === "Diversified Architectural Experience (3,840 logbook hours)") {
    return [
      { name: "resumeFile", label: "Resumé", required: true },
      { name: "clearanceFile", label: "Clearance", required: true },
      { name: "diplomaFile", label: "Diploma", required: true },
    ];
  } else {
    // Regular
    const fields = [
      { name: "resumeFile", label: "Resumé", required: true },
      { name: "prcIdFile", label: "PRC ID", required: false },
      { name: "validIdFile", label: "Valid ID", required: true },
      { name: "tinIdFile", label: "TIN ID", required: true },
    ];

    if (
      structure.includes("[HROA-") ||
      (structure.includes("[HRGM-") && !structure.includes("[HRGM-06"))
    ) {
      return fields.filter((f) => f.name !== "prcIdFile");
    }

    return fields;
  }
}
