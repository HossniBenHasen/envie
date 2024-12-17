import { QrCodeIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
} from '@material-tailwind/react';
import { InformationCircleIcon,
  CloudArrowUpIcon } from "@heroicons/react/24/solid"
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import toast, { Toast } from 'react-hot-toast';
import HeaderNav from '../../components/HeaderNav';
import { Family } from '../../models/Family/Family';
import QrModal from '../../components/Qrcode/QrModal';
import { Brand } from '../../models/Brand/Brand';
import { User} from "../../models/User/User";
import { SubFamily } from '../../models/SubFamily/SubFamily';
import { useSession } from 'next-auth/react';
import {ReplacementPiece} from "../../models/Replacement_piece/ReplacementPiece";
import AddModal from "../../components/Add/AddModal";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";
import addModal from "../../components/Add/AddModal";

interface PostData {
  brandId: string;
  comments: string;
  state: string;
  subfamilyId: string;
  familyId: string;
  excludingTaxesPrice?: number;
  indicativePriceOfNewPiece?: number;
  manufacturerReferenceOfPiece: string;
  designationInterne: string;
  designationFournisseur: string;
  model: string;
  technicalReferenceDevice: string;
  serialNumber: string;
  userId: string;
  weight?: number;
  supplier: string;
  companyId?: number;
}

