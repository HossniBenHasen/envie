import axios from "axios"
import { UpdateBrand } from "../models/Brand/UpdateBrand"

export const updateBrand = (id: string, data: UpdateBrand) => {
  return axios.patch(process.env.API_URL + "brands/" + id, data);
}