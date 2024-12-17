import axios from "axios";
import { FormPrintStorageLocation } from "../models/StorageLocation/FormPrintStorageLocation";

export const getAllStorageLocationToPrint = (data: FormPrintStorageLocation) => {
  return axios.get(process.env.API_URL + "storage-locations/print", {
    params: {
      storage: data.storage?.id,
      rowNumber: data.row,
      columnNumber: data.column,
      shelfNumber: data.shelf,
      locationNumber: data.location,
      uid: data.uid,
    }
  });
}