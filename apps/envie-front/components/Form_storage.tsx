import { Button, Card, CardBody, Input, Option, Select, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { UserRole } from '../enums/UserRole';
import { Company } from '../models/Company/Company';
import { CreateStorage } from '../models/Storage/CreateStorage';

const Storage = () => {
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateStorage>({ mode: 'onChange', reValidateMode: 'onChange' });

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios.get(process.env.API_URL +'companies').then((res) => {
      setCompanies(res.data);
    });
  }, []);

  const onSubmit = (data: CreateStorage) => {
    axios
      .post(process.env.API_URL +'storages', data)
      .then(() => {
        toast.success('votre lieu de stockage a été ajouté');
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <Card className="w-1/2 mx-auto mt-10 ">
        <CardBody className="text-center">
          <Typography variant="h2" className="text-background mb-5">
            Creation d&apos;entrepôt de stockage
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-5 ">
              <div className="w-full">
                <Input
                  label="Nom de l'entrepôt"
                  type="text"
                  variant="outlined"
                  {...register('name', {
                    required: true,
                    minLength: 3,
                    maxLength: 20,
                  })}
                />
                {errors.name &&
                  ['required', 'minLength', 'maxlength'].includes(
                    errors.name?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Le nom de l&apos;entrepôt doit faire entre 3 et 20
                    </p>
                  )}
              </div>
              <div className="form-control  errorMsg w-full">
                <Select
                  {...register('companyId', {
                    valueAsNumber: true,
                    required: true,
                  })}
                  label="Sélectionner l'entreprise"
                  onChange={(e: any) => setValue('companyId', e)}
                >
                  {session &&
                  status === 'authenticated' &&
                  session.token.role === UserRole.ADMIN ? (
                    <Option value={session.token.company.id.toString()}>
                      {session.token.company.name}
                    </Option>
                  ) : 
                    companies.map((company, index) => (
                      <Option key={index} value={company.id.toString()}>
                        {company.name}
                      </Option>
                    ))
                  }
                </Select>
              </div>
              <div className="w-full">
                <Input
                  label="Nom interne"
                  type="text"
                  variant="outlined"
                  {...register('internalName', {
                    required: true,
                    minLength: 3,
                    maxLength: 20,
                  })}
                />
                {errors.street &&
                  ['required', 'minLength', 'maxlength'].includes(
                    errors.street?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Le nom interne doit faire entre 3 et 20
                    </p>
                  )}
              </div>
              <div className="w-full">
                <Input
                  label="Responsable"
                  type="text"
                  variant="outlined"
                  {...register('responsiblePerson', {
                    required: true,
                    minLength: 3,
                    maxLength: 20,
                  })}
                />
                {errors.responsiblePerson &&
                  ['required', 'minLength', 'maxLength'].includes(
                    errors.responsiblePerson?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner un responsable valide entre 3 et 20
                      caractères.
                    </p>
                  )}
              </div>

              <div className="w-full">
                <Input
                  label="Rue"
                  type="text"
                  variant="outlined"
                  {...register('street', {
                    required: true,
                    minLength: 3,
                    maxLength: 45,
                  })}
                />
                {errors.street &&
                  ['required', 'minLength', 'maxlength'].includes(
                    errors.street?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner une rue valide de 5 chiffres.
                    </p>
                  )}
              </div>

              <div className="w-full">
                <Input
                  label="Code postal"
                  type="text"
                  variant="outlined"
                  {...register('zipCode', {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                  })}
                />

                {errors.zipCode &&
                  ['required', 'maxLength', 'minLength'].includes(
                    errors.zipCode?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner une code postal valide de 5 chiffres.
                    </p>
                  )}
              </div>

              <div className="w-full">
                <Input
                  label="Ville"
                  type="text"
                  variant="outlined"
                  {...register('city', {
                    required: true,
                    minLength: 1,
                    maxLength: 68,
                  })}
                />

                {errors.city &&
                  ['required', 'minLength', 'maxLength'].includes(
                    errors.city?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner une code postal valide entre 1 et 68
                      caractères.
                    </p>
                  )}
              </div>

              <div className="w-full">
                <Input
                  label="Pays"
                  type="text"
                  variant="outlined"
                  {...register('country', {
                    required: true,
                    minLength: 2,
                    maxLength: 42,
                  })}
                />
                {errors.country &&
                  ['required', 'minLength', 'maxLength'].includes(
                    errors.country?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner une pays valide entre 2 et 42
                      caractères.
                    </p>
                  )}
              </div>

              <div className="w-full">
                <Input
                  label="Numéro de téléphone"
                  type="tel"
                  variant="outlined"
                  {...register('phoneNumber', {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  })}
                />

                {errors.phoneNumber &&
                  ['required', 'minLengthn', 'maxLength'].includes(
                    errors.phoneNumber?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner un numéro de téléphone valide de 10
                      chiffres.
                    </p>
                  )}
              </div>

              <div className="w-full">
                <Input
                  label="Addresse mail"
                  type="email"
                  variant="outlined"
                  {...register('mailAddress', {
                    required: true,
                  })}
                />

                {errors.mailAddress &&
                  ['required'].includes(errors.mailAddress?.type) && (
                    <p className="text-red-500 text-xs italic">
                      Une addresse mail est requise.
                    </p>
                  )}
              </div>



              <div className="col-span-2">
                <Input
                  label="Nombre de rangée "
                  type="number"
                  variant="outlined"
                  className=""
                  {...register('numberOfRows', {
                    valueAsNumber: true,
                    required: true,
                    min: 1,
                    max: 100
                  })}
                />
                {errors.numberOfRows &&
                  ['required', 'min', 'max'].includes(
                    errors.numberOfRows?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner un nombre de rangée valide
                      entre 1 et 100.
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <Input
                  label="Nombre de colonne par rangée "
                  type="number"
                  variant="outlined"
                  className=""
                  {...register('columnPerRow', {
                    valueAsNumber: true, 
                    required: true,
                    min: 1,
                    max: 100,
                  })}
                />
                {errors.columnPerRow &&
                  ['required', 'min', 'max'].includes(
                    errors.columnPerRow?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner un nombre de colonne par rangée valide
                      entre 1 et 100.
                    </p>
                  )}
              </div>

              <div className="col-span-2 ">
                <Input
                  label="Nombre d'étagère par colonne"
                  type="number"
                  variant="outlined"
                  {...register('shelfPerColumn', {
                    valueAsNumber: true,
                    required: true,
                    min: 1,
                    max: 100,
                  })}
                />
                {errors.shelfPerColumn &&
                  ['required', 'min', 'max'].includes(
                    errors.shelfPerColumn?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner un nombre d&apos;étagères par colonne valide entre 1
                      et 100.
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <Input
                  label="Nombre d'emplacement par étagère"
                  type="number"
                  variant="outlined"
                  className=""
                  {...register('locationPerShelf', {
                    valueAsNumber: true,
                    required: true,
                    min: 1,
                    max: 26,
                  })}
                />
                {errors.locationPerShelf &&
                  ['required', 'min', 'max'].includes(
                    errors.locationPerShelf?.type
                  ) && (
                    <p className="text-red-500 text-xs italic">
                      Veuillez renseigner un nombre d&apos;emplacement par étagère valide
                      entre 1 et 100.
                    </p>
                  )}
              </div>
              <div className="col-span-2">
                <div>
                  <Button
                    color="teal"
                    size="md"
                    type="submit"
                    className="bg-background"
                    disabled={!isValid}
                    fullWidth
                  >
                    Créer un Entrepôt de stockage
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default Storage;