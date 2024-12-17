import axios from "axios";
import { getSession } from "next-auth/react";
import { UpdateRemplacementBike} from "../models/Remplacement_bike/UpdateRemplacementBike"

export const getRemplacementBikes = async () => {
    const session = await getSession();
    return axios.get(process.env.API_URL + 'bikes', {
       headers : {
         "Auothorization" : `Bearer ${session?.token.accessToken}`
       }
    })
}

export const getBikesLinkedToStorageLocation = () => {
    return axios.get(process.env.API_URL + 'bikes/linked');
}

export const updateBike = (id: number, data:UpdateRemplacementBike ) => {
    return axios.patch(process.env.API_URL + "bikes/" + id, data);
}
