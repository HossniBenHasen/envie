import {
  Button,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import HeaderNav from "../../../../components/HeaderNav";
import QrModal from "../../../../components/Qrcode/QrModal";
import { QrCodeIcon, XMarkIcon } from '@heroicons/react/20/solid';
import toast, { Toast } from 'react-hot-toast';
import { Family } from '../../../../models/Family/Family';
import { SubFamily } from '../../../../models/SubFamily/SubFamily';
import { useSession } from 'next-auth/react';

interface PostData {
    state: string;
    weight: number;
    subfamilyId: string;
    familyId: string;
    excludingTaxesPrice: number;
    indicativePriceOfNewPiece: number;
    comments: string;
    designation: string;
    brandId: string;
    model: string;
    storageId: string;
}

const AddBike = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<PostData>({ mode: 'onChange', reValidateMode: 'onChange' });

    const [familyType, setFamilyType] = useState<string>('');
    const [subfamilyType, setSubFamilyType] = useState<string>('');
    const [brandType, setBrandType] = useState<string>('');
    const [stateType, setStateType] = useState<string>('');
    const [qrData, setQrData] = useState<string>('');
    const [openQrModal, setOpenQrModal] = useState<boolean>(false);
    const [families, setFamilies] = useState<Family[]>([])
    const [subfamilies, setSubfamilies] = useState<SubFamily[]>([]);
    const { data: session, status } = useSession();
    const [priceTTC, setPriceTTC] = useState<number>(); 

    const selectFamily = (e: any) => {
        setFamilyType(e);
        axios.get(process.env.API_URL + 'families/' + e ).then((response) => {
          setSubfamilies(response.data.subfamilies);
        });
      };

    const selectSubFamily = (e: any) => {
        setSubFamilyType(e);
    };

  const selectBrand = (e: any) => {
    setBrandType(e);
  };

  const selectState = (e: any) => {
    setStateType(e);
  };

    const handleQrModal = (data: string) => {
        setQrData(data);
        setOpenQrModal(true);
    };

 
    const onSubmit = (data: PostData) => {
        data.brandId = brandType;
        data.subfamilyId = subfamilyType;
        data.state = stateType;
        data.familyId = familyType;
        setPriceTTC(undefined);
        axios
           .post(process.env.API_URL +'bikes', data)
           .then(({ data: { id } }) => {
            console.log(data);
            
             toast.success(
               (t: Toast) => (
             <div className="flex items-center gap-4">
                   <span>Votre article a été ajouté !</span>
                   <section className="flex gap-2 text-white">
                    <Button color="teal" onClick={() => handleQrModal(id)}>
                   <QrCodeIcon className="w-5" />
                     </Button>
                     <Button color="teal" onClick={() => toast.dismiss(t.id)}>
                       <XMarkIcon className="w-5" />
                     </Button>
                   </section>
                 </div>
              ),
               { duration: 25 * 1000 }
            );
          })
          .catch((error) => {
            
           });
    };

    const [brand, setBrand] = useState<any[]>([]);

    useEffect(() => {
        axios.get(process.env.API_URL +'brands').then((response) => {
            setBrand(response.data);
        });

        axios.get(process.env.API_URL +'families/activity-type/2').then((response) => {
            setFamilies(response.data);
        });
 
        axios.get(process.env.API_URL +'subfamilies').then((response) => {
            selectSubFamily(response.data);
        });
    }, []);
    
    const handleFormChange =(e: any) => {
        var pTTC = 0;
        var priceTTCRound = 0;
        if(session?.token.company.vatRate != null){
        pTTC = e.target.value * (1 + session?.token.company.vatRate  / 100);
        priceTTCRound = Math.round(pTTC * 100) / 100;
        } 
        setPriceTTC(priceTTCRound);
      }

    return (
      <>

        <HeaderNav />

        <QrModal
                data={qrData}
                showModal={openQrModal}
                setShowModal={setOpenQrModal}
                text={qrData}
            ></QrModal>

            <Card className="w-1/2 mx-auto mt-10 ">
                <CardBody className="text-center">
                    <Typography variant="h2" className="text-background mb-5 ">
                        Ajout pièce de piece de vélo
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-5 ">
                            <div className="w-full">
                                <Input
                                    label="Modèle"
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
                                    label="Désignation"
                                    variant="outlined"
                                    type="text"
                                    {...register('designation', {
                                        required: true,
                                        minLength: 3,
                                        maxLength: 30,
                                    })}
                                />
                                {errors.designation &&
                                    ['required', 'maxLength', 'minLength'].includes(
                                        errors.designation?.type
                                    ) && (
                                        <p className="text-red-500 text-xs italic">
                                            Veuillez renseigner une désignation valide entre 3 et 30
                                            caractères
                                        </p>
                                    )}
                            </div>

                            <div className="w-full">
                                <Select
                                    label="Selectionner l'état"
                                    {...register('state')}
                                    onChange={selectState}
                                >
                                    <Option value="NEW">Neuf</Option>
                                    <Option value="USED">Occasion</Option>
                                </Select>
                            </div>

                            <div className="w-full">
                                <Select
                                    {...register('familyId')}
                                    label="Selectionner la famille"
                                    onChange={selectFamily}
                                >
                                    
                                {families.map((family) => (
                                  <Option key={family.id} value={family.id}>
                                    {family.familyName}
                                    </Option>
                                   ))}
                                </Select>
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
                            {...register('subfamilyId')}
                            label="Selectionner la sous-famille"
                            onChange={selectSubFamily}
                         >
                            {subfamilies.map((subfamily) => (
                         <Option key={subfamily.id} value={subfamily.id}>
                            {subfamily.subfamilyName}
                         </Option>
                     ))}
                  </Select>
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
              
                            <div className="w-full">
                                <Input
                                    label="Poids"
                                    variant="outlined"
                                    type="number"
                                    {...register('weight', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 0,
                                        max: 1000,
                                    })}
                                />
                                {errors.weight &&
                                    ['required', 'max', 'min'].includes(errors.weight?.type) && (
                                        <p className="text-red-500 text-xs italic">
                                            Veuillez renseigner un poids valide entre 0 et 1000 kg
                                        </p>
                                    )}
                            </div>

                            <div className="w-full">
                                <Select
                                    {...register('brandId')}
                                    label="Selectionner la marque"
                                    onChange={selectBrand}
                                >
                                    {brand.map((listBrand) => (
                                        <Option key={listBrand.id} value={listBrand.id}>
                                            {listBrand.brandName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="w-full">
                                <Input
                                    label="Prix HT"
                                    variant="outlined"
                                    type="number"
                                    {...register('excludingTaxesPrice', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 0,
                                        max: 1000,
                                    })}
                                    onChange={event => handleFormChange(event)}
                                />
                                {errors.excludingTaxesPrice &&
                                    ['required', 'max', 'min'].includes(errors.excludingTaxesPrice?.type) && (
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
                                readOnly
                                value={priceTTC}
                              />
                            </div>
                            <div className="w-full">
                                <Input
                                    label="Prix indicatif de la pièce neuve"
                                    variant="outlined"
                                    type="number"
                                    {...register('indicativePriceOfNewPiece', {
                                        valueAsNumber: true,
                                        required: true,
                                        min: 1,
                                        max: 1000,
                                    })}
                                />
                                {errors.indicativePriceOfNewPiece &&
                                    ['required', 'max', 'min'].includes(
                                        errors.indicativePriceOfNewPiece?.type
                                    ) && (
                                        <p className="text-red-500 text-xs italic">
                                            Le prix indicatif de la pièce neuve doit être compris
                                            entre 1 et 1000
                                        </p>
                                    )}
                            </div>

                            <div className="w-full col-span-2">
                                <Input
                                    label="Info commentaires"
                                    variant="outlined"
                                    type="text"
                                    {...register('comments')}
                                />
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
                </CardBody>
            </Card>
        </>
    );
};

export default AddBike





