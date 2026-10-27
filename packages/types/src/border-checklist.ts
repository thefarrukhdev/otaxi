import { CountryCode } from './enums';

export interface IChecklistItem {
  id: string;
  title: Record<string, string>; // { uz: string, ru: string, en: string }
  description: Record<string, string>;
  isRequired: boolean;
  category: 'PASSPORT' | 'VISA' | 'VEHICLE' | 'CHILDREN' | 'CUSTOMS' | 'CURRENCY';
}

export interface IBorderChecklist {
  id: string;
  fromCountry: CountryCode;
  toCountry: CountryCode;
  title: string;
  description: string;
  version: string;
  items: IChecklistItem[];
  lastVerifiedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
