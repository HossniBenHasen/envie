import axios from 'axios';
import { useEffect, useState } from 'react';
import {Dialog, DialogBody, DialogHeader,} from "@material-tailwind/react";
import { QrCodeIcon } from '@heroicons/react/20/solid';
import QrModal from '../../components/Qrcode/QrModal';
import { Button} from '@material-tailwind/react';
import toast from "react-hot-toast";
import DeleteModal from "../../components/DeleteModal";
import { ReplacementPiece } from '../../models/Replacement_piece/ReplacementPiece';


interface Props {
  preparation: any;
  open: boolean;
  onClose: () => any;
  onDelete: (preparationId: number | undefined, replacementPieceId: number | undefined) => any;
}

 
const PreparationModal = ({ preparation, open, onClose, onDelete }: Props) => {

  const [replacementPieces, setReplacementPieces] = useState<ReplacementPiece[]>([]);
  const [qrData, setQrData] = useState('');
  const [qrDataText, setQrDataText] = useState<string>('');
  const [openQrModal, setOpenQrModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [preparationId, setPreparationId] = useState<number>();
  const [preparationIdToDelete, setPreparationIdToDelete] = useState<number>();
  

  useEffect(() => { 
    setReplacementPieces(preparation ?.replacementPieces);
  }, [preparation]);


  const handleQrModal = (data: string, text:string) => {
    setQrData(data);
    setOpenQrModal(true);
    setQrDataText (text)
  };
  
  const openDeleteModal = (id: number) => {
    setPreparationIdToDelete(id);
    setPreparationId(preparation?.id);    
    toggleDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    setPreparationIdToDelete(undefined);
    toggleDeleteModal();
  };

  const toggleDeleteModal = () => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
  };

  const deletePiece = (id?: number) => {
    axios
      .delete<any>(process.env.API_URL + 'preparation/'+ preparationId +'/piece/' + id) 
      .then((response) => {
        if (response.status == 200) {
          onDelete(preparationId, id);
          toast.success('La pièce a bien été supprimé du bon de preparation');
        }
      })
      .catch(() => {
        toast.error("Une erreur est survenue lors de la suppression");
      })
      .finally(toggleDeleteModal);  
  };
 

  return (
    <>
     <DeleteModal open={isOpenDeleteModal} onClose={handleCloseDeleteModal} onDelete={() => deletePiece(preparationIdToDelete)} />
     
     <QrModal
          data={qrData}
          showModal={openQrModal}
          setShowModal={setOpenQrModal}
          text={qrDataText}
      />
      <Dialog  
        id = "clM" 
        size = "lg"   
        open={open}
        handler={() => onClose()} 
       >
      <DialogHeader className="justify-center">
          Bon de préparation
        </DialogHeader>
        <DialogBody className="justify-center">
          <table className="table mx-auto mt-2 p-4 bg-white shadow text-center text-gray-900 rounded-lg divide-y-2">
            <thead>
              <tr>
                <th className="p-4">ID pièce</th>
                <th className="p-4">Désignation</th>
                <th className="p-4">Prix HT</th>
                <th className="p-4">Lieu de stockage</th>
                <th className="p-4">Rangé</th>
                <th className="p-4">Colonne</th>
                <th className="p-4">Étagère</th>
                <th className="p-4">Emplacement</th>
                <th className="p-4">QR</th>
                <th className="p-4">Suprimer</th>
              </tr>
            </thead>
            <tbody className="divide-y-2">
              {replacementPieces?.map((replacementPiece) => (
                <tr key={replacementPiece.id}>
                  <td className="p-4"> {replacementPiece.id} </td>
                  <td className="p-4"> {replacementPiece.designation}</td>
                  <td className="p-4"> {replacementPiece.excludingTaxesPrice}</td>
                  <td className="p-4"> {replacementPiece?.storageLocation?.storage.name}</td>
                  <td className="p-4"> {replacementPiece?.storageLocation?.rowNumber}</td>
                  <td className="p-4"> {replacementPiece?.storageLocation?.columnNumber} </td>
                  <td className="p-4"> {replacementPiece?.storageLocation?.shelfNumber}</td>
                  <td className="p-4"> {replacementPiece?.storageLocation?.locationNumber}</td>   
                  <td className="p-2">
                    <Button
                      color="teal"
                      id = "QrM"
                      onClick={(event) => {
                        if (event.currentTarget.id === 'QrM') {
                          handleQrModal(replacementPiece.id.toString(), replacementPiece.id.toString())
                        }
                        event.stopPropagation()
                      }}
                    >
                      <QrCodeIcon className="w-5 h-5" />
                    </Button>
                  </td>
                  <td className="p-4">
                  <Button
                    onClick={() => openDeleteModal(replacementPiece.id)}
                    color="red"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default PreparationModal