const Products = () => {
  const {
    register,
    resetField,
    setFocus,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PostData>({ mode: 'onChange', reValidateMode: 'onChange' });

  const [familyType, setFamilyType] = useState<string>('');
  const [subfamilyType, setSubfamilyType] = useState<string>('');
  const [brandType, setBrandType] = useState<string>('');
  const [userType, setUserType] = useState<string>('');
  const [wearType, setWearType] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [qrData, setQrData] = useState<string>('');
  const [openQrModal, setOpenQrModal] = useState<boolean>(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [subfamilies, setSubfamilies] = useState<SubFamily[]>([]);
  const { data: session, status } = useSession();
  const [priceTTC, setPriceTTC] = useState<number>();
  const tableHeaderElement = useRef<HTMLTableRowElement>(null);
  const [replacementsPieces, setReplacementsPieces] = useState<PostData[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [addModalData, setAddModalData] = useState<any>([]);
  const [selected, setSelected] = useState('0');

  const suppliersList = ['ASWO', 'AGORA'];
  const wearList = ['Neuf', 'Occasion'];

  const selectFamily =  (e: any) => {
    setFamilyType(e);
    axios.get(process.env.API_URL + 'families/' + e.value).then((response) => {
      setSubfamilies(response.data.subfamilies);
    });
  };

  const selectSubfamily = (e: any) => {
    setSubfamilyType(e);
  };

  const selectBrand = (e: any) => {
    setBrandType(e);
  };

  const selectUser = (e: any) => {
    setUserType(e);
  }

  const selectWear = (e: any) => {
    setWearType(e);
  };

  const selectSupplier = (e: any) => {
    setSupplier(e);
  };

  const handleQrModal = (data: string) => {
    setQrData(data);
    setOpenQrModal(true);
  };

  const openAddModal = (data: PostData) => {
    setAddModalData(data);
    toggleAddModal();
  };

  const handleCloseAddModal = (data: PostData) => {
    setAddModalData(undefined);
    toggleAddModal();
    window.location.reload();
  };

  const toggleAddModal = () => {
    setIsOpenAddModal(!isOpenAddModal);
  };

  // delete a replacementPiece in the list
  const handleDeletePieceInList = (replacementPiece) => {
    const updatedReplacements = replacementsPieces.filter(
        (piece) => piece !== replacementPiece
    );
    setReplacementsPieces(updatedReplacements);
  };

  const onSubmit = (data: PostData) => {
    // @ts-ignore
    data.brandId = brandType['value'];
    // @ts-ignore
    data.familyId = familyType['value']
    // @ts-ignore
    data.subfamilyId = subfamilyType['value']
    // @ts-ignore
    data.state = wearType['value']
    // @ts-ignore
    data.supplier = supplier['value']
    // @ts-ignore
    data.userId = userType['value']
    if (session?.token.company) {
      data.companyId = session.token.company.id;
    }
    setPriceTTC(undefined);
    setReplacementsPieces(prevArray => [...prevArray, data]);
    resetField('designationInterne');
    resetField('designationFournisseur');
    resetField('weight');
    resetField('excludingTaxesPrice');
    resetField('indicativePriceOfNewPiece');
    resetField('comments');
    resetField('manufacturerReferenceOfPiece');
    resetField('familyType');
    resetField('subfamilyType');
    resetField('brandType');
    resetField('userType');
    resetField('wearType');
    resetField('supplier');
    resetField('qrData');
    resetField('priceTTC');
    resetField('replacementsPieces');
  };

  useEffect(() =>{
    // Récupération des marques
    axios.get(process.env.API_URL + 'brands').then((response) => {
      setBrands(response.data);
    });

    // Récupération des utilisateurs
    axios.get(process.env.API_URL + 'users/operator').then((response) => {
      setUsers(response.data);
    });

    // Récupération des familles
    axios.get(process.env.API_URL + 'families/activity-type/1').then((response) => {
      setFamilies(response.data);
    });
  }, []);


  // met à jour le prix TTC
  const handleFormChange =(e: any) => {
    var pTTC = 0;
    var priceTTCRound = 0;
    if(session?.token.company.vatRate != null){
      pTTC = e.target.value * (1 + session?.token.company.vatRate  / 100);
      priceTTCRound = Math.round(pTTC * 100) / 100;
    }
    setPriceTTC(priceTTCRound);
  };

  return (
      <>
        <HeaderNav />

        <QrModal
            data={qrData}
            showModal={openQrModal}
            setShowModal={setOpenQrModal}
            text={qrData}
        ></QrModal>

        <AddModal
            data={addModalData}
            open={isOpenAddModal}
            onClose={handleCloseAddModal}
        />


        {/* PARTIE SUPÉRIEURE DU FORMULAIRE - AJOUT DES INFOS DE LA MACHINE */}
        <div className="mx-auto max-w-screen-xl mr-50 ml-50 mt-10 mb-5">
          <Card className="w-9/12 mx-auto rounded-none">
            <CardBody className="text-center">
              <Typography variant="h2" className="text-background mb-5 ">
                Ajout pièce électroménager
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} id="form">
                <div className="grid grid-cols-2 gap-5 mb-5">

                  <div className="w-full col-span-2">
                    <Select
                        name="selectUser"
                        {...register('userId')}
                        options={users.map((user) => ({
                          value: user.id,
                          label: user.username,
                        }))}
                        onChange={selectUser}
                        placeholder={'Sélectionner l\'opérateur ayant demonté les pieces'}
                        isClearable={true}
                        required
                    />
                    <Typography color="gray-500" className="flex items-center gap-1 font-normal mt-1 text-xs">
                      <InformationCircleIcon className="w-4 h-4 -mt-px" />
                      Veuillez renseigner l'operateur ayant demonté les pieces.
                    </Typography>
                  </div>

                  <div className="col-span-2">
                    <p className="text-black-500 text-s italic">
                      Renseignez ci-dessous le détail de la machine donneuse
                    </p>
                  </div>

                  <div className="w-full">
                    <Select
                        name="selectBrand"
                        {...register('brandId')}
                        options={brands.map((brand) => ({ value: brand.id, label: brand.brandName }))}
                        onChange={selectBrand}
                        placeholder={'Sélectionner la marque de la machine'}
                        isClearable={true}
                        required
                    />
                  </div>

                  <div className="w-full">
                    <Input
                        label="Modèle (cf.Commerciale)"
                        variant="outlined"
                        type="text"
                        {...register('model', {
                          required: true,
                          minLength: 3,
                          maxLength: 20,
                        })}
                    />
                    {errors.model &&
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.model?.type
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner un modèle valide entre 3 et 20
                              caractères
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Input
                        label="Référence technique de l'appareil"
                        variant="outlined"
                        type="text"
                        {...register('technicalReferenceDevice', {
                          required: true,
                          minLength: 3,
                          maxLength: 20,
                        })}
                    />
                    {errors.technicalReferenceDevice &&
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.technicalReferenceDevice?.type
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner une référence technique
                              d&apos;appareil valide entre 3 et 20 caractères
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Input
                        label="N° de série"
                        variant="outlined"
                        type="text"
                        {...register('serialNumber', {
                          required: true,
                          minLength: 3,
                          maxLength: 30,
                        })}
                    />
                    {errors.serialNumber &&
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.serialNumber?.type
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner un numéro de série valide entre 3 et
                              30 caractères
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Select
                        name="selectFamily"
                        {...register('familyId')}
                        options={families.map((family) => ({ value: family.id, label: family.familyName }))}
                        onChange={selectFamily}
                        placeholder={'Sélectionner la famille de produit'}
                        required
                    />
                    {errors.familyId &&
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.familyId?.type
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner une famille d&apos;appareils valide
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Select
                        name="selectSubFamily"
                        {...register('subfamilyId')}
                        options={subfamilies.map((subfamily) => ({ value: subfamily.id, label: subfamily.subfamilyName }))}
                        onChange={selectSubfamily}
                        placeholder={'Sélectionner la sous-famille de produit'}
                        isClearable={true}
                        required
                    />
                    {errors.subfamilyId &&
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.subfamilyId?.type
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner une sous-famille d&apos;appareils
                              valide
                            </p>
                        )}
                  </div>

                  {/* PARTIE INFÉRIEURE DU FORMULAIRE - AJOUT DES PIÈCES */}
                  <div className="col-span-2">
                    <p className="text-black-500 text-s italic">
                      Renseignez ci-dessous le détail de la piece detachée a ajouter
                    </p>
                  </div>

                  <div className="w-full">
                    <Input
                        label="Désignation interne"
                        variant="outlined"
                        type="text"
                        {...register('designationInterne', {
                          required: true,
                          minLength: 3,
                          maxLength: 30,
                        })}
                    />
                    {errors.designationInterne && //changer 'designation' avec le nouveau champ de la bdd
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.designationInterne?.type //changer 'designation' avec le nouveau champ de la bdd
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner une désignation valide entre 3 et 30
                              caractères
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Input
                        label="Désignation fournisseur"
                        variant="outlined"
                        type="text"
                        {...register('designationFournisseur', {
                          required: true,
                          minLength: 3,
                          maxLength: 30,
                        })}
                    />
                    {errors.designationFournisseur && //changer 'designation' avec le nouveau champ de la bdd
                        ['required', 'maxLength', 'minLength'].includes(
                            errors.designationFournisseur?.type //changer 'designation' avec le nouveau champ de la bdd
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner une désignation valide entre 3 et 30
                              caractères
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Select
                        name="selectSupplier"
                        {...register('supplier')}
                        options={suppliersList.map((supplier) => ({ value: supplier, label: supplier}))}
                        onChange={selectSupplier}
                        placeholder={'Sélectionner le fournisseur'}
                        isClearable={true}
                        required
                    />
                  </div>

                  <div className="w-full">
                    <Input
                        label="Référence fournisseur de la pièce"
                        variant="outlined"
                        type="text"
                        {...register('manufacturerReferenceOfPiece', {
                          required: true,
                          minLength: 3,
                          maxLength: 20,
                        })}
                    />
                    {errors.manufacturerReferenceOfPiece &&
                        (errors.manufacturerReferenceOfPiece.type === 'maxLength' ||
                            errors.manufacturerReferenceOfPiece.type ===
                            'minLength') && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner une référence constructeur valide
                              entre 3 et 20 caractères
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Select
                        name="selectState"
                        {...register('supplier')}
                        options={wearList.map((wear) => ({ value: wear, label: wear}))}
                        onChange={selectWear}
                        placeholder={'Sélectionner l\'état de la pièce'}
                        isClearable={true}
                        required
                    />
                  </div>

                  <div className="w-full">
                    <Input
                        label="Poids"
                        variant="outlined"
                        type="number"
                        {...register('weight', {
                          valueAsNumber: true,
                          min: 0,
                          max: 1000,
                        })}
                    />
                    <Typography color="gray-500" className="flex items-center gap-1 font-normal mt-1 text-xs">
                      <InformationCircleIcon className="w-4 h-4 -mt-px" />
                      Champ facultatif.
                    </Typography>
                    {errors.weight &&
                        ['max', 'min'].includes(errors.weight?.type) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner un poids valide entre 0 et 1000 kg
                            </p>
                        )}
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-5 mb-5">
                  <div className="w-full">
                    <Input
                        label="Prix HT"
                        variant="outlined"
                        type="number"
                        {...register('excludingTaxesPrice', {
                          valueAsNumber: true,
                          min: 0,
                          max: 1000,
                        })}
                        onChange={event => handleFormChange(event)}
                    />
                    <Typography color="gray-500" className="flex items-center gap-1 font-normal mt-1 text-xs">
                      <InformationCircleIcon className="w-4 h-4 -mt-px text-neutral-500" />
                      Champ facultatif.
                    </Typography>
                    {errors.excludingTaxesPrice &&
                        ['max', 'min'].includes(errors.excludingTaxesPrice?.type) && (
                            <p className="text-red-500 text-xs italic">
                              Veuillez renseigner un prix valide entre 0 et 1000 €
                            </p>
                        )}
                  </div>

                  <div className="w-full">
                    <Input
                        label="Prix TTC"
                        variant="outlined"
                        type="number"
                        disabled
                        value={priceTTC}
                    />
                    <Typography color="gray-500" className="flex items-center gap-1 font-normal mt-1 text-xs">
                      <InformationCircleIcon className="w-4 h-4 -mt-px" />
                      Champ rempli automatiquement.
                    </Typography>
                  </div>

                  <div className="w-full">
                    <Input
                        label="Prix indicatif de la pièce neuve"
                        variant="outlined"
                        type="number"
                        {...register('indicativePriceOfNewPiece', {
                          valueAsNumber: true,
                          min: 1,
                          max: 1000,
                        })}
                    />
                    <Typography color="gray-500" className="flex items-center gap-1 font-normal mt-1 text-xs">
                      <InformationCircleIcon className="w-4 h-4 -mt-px" />
                      Champ facultatif.
                    </Typography>
                    {errors.indicativePriceOfNewPiece &&
                        ['max', 'min'].includes(
                            errors.indicativePriceOfNewPiece?.type
                        ) && (
                            <p className="text-red-500 text-xs italic">
                              Le prix indicatif de la pièce neuve doit être compris
                              entre 1 et 1000
                            </p>
                        )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="w-full col-span-2">
                    <Input
                        label="Infomations supplementaires, commentaires"
                        variant="outlined"
                        type="text"
                        {...register('comments')}
                    />
                    <Typography color="gray-500" className="flex items-center gap-1 font-normal mt-1 text-xs">
                      <InformationCircleIcon className="w-4 h-4 -mt-px" />
                      Champ facultatif.
                    </Typography>
                  </div>

                  <div className="col-span-2">
                    <Button
                        color="teal"
                        fullWidth
                        type="submit"
                        size="md"
                        disabled={!isValid}
                    >
                      Ajouter une pièce au stock
                    </Button>

                  </div>
                </div>
              </form>

              <div className="col-span-2 mx-auto">
                <table className="table mx-auto mt-2 mb-2 text-center text-gray-900">
                  <thead>
                  <tr ref={tableHeaderElement}>
                    <th className="p-2">Désignation interne</th>
                    <th className="p-2">Désignation fournisseur</th>
                    <th className="p-2">Fournisseur</th>
                    <th className="p-2">Référence fournisseur</th>
                    <th className="p-2">Etat</th>
                    <th className="p-2">Numéro de Série</th>
                    <th className="p-2"></th> {/* New column for delete button */}
                  </tr>
                  </thead>
                  <tbody className="divide-y-2">
                  {replacementsPieces
                      .map((replacementPiece) => (
                          <tr className="hover:bg-gray-100 hover:cursor-pointer" id="row" >
                            <td className="p-2"> {replacementPiece.designationInterne} </td>
                            <td className="p-2"> {replacementPiece.designationFournisseur} </td>
                            <td className="p-2"> {replacementPiece.supplier} </td>
                            <td className="p-2"> {replacementPiece.manufacturerReferenceOfPiece} </td>
                            <td className="p-2"> {replacementPiece.state} </td>
                            <td className="p-2"> {replacementPiece.serialNumber} </td>
                            <td className="p-2">
                              <button  style={{fontWeight:'bold'}} onClick={() => handleDeletePieceInList(replacementPiece)}>
                                Supprimer
                              </button>
                            </td>
                          </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="col-span-2 mx-auto">
                <Button
                    color="teal"
                    size="md"
                    type="submit"
                    className="col-span-2 w-full flex items-center gap-3 justify-center"
                    onClick={(event) => {
                      if (selected == '0') {
                        setSelected('1');
                      } else if (selected == '1') {
                        setSelected('0');
                      }
                      event.stopPropagation();
                      axios
                          .post(process.env.API_URL + 'replacements-pieces/many', replacementsPieces)
                          .then((res) => {
                            setAddModalData(prevArray => [...prevArray ,res.data]);
                          })
                          .catch((error) => {
                            // toast.error(error.response.data.message[0]);
                            console.log(error);
                          });
                      openAddModal(addModalData);

                    }}>
                  Enregistrer les pieces
                  <CloudArrowUpIcon strokeWidth={2} className="h-5 w-5" />
                </Button>
              </div>

            </CardBody>
          </Card>
        </div>

      </>
  );
};

export default Products;
