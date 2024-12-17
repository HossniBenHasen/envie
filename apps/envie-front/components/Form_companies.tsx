import { Button, Card, CardBody, Input, Option, Select, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {useState} from "react";

const Form_companie = () => {
  // typage des données
  type FormCompanie = {
    name: string;
    siretNumber: string;
    street: string;
    zipCode: string;
    city: string;
    country: string;
    phoneNumber: string;
    mailAddress: string;
    vatRate: number;
    activityType: string;
  };


  const handleChange = (e: any) => {
    setType(e);
  };

  // gestion form react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormCompanie>({ mode: 'onChange', reValidateMode: 'onChange' });

  const [type, setType] = useState('');

  // data post axios
  const onSubmit = (data: FormCompanie) => {
    data.activityType = type;
    axios
      .post(process.env.API_URL +'companies', data)
      .then(() => {
        toast.success('votre entreprise a été ajouté');
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };

  return (
    <Card className="w-1/2 mx-auto mt-10">
      <CardBody className="text-center">
        <Typography variant="h2" className="text-background mb-3 ">
          Création entreprise
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            <div className="form-control errorMsg w-full col-span-2">
                <Select
                    label="Selectionner le type de pièce"
                    {...register('activityType')}
                    onChange={handleChange}
                    value={type}
                >
                  <Option value="1">PDR</Option>
                  <Option value="2">Vélo</Option>
                  <Option value="3">Livre</Option>
                </Select>
              </div>
              <div className="form-control errorMsg w-full">
              <Input
                label="Nom"
                variant="outlined"
                type="text"
                className=""
                {...register('name', {
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
              />
              {errors.name && errors.name?.type === 'required' && (
                <p className=" text-red-500 text-xs italic"> Nom est requis.</p>
              )}
              {errors.name && errors.name?.type === 'minLength' && (
                <p className="  text-red-500 text-xs italic">
                  Nom doit contenir au moins 3 lettres.
                </p>
              )}
              {errors.name && errors.name?.type === 'maxLength' && (
                <p className="  text-red-500 text-xs italic">
                  Nom doit contenir au maximum 20 lettres.
                </p>
              )}
            </div>

            <div className="form-control errorMsg w-full ">
              <Input
                label="Numéro de siret"
                variant="outlined"
                type="number"
                className=""
                {...register('siretNumber', {
                  required: true,
                  minLength: 14,
                  maxLength: 14,
                })}
              />
              {errors.siretNumber &&
                errors.siretNumber?.type === 'required' && (
                  <p className=" text-red-500 text-xs italic">
                    Numéro de siret est requis.
                  </p>
                )}
              {errors.siretNumber &&
                errors.siretNumber?.type === 'minLength' && (
                  <p className="  text-red-500 text-xs italic">
                    Numéro de siret doit contenir 14 chiffres.
                  </p>
                )}
              {errors.siretNumber &&
                errors.siretNumber?.type === 'maxLength' && (
                  <p className="  text-red-500 text-xs italic">
                    Numéro de siret doit contenir au maximum 14 chiffres.
                  </p>
                )}
            </div>
            <div className="form-control errorMsg w-full">
              <Input
                label="Rue"
                variant="outlined"
                type="text"
                className=""
                {...register('street', {
                  required: true,
                  minLength: 5,
                  maxLength: 45,
                })}
              />
              {errors.street && errors.street?.type === 'required' && (
                <p className=" text-red-500 text-xs italic"> Rue est requis.</p>
              )}
              {errors.street && errors.street?.type === 'minLength' && (
                <p className="  text-red-500 text-xs italic">
                  Rue doit contenir au moins 5 lettres.
                </p>
              )}
              {errors.street && errors.street?.type === 'maxLength' && (
                <p className="  text-red-500 text-xs italic">
                  Rue doit contenir au maximum 45 lettres.
                </p>
              )}
            </div>
            <div className="form-control errorMsg w-full">
              <Input
                label="Code postal"
                variant="outlined"
                type="text"
                className=""
                {...register('zipCode', {
                  required: true,
                  minLength: 5,
                  maxLength: 5,
                })}
              />
              {errors.zipCode && errors.zipCode?.type === 'required' && (
                <p className=" text-red-500 text-xs italic">
                  zipCode est requis.
                </p>
              )}
              {errors.zipCode && errors.zipCode?.type === 'minLength' && (
                <p className="  text-red-500 text-xs italic">
                  zipCode doit contenir 5 chiffres.
                </p>
              )}
              {errors.zipCode && errors.zipCode?.type === 'maxLength' && (
                <p className="  text-red-500 text-xs italic">
                  zipCode doit contenir au maximum 5 chiffres.
                </p>
              )}
            </div>
            <div className="form-control errorMsg w-full">
              <Input
                label="Ville"
                variant="outlined"
                type="text"
                className=""
                {...register('city', {
                  required: true,
                  minLength: 1,
                  maxLength: 68,
                })}
              />
              {errors.city && errors?.city.type === 'required' && (
                <p className=" text-red-500 text-xs italic">
                  Ville est requis.
                </p>
              )}
              {errors.city && errors.city?.type === 'minLength' && (
                <p className="  text-red-500 text-xs italic">
                  Ville doit contenir au moins 1 lettre.
                </p>
              )}
              {errors.city && errors.city?.type === 'maxLength' && (
                <p className="  text-red-500 text-xs italic">
                  Ville doit contenir au maximum 68 lettres.
                </p>
              )}
            </div>
            <div className="form-control errorMsg w-full">
              <Input
                label="Pays"
                variant="outlined"
                type="text"
                className=""
                {...register('country', {
                  required: true,
                  maxLength: 42,
                  minLength: 2,
                })}
              />
              {errors.country && errors.country.type === 'required' && (
                <p className="  text-red-500 text-xs italic">
                  Pays est requis.
                </p>
              )}
              {errors.country && errors.country.type === 'minLength' && (
                <p className=" text-red-500 text-xs italic">
                  Pays doit contenir au moins 2 lettres.
                </p>
              )}
              {errors.country && errors.country.type === 'maxLength' && (
                <p className="  text-red-500 text-xs italic">
                  Pays doit contenir au maximum 42 lettres.
                </p>
              )}
            </div>
            <div className="form-control errorMsg w-full">
              <Input
                label="Numéro de téléphone"
                variant="outlined"
                type="tel"
                className=""
                {...register('phoneNumber', {
                  required: true,
                  minLength: 10,
                  maxLength: 10,
                })}
              />
              {errors.phoneNumber && errors.phoneNumber.type === 'required' && (
                <p className=" text-red-500 text-xs italic">
                  {' '}
                  Numéro de téléphone est requis.
                </p>
              )} 
              {errors.phoneNumber &&
                errors.phoneNumber.type === 'minLength' && (
                  <p className="  text-red-500 text-xs italic">
                    Numéro de téléphone doit contenir 10 chiffres.
                  </p>
                )}
              {errors.phoneNumber &&
                errors.phoneNumber.type === 'maxLength' && (
                  <p className="  text-red-500 text-xs italic">
                    Numéro de téléphone doit contenir au maximum 10 chiffres.
                  </p>
                )}
            </div>
            <div className="form-control errorMsg w-full">
              <Input
                label="Addresse mail"
                variant="outlined"
                type="mail"
                className=""
                {...register('mailAddress', {
                  required: true,
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'Entrer une addresse mail valide',
                  },
                })}
              />
              {errors.mailAddress && errors.mailAddress.type === 'required' && (
                <p className=" text-red-500 text-xs italic">
                  {' '}
                  Addresse mail est requis.
                </p>
              )}
            </div>
            <div className="form-control col-span-2 errorMsg w-full">
              <Select
                label="Taux de TVA"
                {...register('vatRate', {
                  required: true,
                  valueAsNumber: true,
                })}
                onChange={(e: any) => setValue('vatRate', e)}
              >
                <Option value="0">0</Option>
                <Option value="2.1">2.1</Option>
                <Option value="5.5">5.5</Option>
                <Option value="10">10</Option>
                <Option value="20">20</Option>
              </Select>
            </div>
          
            <div className="col-span-2 w-full errorMsg">
              <Button color="teal" type="submit" fullWidth size="md" disabled={!isValid}>
                Ajouter une entreprise
              </Button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default Form_companie;
