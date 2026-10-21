import { LucideIcon } from 'lucide-react';

export interface ModalSection {
  icon?: LucideIcon;
  title: string;
  text?: string;
  list?: string[];
}

export interface ModalData {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  effectiveDate?: string;
  bodyHtml?: string;
  intro?: {
    title?: string;
    text: string;
  };
  sections?: ModalSection[];
  items?: string[];
  closeLabel?: string;
}

export interface ModalContent {
  name: string;
  page: string;
  type: string;
  contents: ModalData;
}
