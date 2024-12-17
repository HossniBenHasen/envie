import axios from "axios";

export const getAll = () => {
  return axios.get(process.env.API_URL + "storages");
}