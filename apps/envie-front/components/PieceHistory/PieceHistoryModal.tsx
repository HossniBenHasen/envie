import axios from 'axios';
import { useEffect, useState } from 'react';
import {Dialog, DialogBody, DialogHeader,} from "@material-tailwind/react";
import { PieceHistory } from '../../models/PieceHistory/PieceHistory';
import { ActionTravelHistory } from '../../enums/ActionTravelHistory';

interface Props {
  replacementPieceId: number | undefined;
  open: boolean;
  onClose: () => any;
}

 
const PieceHistoryModal = ({ replacementPieceId, open, onClose }: Props) => {

  const [piecesHistoryChanges, setPiecesHistoryChanges] = useState<PieceHistory[]>([]);
  
  useEffect(() => {
    if (replacementPieceId) {
      axios.get(process.env.API_URL + 'travel-history/' + replacementPieceId).then((response) => {
        setPiecesHistoryChanges(response.data);
      });
    }
  }, [replacementPieceId]);
  
  
  const translateToFrench = (status: string) =>{
    if(status === ActionTravelHistory.ADDED_TO_STOCK){
      return "Entrée en stock";
    } else if (status === ActionTravelHistory.AWAITING_PREPARATION){
      return "Réservée en attente de préparation";
    } else if (status === ActionTravelHistory.MOVED_TO_STOCK) {
      return "Déplacement";
    } else if (status === ActionTravelHistory.REMOVE_TO_STOCK){
      return "Sortie du stock";
    }
  }

  
  return (
    <>
      <Dialog size = "lg"  open={open} handler={onClose}>
        <DialogHeader className="justify-center">
          Historique de l'article
        </DialogHeader>
        <DialogBody className="justify-center">
          <table className="table w-3/4 mx-auto mt-2 p-4 bg-white shadow text-center text-gray-900 rounded-lg divide-y-2">
            <thead>
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Date de création</th>
                <th className="p-4">Operateur</th>
                <th className="p-4">Lieu de stockage</th>
                <th className="p-4">Rangé</th>
                <th className="p-4">Colonne</th>
                <th className="p-4">Étagère</th>
                <th className="p-4">Emplacement</th>
              </tr>
            </thead>
            <tbody className="divide-y-2">
              {piecesHistoryChanges.map((pieceHistoryChange) => (
                <tr key={pieceHistoryChange?.id}>
                  <td className="p-4"> {translateToFrench(pieceHistoryChange?.action)} </td>
                  <td className="p-4"> {new Date(pieceHistoryChange?.createdAt).toLocaleDateString()}</td>
                  <td className="p-4"> {pieceHistoryChange?.referringUser}</td>   
                  <td className="p-4"> {pieceHistoryChange?.storageLocation? pieceHistoryChange.storageLocation.storage.name: ''}</td>
                  <td className="p-4"> {pieceHistoryChange?.storageLocation?.rowNumber}</td>
                  <td className="p-4"> {pieceHistoryChange?.storageLocation?.columnNumber} </td>
                  <td className="p-4"> {pieceHistoryChange?.storageLocation?.shelfNumber}</td>
                  <td className="p-4"> {pieceHistoryChange?.storageLocation?.locationNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default PieceHistoryModal;