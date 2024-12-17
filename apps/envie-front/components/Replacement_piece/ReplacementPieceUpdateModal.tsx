import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Select,
  Option,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ReplacementPiece } from '../../models/Replacement_piece/ReplacementPiece';
import { UpdateReplacementPiece } from '../../models/Replacement_piece/UpdateReplacementPiece';
import * as replacementPieceService from '../../services/ReplacementPieceService';
import axios from 'axios';

interface Props {
  replacementPiece: ReplacementPiece;
  open: boolean;
  onClose: (updatedReplacementPiece?: ReplacementPiece) => any;
}

const ReplacementPieceUpdateModal = ({
  replacementPiece,
  open,
  onClose,
}: Props) => {
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<UpdateReplacementPiece>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    });

  useEffect(() => {
    setValue('state', replacementPiece ? replacementPiece.state : '');
    // setValue('weight', replacementPiece ? replacementPiece.weight : 0);
    setValue(
      'subfamilyId',
      replacementPiece && replacementPiece.subfamily
        ? replacementPiece.subfamily.id
        : ''
    );

    // setValue(
    //   'excludingTaxesPrice',
    //   replacementPiece ? replacementPiece.excludingTaxesPrice : 0
    // );
    // setValue(
    //   'indicativePriceOfNewPiece',
    //   replacementPiece ? replacementPiece.indicativePriceOfNewPiece : 0
    // );
    setValue('comments', replacementPiece ? replacementPiece.comments : '');

    setValue(
      'manufacturerReferenceOfPiece',
      replacementPiece ? replacementPiece.manufacturerReferenceOfPiece : ''
    );
    setValue(
      'designationInterne',
      replacementPiece ? replacementPiece.designationInterne : ''
    );
    setValue(
      'brandId',
      replacementPiece && replacementPiece.brand
        ? replacementPiece.brand.id
        : ''
    );
    setValue('model', replacementPiece ? replacementPiece.model : '');
    setValue(
      'technicalReferenceDevice',
      replacementPiece ? replacementPiece.technicalReferenceDevice : ''
    );
    setValue(
      'serialNumber',
      replacementPiece ? replacementPiece.serialNumber : ''
    );
  }, [replacementPiece]);


  const [subfamilyType, setSubfamilyType] = useState('');
  const [brandType, setBrandType] = useState('');
  const [stateType, setStateType] = useState('');
  const [brand, setBrand] = useState<any[]>([]);
  const [subfamily, setSubfamily] = useState<any[]>([]);


  useEffect(() => {
    axios.get(process.env.API_URL + 'brands').then((response) => {
      setBrand(response.data);
    });
  }, []);


  useEffect(() => {
    axios.get(process.env.API_URL + 'subfamilies').then((response) => {
      setSubfamily(response.data);
    });
  }, []);

  const selectSubfamily = (e: any) => {
    setSubfamilyType(e);
  };

  const selectBrand = (e: any) => {
    setBrandType(e);
  };


  const selectState = (e: any) => {
    setStateType(e);
  };

  const onSubmit = (data: UpdateReplacementPiece,) => {
  
    if(stateType == ''){
      data.state = replacementPiece.state;
    }else {
      data.state = stateType;
    } 
    
    if(brandType == ''){
      data.brandId = replacementPiece.brand.id;
    }else {
      data.brandId = brandType;
    } 
    
    if(subfamilyType == ''){
      data.subfamilyId = replacementPiece.subfamily.id;
    }else {
      data.subfamilyId = subfamilyType;
    } 

    
    replacementPieceService
      .updateReplacementPiece(replacementPiece.id, data)
      .then(
        (response) => {
          if (response.status == 200) {
            toast.success("L'article a bien été modifié");
            onClose(response.data);
          }
        },
        (error) => {
          toast.error(
            "Une erreur est survenue lors de la modification de l'article"
          );
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
          {replacementPiece ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-5">
              <div className="w-full">
                  <Input
                    label="Designation Interne"
                    variant="outlined"
                    type="text"
                    {...register('designationInterne', {
                      required: true,
                      minLength: 3,
                      maxLength: 30,
                    })}
                  />
                  {errors.designationInterne &&
                    ['required', 'maxLength', 'minLength'].includes(
                      errors.designationInterne?.type
                    ) && (
                      <p className="text-red-500 text-xs italic">
                        Veuillez renseigner une désignation valide entre 3 et 30
                        caractères
                      </p>
                    )}
                </div>
                <div className="w-full">
                  <Input
                    label="Référence constructeur de la pièce"
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
                    value={replacementPiece.state}
                    label="Selectionner l'état"
                    {...register('state')}
                    onChange={selectState}
                  >
                    <Option value="Neuf">Neuf</Option>
                    <Option value="Occasion">Occasion</Option>
                  </Select>
                </div>
                <div className="w-full">
                  <Select
                    value = {replacementPiece.subfamily.id}
                    {...register('subfamilyId')}
                    label="Selectionner la sous-famille"
                    onChange={selectSubfamily}
                  >
                    {subfamily.map((listSubfamily) => (
                      <Option key={listSubfamily.id} value={listSubfamily.id}>
                        {listSubfamily.subfamilyName}
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
                  <Select
                    value = {replacementPiece.brand.id}
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
                    label="Modèle (cf.Commerciale)"
                    variant="outlined"
                    type="text"
                    {...register('model', {
                      required: true,
                      minLength: 3,
                      maxLength: 40,
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
                    label="Référence technique appareil"
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

                {/*<div className="w-full">*/}
                {/*  <Input*/}
                {/*    label="Poids"*/}
                {/*    variant="outlined"*/}
                {/*    type="number"*/}
                {/*    {...register('weight', {*/}
                {/*      valueAsNumber: true,*/}
                {/*      required: true,*/}
                {/*      min: 0,*/}
                {/*      max: 1000,*/}
                {/*    })}*/}
                {/*  />*/}
                {/*  {errors.weight &&*/}
                {/*    ['required', 'max', 'min'].includes(*/}
                {/*      errors.weight?.type*/}
                {/*    ) && (*/}
                {/*      <p className="text-red-500 text-xs italic">*/}
                {/*        Veuillez renseigner un poids valide entre 0 et 1000 kg*/}
                {/*      </p>*/}
                {/*    )}*/}
                {/*</div>*/}

                {/*<div className="w-full">*/}
                {/*  <Input*/}
                {/*    label="Prix HT"*/}
                {/*    variant="outlined"*/}
                {/*    type="number"*/}
                {/*    {...register('excludingTaxesPrice', {*/}
                {/*      valueAsNumber: true,*/}
                {/*      required: true,*/}
                {/*      min: 0,*/}
                {/*      max: 1000,*/}
                {/*    })}*/}
                {/*  />*/}
                {/*  {errors.excludingTaxesPrice &&*/}
                {/*    ['required', 'max', 'min'].includes(errors.excludingTaxesPrice?.type) && (*/}
                {/*      <p className="text-red-500 text-xs italic">*/}
                {/*        Veuillez renseigner un prix valide entre 0 et 1000 €*/}
                {/*      </p>*/}
                {/*    )}*/}
                {/*</div>*/}
                {/*<div className="w-full">*/}
                {/*  <Input*/}
                {/*    label="Prix indicatif de la pièce neuve"*/}
                {/*    variant="outlined"*/}
                {/*    type="number"*/}
                {/*    {...register('indicativePriceOfNewPiece', {*/}
                {/*      valueAsNumber: true,*/}
                {/*      required: true,*/}
                {/*      min: 1,*/}
                {/*      max: 1000,*/}
                {/*    })}*/}
                {/*  />*/}
                {/*  {errors.indicativePriceOfNewPiece &&*/}
                {/*    ['required', 'max', 'min'].includes(*/}
                {/*      errors.indicativePriceOfNewPiece?.type*/}
                {/*    ) && (*/}
                {/*      <p className="text-red-500 text-xs italic">*/}
                {/*        Le prix indicatif de la pièce neuve doit être compris*/}
                {/*        entre 1 et 1000*/}
                {/*      </p>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div className="col-span-2">
                  <Button color="teal" fullWidth type="submit" size="md">
                    Metre à jour une pièce au stock
                  </Button>
                </div>
                <div className="col-span-2">
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

export default ReplacementPieceUpdateModal;
