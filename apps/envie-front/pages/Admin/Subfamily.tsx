import {
  Button,
  Card,
  CardBody,
  Input,
  Typography,
  Select,
  Option,
} from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DeleteModal from '../../components/DeleteModal';
import HeaderNav from '../../components/HeaderNav';
import SubFamilyUpdateModal from '../../components/SubFamily/SubFamilyUpdateModal';
import { SubFamily } from '../../models/SubFamily/SubFamily';

type PostData = {
  subfamilyName: string;
  familyId: string;
};

const Subfamily = () => {
  const [familyType, setFamilyType] = useState<string>('');
  const { register, handleSubmit, formState: { errors} } = useForm<PostData>();
  const [subFamilies, setSubFamilies] = useState<any[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [subfamilyIdToDelete, setSubFamilyIdToDelete] = useState<string>();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [subfamilyToUpdate, setSubFamilyToUpdate] = useState<any>();
  const [families, setFamilies] = useState<any[]>([]);

  const selectFamily = (e: any) => {
    setFamilyType(e);
  };
  useEffect(() => {
    axios.get(process.env.API_URL + 'subfamilies').then((response) => {
      setSubFamilies(response.data);

      axios.get(process.env.API_URL +'families').then((response) => {
        setFamilies(response.data);
      });
    });
  }, []);

  const addSubFamily = (data: PostData) => {
    data.familyId = familyType;
    axios
        .post(process.env.API_URL + 'subfamilies', data)
        .then((response) => {
          if (response.status == 201) {
            setSubFamilies((current: SubFamily[]) => [response.data, ...current]);
            toast.success('Votre sous-famille a bien été ajouté');
          }
        })
        .catch(function () {
          toast.error("Une erreur est survenue lors de l'enregistrement");
        });
  };

  const deleteSubFamily = (id?: string) => {
    axios
        .delete<any>(process.env.API_URL + 'subfamilies/' + id)
        .then((response) => {
          if (response.status == 200) {
            setSubFamilies((current) => current.filter((c) => c.id !== id));
            toast.success('La sous-famille a bien été suprimmé');
          }
        })
        .catch(function () {
          toast.error("Une erreur est survenue lors de l'enregistrement");
        })
        .finally(toggleDeleteModal);
  };

  const openUpdateModal = (User: any) => {
    setSubFamilyToUpdate(User);
    toggleUpdateModal();
  };

  const handleCloseUpdateModal = (updatedSubFamily?: SubFamily) => {
    if (updatedSubFamily) {
      axios.get(process.env.API_URL + 'subfamilies').then((response) => {
        setSubFamilies(response.data)
      })
    }
    toggleUpdateModal();
  };

  const toggleUpdateModal = () => {
    setIsOpenUpdateModal(!isOpenUpdateModal);
  };

  const openDeleteModal = (id: string) => {
    setSubFamilyIdToDelete(id);
    toggleDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    setSubFamilyIdToDelete(undefined);
    toggleDeleteModal();
  };

  const toggleDeleteModal = () => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
  };

  return (
      <>
        <SubFamilyUpdateModal
            subfamily={subfamilyToUpdate}
            open={isOpenUpdateModal}
            onClose={handleCloseUpdateModal}
        />
        <DeleteModal
            open={isOpenDeleteModal}
            onClose={handleCloseDeleteModal}
            onDelete={() => deleteSubFamily(subfamilyIdToDelete)}
        />
        <HeaderNav />
        <div>
          <Card className="w-1/3 mx-auto mt-10">
            <CardBody className="text-center">
              <Typography color={'teal'} variant={'h3'}>
                Ajouter une sous-famille
              </Typography>
              <form onSubmit={handleSubmit(addSubFamily)} className="mt-2">
                <div className={'grid grid-cols-1 gap-3'}>
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

                  <div>
                    <Input
                        label="Nom de la sous-famille"
                        variant="outlined"
                        color="teal"
                        required
                        {...register('subfamilyName')}
                    />
                  </div>

                  <div>
                    <Button color="teal" fullWidth type="submit">
                      Ajouter la sous-famille
                    </Button>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
        <section className="mt-5">
          <table className="table w-1/3 mx-auto mt-5 p-4 bg-white shadow text-center text-gray-900 rounded-lg divide-y-2">
            <thead>
            <tr>
              <th className="p-4">Sous-famille</th>
              <th className="p-4">Famille</th>
              <th className="p-4">Modifier</th>
              <th className="p-4">Supprimer</th>
            </tr>
            </thead>
            <tbody className="divide-y-2">
            {subFamilies.map((subFamily) => (
                <tr key={subFamily.id}>
                  <td className="p-4">{subFamily.subfamilyName}</td>
                  <td className="p-4">{subFamily.family?.familyName}</td>
                  <td className='p-4'>
                    <Button
                        color="teal"
                        onClick={() => openUpdateModal(subFamily)}
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Button>
                  </td>
                  <td className="p-4">
                    <Button
                        onClick={() => openDeleteModal(subFamily.id)}
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
};

export default Subfamily;
