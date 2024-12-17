import {
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    Input,
    Select,
    Option, 
} from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ReplacementBike } from '../../models/Remplacement_bike/Replacement_Bike';
import { UpdateRemplacementBike } from '../../models/Remplacement_bike/UpdateRemplacementBike';
import  * as BikeService from '../../services/BikeService';
import axios from 'axios';



interface Props {
    bikes: ReplacementBike;
    open: boolean;
    onClose: (UpdateRemplacementBike? : ReplacementBike) => any;
}

const BikeUpdateModal = ({
    bikes,
    open,
    onClose,
}: Props) => {


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm<UpdateRemplacementBike>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    })

    useEffect(() => {
        setValue('state',bikes ? bikes.state : '');
        setValue('weight',bikes ? bikes.weight : 0);
        setValue('subfamilyId',bikes && bikes.subfamily ? bikes.subfamily.id : '');
        setValue('excludingTaxesPrice', bikes ? bikes.excludingTaxesPrice  : 0);
        setValue('indicativePriceOfNewPiece', bikes ? bikes.indicativePriceOfNewPiece : 0);
        setValue('comments', bikes ? bikes.comments : '');
        setValue('designation', bikes ? bikes.designation : '');
        setValue('brandId', bikes && bikes.brand ? bikes.brand.id : '');
        setValue('model', bikes && bikes.model ? bikes.model: '');
        }, [bikes]);

        const [subFamilyTypes, setSubFamilyTypes] = useState('');
        const [brandTypes, setBrandTypes] = useState('');
        const [stateTypes, setStateTypes] = useState('');
        const [brand, setBrand] = useState<any[]>([]);
        const [subFamily, setSubFamily] = useState<any[]>([]);

        useEffect(() => {
            axios.get(process.env.API_URL + 'brands').then((response) => {
                setBrand(response.data);
            });
        }, []);

        useEffect(() => {
            axios.get(process.env.API_URL + 'subfamilies').then((response) => {
                setSubFamily(response.data);
            });
        }, []);

        const selectSubFamily = (e: any) => {
            setSubFamilyTypes(e);
        };

        const selectBrand = (e: any) => {
            setBrandTypes(e);
        };

        const selectState = (e: any) => {
            setStateTypes(e)
        };
        const onSubmit = (data :UpdateRemplacementBike) => {

            if(stateTypes == ''){
                data.state = bikes.state;
            }else {
                data.state = stateTypes;
            }

            if(subFamilyTypes == ''){
                data.subfamilyId = bikes.subfamily.id;
            }else {
                data.subfamilyId = subFamilyTypes;
            }

            if(brandTypes == ''){
                data.brandId = bikes.brand.id;
            }else {
                data.brandId = brandTypes;
            }

            BikeService
            .updateBike(bikes.id, data)
            .then(
                (response) => {
                    if (response.status === 200) {
                        toast.success("L'article a bien été modifié");
                        onClose(response.data);
                    }
                },
                (error) => {
                    toast.error("Une erreur est survenue lors de la modification de l'article");
                    onClose();
                }
            );
        };

        return (
            <>
                <Dialog open={open} handler={onClose}>
                <DialogHeader className="justify-center">
                    Modifier un article
                </DialogHeader>
                <DialogBody className="justify-center">
                  {bikes ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-col-2 gap-5">
                            <div className="w-full">
                        </div>
                        <div className="w-full col-span-2">
                            <Input
                            label="Désignation"
                            variant="outlined"
                            type="text"
                            {...register('designation', {
                                required: true,
                                minLength:3,
                                maxLength: 30,
                            })}
                            />
                            {errors.designation && 
                            ['required','maxLenght', 'minLeght'].includes(
                                errors.designation?.type
                            ) && (
                                <p className="text-red-500 text-xs italic">
                                    Veuillez saisir une désignation valide entre 3 et 30
                                    caractères
                                </p>
                            )}
                        </div>
                        <div className="w-full">
                            <Select
                            value={bikes.state}
                            label="Slectionner l'état"
                            {...register('state')}
                            onChange={selectState}
                            >
                                <Option value="Neuf">Neuf</Option>
                                <Option value="Occasion">Occasion</Option>
                            </Select>
                        </div>
                        <div className="w-full">
                            <Select
                                value = {bikes.subfamily.id}
                                {...register('subfamilyId')}
                                label="Sélectionner la sous-famille"
                                onChange={selectSubFamily}
                            >
                                {subFamily.map((listSubFamily) => (  
                                    <Option key={listSubFamily.id} value={listSubFamily.id}>
                                        {listSubFamily.subfamilyName}
                                    </Option>
                                ))} 
                            </Select>
                            {errors.subfamilyId &&
                            ['required', 'minLeght', 'maxLength'].includes(
                                errors.subfamilyId?.type
                            ) && (
                                <p className="text-red-500 text-xs italic">
                                    Veuillez sélectionner une sous-famille d&apos;appareil valide
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
                            ['required', 'min', 'max'].includes(
                                errors.weight?.type
                            ) && (
                                <p className="text-red-500 text-xs italic">
                                    Veuillez saisir un poids valide entre 0 et 1000 kg 
                                </p>
                            )}
                        </div>
                        <div className="w-full">
                            <Select
                                value={bikes.brand.id}
                                label="Sélectionner la marque" 
                                {...register('brandId')}
                                onChange={selectBrand}
                            >
                                {brand.map((listBrand) => (
                                    <Option key={listBrand.id} value={listBrand.id}>
                                      {listBrand.brandName}
                                    </Option>
                                ))}
                            </Select>
                            </div>
                            <div className='w-full'>
                                <Input
                                label="Modèle"
                                variant="outlined"
                                type="text"
                                {...register('model', {
                                    required: true,
                                    minLength:3,
                                    maxLength: 20,
                                })}
                                />
                                {errors.model &&
                                ['required', 'minLeght', 'maxLength'].includes(
                                    errors.model?.type
                                ) && (
                                    <p className="text-red-500 text-xs italic">
                                        Veuillez saisir un modèle valide entre 3 et 20 caractères
                                    </p>
                                )}
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
                                />
                                {errors.excludingTaxesPrice &&
                                ['required', 'min', 'max'].includes(errors.excludingTaxesPrice?.type) && (
                                    <p className="text-red-500 text-xs italic">
                                        Veuillez saisir un prix valide entre 0 et 1000 €
                                    </p>
                                )}
                            </div>
                            <div className="w-full">
                                <Input
                                label="Prix indcatif de la pièce neuve"
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
                                ['required', 'min', 'max'].includes(
                                    errors.indicativePriceOfNewPiece?.type
                                ) && (
                                    <p className="text-red-500 text-xs italic">
                                        Veuillez saisir un prix valide entre 1 et 1000 
                                    </p>
                                )}
                            </div>
                            <div className="w-full col-span-2">
                                <Input
                                label="Description"
                                variant="outlined"
                                type="text"
                                {...register('comments')}
                                />
                            </div>
                            <div className="col-span-2">
                                <Button color="teal" fullWidth type="submit" size="md">
                                    Metre à jour une pièce de vélo au stock
                                </Button>
                            </div>
                            <div className='col-span-2'>
                              <Button
                                variant="text"
                                color="red"
                                fullWidth
                                size="md"
                                onClick={() => onClose()}
                                >
                                    <span>Annuler</span>
                                </Button>
                            </div>
                        </div>
                    </form>
                  ) : (
                    <p>Chargement...</p>
                    )}
                    </DialogBody>
                </Dialog>  
        </>
    );
};

export default BikeUpdateModal;
