import { Storage } from "../Storage/Storage";

export interface StorageLocation {
  id: string;
  storage: Storage;
  rowNumber: number;
  columnNumber: number;
  shelfNumber: number;
  locationNumber: number;
}