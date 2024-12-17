import axios from "axios"
export const showPieceHistoryBrand = (id: string) => {
    return axios.get(process.env.API_URL + "replacements-pieces/" + id);
}

