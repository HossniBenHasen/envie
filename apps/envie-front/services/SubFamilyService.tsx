import axios from "axios";
import { UpdateSubFamily } from "../models/SubFamily/UpdateSubFamily";

export const updateSubFamily = (id: string, data: UpdateSubFamily) => {
    return axios.patch(process.env.API_URL + "subfamilies/" + id, data);
}