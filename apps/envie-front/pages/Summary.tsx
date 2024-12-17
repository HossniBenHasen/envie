import {
  Button,
  Card,
  CardBody,
  Typography
} from '@material-tailwind/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DeleteModal from '../components/DeleteModal';
import HeaderNav from '../components/HeaderNav';
import PreparationModal from '../components/Preparation/PreparationModal';
import { PreparationStatut } from '../enums/PreparationStatut';
import { Preparation } from '../models/Preparation/Preparation';

const Summary = () => {
  const [preparations, setPreparations] = useState<any[]>([]);
  const [preparation, setPreparation] = useState<any>();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [preparationIdToDelete, setPreparationIdToDelete] = useState<string>();
  const [isOpenPreparationModal, setIsOpenPreparationModal] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const openPreparationModal = (Preparation: any) => {
    setPreparation(Preparation);
    togglePreparationModal();
  }
  
  const handleClosePreparationModal = () => {
    setPreparation(undefined);
    togglePreparationModal();
  };

  const togglePreparationModal = () => {
    setIsOpenPreparationModal(!isOpenPreparationModal);
  };
  
  const openDeleteModal = (id: string) => {
    setPreparationIdToDelete(id);
    toggleDeleteModal();
  };
  
  const handleCloseDeleteModal = () => {
    setPreparationIdToDelete(undefined);
    toggleDeleteModal();
  };
  
  const handleDeletePiece = (preparationId: number | undefined, id: number | undefined) => {
    if (preparationId && id) {
      setPreparations((current) => {
        const preparationIndex = current.findIndex(item => item.id == preparationId);
        current[preparationIndex].replacementPieces = current[preparationIndex].replacementPieces.filter((piece: any) => piece.id != id);
        return current
      })
    }
  }
  
  const toggleDeleteModal = () => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
  };
  
  
  const deletePreparation = (id?: string) => {
    axios
    .delete<any>(process.env.API_URL + 'preparation/' + id)
    .then((response) => {
      if (response.status == 200) {
        setPreparations((current) => current.filter((c) => c.id !== id));
        toast.success('Le bon de préparation a bien été supprimé');
      }      
    })
    .catch(() => {
        toast.error("Une erreur est survenue lors de la suppression");
      })
      .finally(toggleDeleteModal);
    };
    
    const finishPreparation = (preparation: Preparation) => {
      const body = {
        statut: PreparationStatut.FINISHED,
        replacementPiecesId: []
      }
      axios.patch(process.env.API_URL + 'preparation/' + preparation.id, body).then((response) => {
        if (response.status == 200) {
          toast.success("La préparation a bien été modifiée");
        }
      }, (error) => {
        toast.error("Une erreur est survenue lors de la modification de la préparation");
      });
    }
    
    const translateToFrench = (status: String) => {
      var frenchStatus;
      if (status === "finished") {
        frenchStatus = "Terminé"
      } else if (status === "in_progress") {
        frenchStatus = "En cours"
      }
      return frenchStatus;
    }

    useEffect(() => {
      if (session) {
        axios.get(process.env.API_URL + 'preparation/user/' + session?.token.id).then((response) => {
          setPreparations(response.data);
        });
      }
    }, [session]);
    
    return (
      <>
      <DeleteModal open={isOpenDeleteModal} onClose={handleCloseDeleteModal} onDelete={() => deletePreparation(preparationIdToDelete)} />

      <PreparationModal
          preparation={preparation}
          open={isOpenPreparationModal}
          onClose={handleClosePreparationModal}
          onDelete={handleDeletePiece}
        />
      <HeaderNav />
      <div className="flex grid-cols-3 justify-center gap-6 mt-15 center "   >
        <Card className="w-150 h-25">
          <CardBody className="text-center">
            <Typography variant="h4" className="">
              Bons de préparation
            </Typography>
          </CardBody>
        </Card>
      </div>
      <section className="mt-5">
        <table className="table w-1/3 mx-auto mt-5 p-4 bg-white shadow text-center text-gray-900 rounded-lg divide-y-2">
          <thead>
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Date de création</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ouvrir</th>
              <th className="p-4">Terminer</th>
              <th className="p-4">Supprimer</th>
            </tr>
          </thead>
          <tbody className="divide-y-2">
            {preparations.map((preparation) => (
              <tr key={preparation.id}>
                <td className="p-4">{preparation.id}</td>
                <td className="p-4">{new Date(preparation.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{translateToFrench(preparation.statut)}</td>
                <td className="p-4">
                  <Button
                    onClick={() => openPreparationModal(preparation)}
                    color="teal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </Button>
                </td>
               
                <td className="p-4">
                  <Button
                    onClick={() => finishPreparation(preparation)}
                    color="teal"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor" 
                      className="w-6 h-6"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" 
                      />
                    </svg>

                  </Button>
                </td>
                           
                <td className="p-4">
                  <Button
                    onClick={() => openDeleteModal(preparation.id)}
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
      </section>
    </>
  );
}
export default Summary;