import{
    Button,
    Card,
    CardBody,
    Select,
    Input,
    Typography,
    Option,
} from '@material-tailwind/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import DeleteModal from '../../components/DeleteModal';
import HeaderNav from '../../components/HeaderNav';
import { User } from '../../models/User/User';
import { UserRole } from '../../enums/UserRole';
import { Company } from '../../models/Company/Company';
import { useSession } from 'next-auth/react';



type PostData = {
    username: string;
    password: string;
    role: UserRole;
    companyId: number;
};

const User = () => {
    const { data: session, status } = useSession();
    const {register, handleSubmit, resetField } = useForm<PostData>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const [users, setUsers] = useState<User[]>([]);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [userToUpdate, setUserToUpdate] = useState<any>();
    const [userIdtoDelete, setUserIdToDelete] = useState<string>();
    const [selectedRole,setSelectedRole] = useState<UserRole>(UserRole.USER);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<number>(0);

    const onSubmit = (data: PostData) => {
        data.role = selectedRole;
        data.companyId = selectedCompany;

        axios
            .post(process.env.API_URL + 'users', data)
            .then((response) => {
                if (response.status == 201) {
                    setUsers((current) => [response.data, ...current]);
                    toast.success("L'utilisateur a bien été ajouté");
                }
            })
            .catch(function (error) {
                toast.error(error.response.data.message[0]);
            });
        resetField('password');
        resetField('username');
    }

    const onDelete = (id?: string) => {
        axios
            .delete<any>(process.env.API_URL + 'users/' + id)
            .then((response) => {
                if (response.status == 200) {
                    setUsers((current) => current.filter((c) => c.id !== id));
                    toast.success("L'utilisateur a bien été supprimé");
                }
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la suppression de user');
            })
            .finally(toggleDeleteModal);
    };


    const selectRole = (e: any) => {
        setSelectedRole(e);
    }

    const selectCompany = (e:any) => {
        setSelectedCompany(parseInt(e))
    }

    const openUpdateModal = (user: User) => {
        setUserToUpdate(user);
        toggleUpdateModal();
    };

    const toggleUpdateModal = () => {
        setIsOpenUpdateModal(!isOpenUpdateModal);
    };

    const openleDeleteModal = (id: string) => {
        setUserIdToDelete(id);
        toggleDeleteModal();
    };

    const handleCloseDeleteModal = () => {
        toggleDeleteModal();
        setUserIdToDelete(undefined);
    };

    const toggleDeleteModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    useEffect(() => {
        axios.get(process.env.API_URL + 'users').then((response) => {
            setUsers(response.data);
        });

        axios.get(process.env.API_URL + 'companies').then((response) => {
            setCompanies(response.data);
        });
    }, []);

    return (
        <>
            <DeleteModal open={isOpenDeleteModal} onClose={handleCloseDeleteModal} onDelete={() => onDelete(userIdtoDelete)}/>

            <HeaderNav/>
            <div>
                <Card className="w-1/3 mx-auto mt-10">
                    <CardBody className="text-center">
                        <Typography variant="h3" color="teal">
                            Ajouter un utilisateur
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Input
                                        label="Nom d'utilisateur"
                                        variant="outlined"
                                        color="teal"
                                        required
                                        {...register('username')}
                                    />
                                </div>
                                <div >
                                    <Input
                                        label="Mot de passe"
                                        variant="outlined"
                                        color="teal"
                                        type="password"
                                        required
                                        {...register('password')}
                                    />
                                </div>
                                <div >
                                    <Select
                                        label="Role"
                                        {...register('role')}
                                        onChange={selectRole}
                                    >
                                        {session &&
                                        status === 'authenticated' &&
                                        session.token.role === UserRole.SUPER_ADMIN ? (
                                            <Option value="super-admin">Super-Admin</Option>
                                        ) : ''}
                                        {session && status === 'authenticated' && session.token.role === UserRole.SUPER_ADMIN ? (
                                            <Option value="admin">Admin</Option>
                                        ) : ''}
                                        <Option value="warehouseman">Magasinier</Option>
                                        <Option value="operator">Operator</Option>
                                        <Option value="user">User</Option>
                                    </Select>
                                </div>
                                <div>
                                    <Select
                                        label="Company"
                                        {...register('companyId', {
                                            valueAsNumber: true,
                                        })}
                                        onChange={selectCompany}
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
                                <div>
                                    <Button color="teal" fullWidth type="submit">
                                        Ajouter un utilisateur
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
                        <th className="p-4">Nom d'utilisateur</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Entreprise</th>
                        <th className="p-4">Modifier</th>
                        <th className="p-4">Supprimer</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="p-4">{user.username}</td>
                            <td className="p-4">
                                {user.role === UserRole.SUPER_ADMIN && "Super Admin"}
                                {user.role === UserRole.ADMIN && "Administrateur"}
                                {user.role === UserRole.WAREHOUSEMAN && "Magasinier"}
                                {user.role === UserRole.OPERATOR && "Opérateur"}
                                {user.role === UserRole.USER && "Utilisateur"}
                            </td>
                            <td className="p-4">{user.company?.name}</td>
                            <td className="p-4">
                                <Button
                                    onClick={() => openUpdateModal(user)}
                                    color="teal"
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
                                    onClick={() => openleDeleteModal(user.id)}
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
export default User;


