import { Storage } from "../Storage/Storage";

export interface FormPrintStorageLocation {
  storage: Storage | undefined;
  row: number | undefined;
  column: number | undefined;
  shelf: number | undefined;
  location: number | undefined;
  uid: number;

}