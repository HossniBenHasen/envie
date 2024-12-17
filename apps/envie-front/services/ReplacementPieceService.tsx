import axios from "axios"
import { getSession } from "next-auth/react"
import { UpdateReplacementPiece } from "../models/Replacement_piece/UpdateReplacementPiece"

export const getReplacementPieces = async () => {
    const session = await getSession();
    return axios.get(process.env.API_URL + 'replacements-pieces', {
        headers: {
            "Authorization": `Bearer ${session?.token.accessToken}`
        }
    })
}
export const getReplacementPiecesBySerialNumber = (serialNumber: string) => {
    return axios.get(process.env.API_URL + 'replacements-pieces/bySerialNumber/' + serialNumber)
}

export const getReplacementPiecesLinkedToStorageLocation = () => {
    return axios.get(process.env.API_URL + 'replacements-pieces/linked');
}

export const updateReplacementPiece = (id: number, data: UpdateReplacementPiece) => {
    return axios.patch(process.env.API_URL + "replacements-pieces/" + id, data);
}
