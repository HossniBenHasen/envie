import {Button, Card, CardBody, Input, Option, Select, Typography} from '@material-tailwind/react';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import DeleteModal from '../../components/DeleteModal';
import HeaderNav from '../../components/HeaderNav';
import FamilyUpdateModal from '../../components/Family/FamilyUpdateModal';
import {Family} from '../../models/Family/Family';


type PostData = {
  familyName: string;
  activityType: string;
};

const Family = () => {
  const { register, handleSubmit } = useForm<PostData>();
  const [family, setFamily] = useState<any[]>([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [familyIdToDelete, setFamilyIdToDelete] = useState<string>();
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
  const [familyToUpdate, setFamilyToUpdate] = useState<any>();

  useEffect(() => {
    axios.get(process.env.API_URL  + 'families').then((response) => {
      setFamily(response.data);
    });
  }, []);


  const addFamily = (data: PostData) => {
    data.activityType = type;
    axios
      .post(process.env.API_URL  + 'families', data)
      .then((response) => {
        if (response.status == 201) {
          setFamily((current) => [response.data, ...current]);
          toast.success('La famille a bien été ajouté');
        }
      })
      .catch(() => {
        toast.error("Une erreur est survenue lors de l'enregistrement");
      });
  };

  const deleteFamily = (id?: string) => {
    axios
      .delete<any>(process.env.API_URL  + 'families/' + id)
      .then((response) => {
        if (response.status == 200) {
          setFamily((current) => current.filter((c) => c.id !== id));
          toast.success('La famille a bien été supprimé');
        }
      })
      .catch(() => {
        toast.error("Une erreur est survenue lors de la suppression");
      })
      .finally(toggleDeleteModal);
  };

  const openUpdateModal = (operator : any) =>{
    setFamilyToUpdate(operator);
    toggleUpdateModal();
  }

  const handleChange = (e: any) => {
    setType(e);
  };

  const [type, setType] = useState('');


  const handleCloseUpdateModal = (updatedFamily?: Family) => {
    if (updatedFamily) {
      setFamily((current) => current.map((c) => c.id === updatedFamily.id ? updatedFamily : c));
    }
    toggleUpdateModal();
  }

  const toggleUpdateModal = () => {
    setIsOpenUpdateModal(!isOpenUpdateModal);
  }

  const openDeleteModal = (id: string) => {
    setFamilyIdToDelete(id);
    toggleDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    setFamilyIdToDelete(undefined);
    toggleDeleteModal();
  };

  const toggleDeleteModal = () => {
    setIsOpenDeleteModal(!isOpenDeleteModal);
  };

  return (
    <>
      <FamilyUpdateModal family={familyToUpdate} open={isOpenUpdateModal} onClose={handleCloseUpdateModal}/>
      <DeleteModal open={isOpenDeleteModal} onClose={handleCloseDeleteModal} onDelete={() => deleteFamily(familyIdToDelete)}/>
      <HeaderNav/>
      <div>
        <Card className="w-1/3 mx-auto mt-10">
          <CardBody className="text-center">
            <Typography color={'teal'} variant={'h3'}>
              Ajouter une famille
            </Typography>
            <form onSubmit={handleSubmit(addFamily)} className="mt-2">
              <div className={'grid grid-cols-1 gap-3'}>
                <div>
                  <Input
                    label="Nom de la famille"
                    variant="outlined"
                    color="teal"
                    required
                    {...register('familyName')}
                  />
                </div>
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
                <div>
                  <Button color="teal" fullWidth type="submit">
                    Ajouter la famille
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
              <th className="p-4">Famille</th>
              <th className="p-4">Type de piece</th>
              <th className="p-4">Modifier</th>
              <th className="p-4">Supprimer</th>
            </tr>
          </thead>
          <tbody className="divide-y-2">
            {family.map((listValue) => (
              <tr key={listValue.id}>
                <td className="p-4">{listValue.familyName}</td>
                <td className="p-4">{listValue.activityType}</td>
                <td className="p-4">
                  <Button 
                    onClick={() => openUpdateModal(listValue)}
                  color="teal">

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
                    onClick={() => openDeleteModal(listValue.id)}
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

export default Family;
