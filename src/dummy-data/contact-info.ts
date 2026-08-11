export interface ContactInfo {
  address: string;
  landline: string;
  mobile: string;
  email: string;
  socials: {
    facebook: { label: string; url: string };
    threads: { label: string; url: string };
    instagram: { label: string; url: string };
  };
}

export const CONTACT_INFO: ContactInfo = {
  address: "P4, B2, L1, N402 Lovebird Lane corner Eagle Drive, Countryside Village, Barangay Sun Valley, City of Parañaque, National Capital Region, Philippines.",
  landline: "+632 8257-0968",
  mobile: "+63 917 165 4827",
  email: "enquire@atbpcollaborative.com",
  socials: {
    facebook: { label: "ATBP Collaborative", url: "#fb" },
    threads: { label: "@atbp.collaborative", url: "#threads" },
    instagram: { label: "@atbp.collaborative", url: "#ig" }
  }
};
