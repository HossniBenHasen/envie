import { Company } from "../Company/Company";

export interface Storage {
  id: string;
  name: string;
  internalName: string;
  street: string;
  zipCode: string;
  city: string;
  country: string;
  phoneNumber: string;
  mailAddress: string;
  responsiblePerson: string;
  numberOfRows: number;
  columnPerRow: number;
  shelfPerColumn: number;
  locationPerShelf: number;
  company: Company;
}