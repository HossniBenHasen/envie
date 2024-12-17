import { PlusIcon, QrCodeIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {
  Button,
  Card,
  CardBody,
  Input,
  Option,
  Select
} from '@material-tailwind/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast, { Toast } from 'react-hot-toast';
import DeleteModal from '../../../components/DeleteModal';
import HeaderNav from '../../../components/HeaderNav';
import PieceHistoryModal from '../../../components/PieceHistory/PieceHistoryModal';
import AddPreparationModal from '../../../components/Preparation/AddPreparationModal';
import QrModal from '../../../components/Qrcode/QrModal';
import ReplacementPieceUpdateModal from '../../../components/Replacement_piece/ReplacementPieceUpdateModal';
import { UserRole } from '../../../enums/UserRole';
import { Preparation } from '../../../models/Preparation/Preparation';
import { ReplacementPiece } from '../../../models/Replacement_piece/ReplacementPiece';
import { Storage } from '../../../models/Storage/Storage';
import * as ReplacementPieceService from "../../../services/ReplacementPieceService";


const PieceList = () => {
  const { data: session, status } = useSession();
  const tableaHeaderElement = useRef<HTMLTableRowElement>(null);
  const [replacementsPieces, setReplacementsPieces] = useState<ReplacementPiece[]>([]);
  const [storages, setStorages] = useState<Storage[]>([]);
  const [company, setCompany] = useState<Storage[]>([]);
  const [qrData, setQrData] = useState('');
  const [qrDataText, setQrDataText] = useState<string>('');
  const [openQrModal, setOpenQrModal] = useState(false);
  const [inputRechercheValue, setInputRechercheValue] = useState<string>('');
  const [selectStorageRechercheValue, setSelectStorageRechercheValue] = useState<string>('');
  const [selectCompanyRechercheValue, setSelectCompanyRechercheValue] = useState<string>('');
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [replacementPieceToUpdate, setReplacementPieceToUpdate] = useState<any>();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [replacementPieceIdToDelete, setReplacementPieceIdToDelete] = useState<number>();
  const [isOpenPieceHistoryModal, setIsOpenPieceHistoryModal] = useState<boolean>(false);
  const [replacementPieceId, setReplacementPieceId] = useState<number>();
  const [isOpenAddPreparationModal, setIsOpenAddPreparationModal] = useState<boolean>(false);
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [selectedPreparation, setSelectedPreparation] = useState<Preparation>();

  const handleQrModal = (data: string, text: string) => {
    setQrData(data);
    setOpenQrModal(true);
    setQrDataText(text)
  };

  const handleChangeRecherche = (e: ChangeEvent<HTMLInputElement>) => {
    setInputRechercheValue(e.target.value);
  };

  const handleChangeStorageRecherche = (e: any) => {
    setSelectStorageRechercheValue(e);
  };

  const filterStoragePiece = (piece: ReplacementPiece) => {
    // Si un lieu de stockage est sélectionné, on affiche uniquement les pièces de ce lieu de stockage
    if (selectStorageRechercheValue !== '') {
      if (
        piece.storageLocation &&
        piece.storageLocation.storage.id === selectStorageRechercheValue
      )
        return true;

      return false;
    }

    return true;
  };

  const handleChangeCompanyRecherche = (e: any) => {
    setSelectCompanyRechercheValue(e);
  };

  const filterCompanyPiece = (piece: ReplacementPiece) => {
    // Si un entreprise est sélectionné, on affiche uniquement les pièces de cette entreprise.
    if (selectCompanyRechercheValue !== '') {
      if (
        piece.storageLocation &&
        piece.storageLocation.storage &&
        piece.storageLocation.storage.company &&
        piece.storageLocation.storage.company.id === parseInt(selectCompanyRechercheValue)
      )
        return true;

      return false;
    }

    return true;
  };

  const filterRecherchePiece = (piece: ReplacementPiece) => {
    // Si la valeur de recherche est vide, on affiche tout
    if (inputRechercheValue === '') return true;

    // Si la valeur de recherche est présente dans la référence, on affiche
    if (
      piece.manufacturerReferenceOfPiece
        .toLowerCase()
        .includes(inputRechercheValue.toLowerCase())
    )
      return true;

    // Si la valeur de recherche est présente dans le numéro de série, on affiche
    if (
      piece.serialNumber
        .toLowerCase()
        .includes(inputRechercheValue.toLowerCase())
    )
      return true;

    // Si la valeur de recherche est présente dans la désignation, on affiche
    if (
      piece.designationInterne
        .toLowerCase()
        .includes(inputRechercheValue.toLowerCase())
    )
      return true;

    // Si la valeur de recherche est présente dans l'état, on affiche
    if (piece.state.toLowerCase().includes(inputRechercheValue.toLowerCase()))
      return true;

    // Si la valeur de recherche est présente dans la famille, on affiche
    if (
      piece.family &&
      piece.family.familyName
        .toLowerCase()
        .includes(inputRechercheValue.toLowerCase())
    )
      return true;

    // Si la valeur de recherche est présente dans la marque, on affiche
    if (
      piece.brand &&
      piece.brand.brandName
        .toLowerCase()
        .includes(inputRechercheValue.toLowerCase())
    )
      return true;

    return false;
  };


  const openUpdateModal = (ReplacementPiece: ReplacementPiece) => {
    setReplacementPieceToUpdate(ReplacementPiece);
    toggleUpdateModal();
  };

  const handleCloseUpdateModal = (
    updatedReplacementPiece?: ReplacementPiece
  ) => {
    if (updatedReplacementPiece) {
      setReplacementsPieces((current) =>
        current.map((c) =>
          c.id === updatedReplacementPiece.id ? updatedReplacementPiece : c
        )
      );
    }
    toggleUpdateModal();
  };

  const toggleUpdateModal = () => {
    setIsOpenUpdateModal(!isOpenUpdateModal);
  };


  const openPieceHistoryModal = (ReplacementPieceId?: number, Reference?: string) => {
    setReplacementPieceId(ReplacementPieceId);
    togglePieceHistoryModal();
  };

  const handleClosePieceHistoryModal = () => {
    setReplacementPieceId(undefined);
    togglePieceHistoryModal();
  };

  const togglePieceHistoryModal = () => {
    setIsOpenPieceHistoryModal(!isOpenPieceHistoryModal);
  };


  const deleteReplacementPiece = (id?: number) => {
    axios
      .delete<any>(process.env.API_URL + 'brands/' + id)
      .then((response) => {
        if (response.status == 200) {
          setReplacementsPieces((current) =>
            current.filter((c) => c.id !== id)
          );
          toast.success('La marque a bien été supprimé');
        }
      })
      .catch(() => {
        toast.error(
          'Une erreur est survenue lors de la suppression de la marque'
        );
      })
      .finally(toggleDeleteModal);
  };

  const handleCloseDeleteModal = () => {
    setReplacementPieceIdToDelete(undefined);
    toggleDeleteModal();
  };

  const toggleDeleteModal = () => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
  };

  const setTTC = (replacementPiece: ReplacementPiece) => {
    var priceTTC = 0;
    var priceTTCRound = 0;
    if (replacementPiece.storageLocation?.storage.company.vatRate != null) {
      priceTTC = replacementPiece.excludingTaxesPrice * (1 + replacementPiece.storageLocation?.storage.company.vatRate / 100);
      priceTTCRound = Math.round(priceTTC * 100) / 100;
    }
    return priceTTCRound;
  };


  const addToCart = (replacementPiece: ReplacementPiece) => {
    const data = {
      userId: session?.token.id,
      replacementPiecesId: [replacementPiece.id]
    };

    axios
      .patch(process.env.API_URL + 'preparation/' + selectedPreparation?.id, data)
      .then((data) => {
        toast.success(
          (t: Toast) => (
            <div className="flex items-center gap-4">
              <span>Votre article a été ajouté !</span>
              <section className="flex gap-2 text-white">
                <Link href={"/Summary"}>
                  <Button color="teal">
                    Voir les préparations
                  </Button>
                </Link>
                <Button
                  color="teal"
                  onClick={() => toast.dismiss(t.id)}
                >
                  <XMarkIcon className="w-5" />
                </Button>
              </section>
            </div>
          )
        );
      })
      .catch((error) => {
        toast.error('Une erreur est survenue');
      });
  }

  const toggleAddPreparationModal = () => {
    setIsOpenAddPreparationModal(!isOpenAddPreparationModal);
  };

  const openAddPreparationModal = () => {
    toggleAddPreparationModal();
  }

  const handleCloseAddPreparationModal = (preparation?: Preparation) => {
    if (preparation) {
      setPreparations((current) => [...current, preparation]);
    }
    toggleAddPreparationModal();
  }


  useEffect(() => {
    //ReplacementPieceService.getReplacementPiecesLinkedToStorageLocation().then(response => { //TODO : les pièces non stockés devraient apparaître aussi (il faudrait un filtre)
    ReplacementPieceService.getReplacementPieces().then(response => {
      setReplacementsPieces(response.data);
    });
    axios.get(process.env.API_URL + 'storages').then((response) => {
      setStorages(response.data);
    });
    axios.get(process.env.API_URL + 'companies').then((response) => {
      setCompany(response.data);
    });
  }, []);

  useEffect(() => {
    if (session) {
      axios.get(process.env.API_URL + 'preparation/user/' + session?.token.id).then((response) => {
        setPreparations(response.data);
      });
    }
  }, [session])

  return (
    <>

      <ReplacementPieceUpdateModal
        replacementPiece={replacementPieceToUpdate}
        open={isOpenUpdateModal}
        onClose={handleCloseUpdateModal}
      />

      <PieceHistoryModal
        replacementPieceId={replacementPieceId}
        open={isOpenPieceHistoryModal}
        onClose={handleClosePieceHistoryModal}
      />

      <DeleteModal
        open={isOpenDeleteModal}
        onClose={handleCloseDeleteModal}
        onDelete={() => deleteReplacementPiece(replacementPieceIdToDelete)}
      />

      <AddPreparationModal
        open={isOpenAddPreparationModal}
        onClose={handleCloseAddPreparationModal}
      />

      <div className="bg-background h-screen pt-5">
        <QrModal
          data={qrData}
          showModal={openQrModal}
          setShowModal={setOpenQrModal}
          text={qrDataText}
        />
        <HeaderNav />
        {/*<div className="flex gap-2 w-3/4 mx-auto mb-1 bg-white p-2 rounded-lg">
          <div className="w-1/4">
            <Input
              label="Rechercher une pièce"
              type="text"
              variant="outlined"
              onChange={handleChangeRecherche}
            />
          </div>
          <div className="w-2/8">
            <Select
              label="Lieu de stockage"
              variant="outlined"
              onChange={handleChangeStorageRecherche}
            >
              {storages.map((storage, index) => {
                return (
                  <Option key={storage.id} value={storage.id}>
                    {storage.name}
                  </Option>
                );
              })}
            </Select>
          </div>

          <div className="w-2/8">
            <Select
              label="Entreprise"
              variant="outlined"
              onChange={handleChangeCompanyRecherche}
            >
              {company.map((company, index) => {
                return (
                  <Option key={company.id} value={company.id.toString()}>
                    {company.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>*/}
        <table className="table w-3/4 mx-auto mt-2 p-2 bg-white shadow text-center text-gray-900 rounded-none divide-y-2">
          <thead>
            <tr ref={tableaHeaderElement}>
              <th className="p-2">ID</th>
              <th className="p-2">Reférence</th>
              <th className="p-2">N° de serie</th>
              <th className="p-2">Désignation Interne</th>
              <th className="p-2">Désignation Fournisseur</th>
              <th className="p-2">Etat</th>
              <th className="p-2">Poids (kg)</th>
              <th className="p-2">Famille</th>
              <th className="p-2">Marque</th>
              <th className="p-2">Entreprise</th>
              <th className="p-2">Prix (€)</th>
              <th className="p-2">Prix TTC (€)</th>
              {session &&
                status === "authenticated" &&
                session.token.role !== UserRole.USER && (
                  <>
                    <th className="p-2">QR</th>
                    <th className="p-2">Modifier</th>
                    {selectedPreparation && (
                      <th className="p-2">Panier</th>
                    )}
                  </>
                )}
            </tr>
          </thead>
          <tbody className="divide-y-2">
            {replacementsPieces
              .filter(filterStoragePiece)
              .filter(filterCompanyPiece)
              .filter(filterRecherchePiece)
              .map((replacementPiece) => (
                <tr key={replacementPiece.id} className="hover:bg-gray-100 hover:cursor-pointer" id="row" onClick={(event) => {
                  if (event.currentTarget.id === 'row') {
                    openPieceHistoryModal(replacementPiece.id)
                  }
                  event.stopPropagation()
                }} >
                  <td className="p-2"> {replacementPiece.id}</td>
                  <td className="p-2">
                    {replacementPiece.manufacturerReferenceOfPiece}
                  </td>
                  <td className="p-2">{replacementPiece.serialNumber}</td>
                  <td className="p-2">{replacementPiece.designationInterne}</td>
                  <td className="p-2">{replacementPiece.designationFournisseur}</td>
                  <td className="p-2">{replacementPiece.state}</td>
                  <td className="p-2">{replacementPiece.weight}</td>
                  <td className="p-2">
                    {replacementPiece.subfamily &&
                      replacementPiece.subfamily.family
                      ? replacementPiece.subfamily.family.familyName
                      : ''}
                  </td>
                  <td className="p-2">
                    {replacementPiece.brand
                      ? replacementPiece.brand.brandName
                      : ''}
                  </td>

                  <td className="p-2">
                    {replacementPiece.storageLocation
                      ? replacementPiece.storageLocation.storage.company.name
                      : ''}
                  </td>
                  <td className="p-2">{replacementPiece.excludingTaxesPrice}</td>
                  <td className="p-2">{setTTC(replacementPiece)}</td>

                  {session &&
                  status === "authenticated" &&
                  session.token.role !== UserRole.USER && (
                    <>
                      <td className="p-2">
                        <Button
                          color="teal"
                          id="QrM"
                          onClick={(event) => {
                            if (event.currentTarget.id === 'QrM') {
                              const qrData = replacementPiece.id.toString() + " " +replacementPiece.designationInterne.toString();
                              handleQrModal(qrData, qrData);
                            }
                            event.stopPropagation()
                          }}
                        >
                          <QrCodeIcon className="w-5 h-5" />
                        </Button>
                      </td>
                      <td className="p-2">
                        <Button
                          id="upDM"
                          onClick={(event) => {
                            if (event.currentTarget.id === 'upDM') {
                              openUpdateModal(replacementPiece)
                            }
                            event.stopPropagation()
                          }}
                          color="teal"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}

            {!replacementsPieces
              .filter(filterStoragePiece)
              .filter(filterCompanyPiece)
              .filter(filterRecherchePiece).length && (
                <tr>
                  <td colSpan={tableaHeaderElement.current?.childNodes.length} className="p-2">
                    Aucune pièce trouvée
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </>

  );
};


export default PieceList;
