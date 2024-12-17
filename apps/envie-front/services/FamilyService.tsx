import axios from 'axios';
import { UpdateFamily } from '../models/Family/UpdateFamily';

export const updateFamily = (id: string, data: UpdateFamily) => {
  return axios.patch(process.env.API_URL + 'families/' + id, data);
};