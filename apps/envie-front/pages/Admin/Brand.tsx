import {
    Button,
    Card,
    CardBody,
    Input,
    Typography
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import BrandUpdateModal from '../../components/Brand/BrandUpdateModal';
import DeleteModal from "../../components/DeleteModal";
import HeaderNav from "../../components/HeaderNav";
import { Brand } from '../../models/Brand/Brand';

interface PostData {
    brandName: string
}

const Brand = () => {
    const { register, handleSubmit } = useForm<PostData>();
    const [brands, setBrands] = useState<any[]>([]);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [brandIdToDelete, setBrandIdToDelete] = useState<string>();
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [brandToUpdate, setBrandToUpdate] = useState<any>();

    const addBrand = (data: PostData) => {
        axios
        .post<any>(process.env.API_URL + 'brands', data)
        .then((response) => {
            if (response.status == 201) {
                setBrands(current => [response.data, ...current])
                toast.success('Votre marque a bien été ajouté');
            }
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de l\'enregistrement');
            });
        };
        
        const deleteBrand = (id?: string) => {
            axios
            .delete<any>(process.env.API_URL + 'brands/' + id)
            .then((response) => {
                if (response.status == 200) {
                    setBrands(current => current.filter((c) => c.id !== id))
                    toast.success('La marque a bien été supprimé')
                }
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la suppression de la marque');
            })
            .finally(toggleDeleteModal)
        }
        
        const openDeleteModal = (id: string) => {
            setBrandIdToDelete(id);
            toggleDeleteModal();
        }
        
        const handleCloseDeleteModal = () => {
            setBrandIdToDelete(undefined);
            toggleDeleteModal();
        }
        
        const toggleDeleteModal = () => {
            setIsOpenDeleteModal(!isOpenDeleteModal);
        }
        
        const openUpdateModal = (Brand : any) =>{
            setBrandToUpdate(Brand);
            toggleUpdateModal();
        }
        
        const handleCloseUpdateModal = (updatedBrand?: Brand) => {
            if (updatedBrand) {
                setBrands((current) => current.map((c) => c.id === updatedBrand.id ? updatedBrand : c));
            }
            toggleUpdateModal();
        }
        
        const toggleUpdateModal = () => {
            setIsOpenUpdateModal(!isOpenUpdateModal);
    }

    useEffect(() => {
        axios.get(process.env.API_URL + 'brands').then(response => {
            setBrands(response.data)
        });
    }, [])
    
    return (
        <>
            <BrandUpdateModal brand={brandToUpdate} open={isOpenUpdateModal} onClose={handleCloseUpdateModal}/>
            <DeleteModal open={isOpenDeleteModal} onClose={handleCloseDeleteModal} onDelete={() => deleteBrand(brandIdToDelete)}/>
            <HeaderNav />
            <div>
                <Card className="w-1/3 mx-auto mt-10">
                    <CardBody className="text-center">
                        <Typography color={"teal"} variant={"h3"}>Ajouter une marque</Typography>
                        <form onSubmit={handleSubmit(addBrand)} className="mt-2">
                            <div className={"grid grid-cols-1 gap-3"}>
                                <div>
                                    <Input
                                        label="Nom de la marque"
                                        variant="outlined"
                                        color="teal"
                                        required
                                        {...register('brandName')} />
                                </div>
                                <div>
                                    <Button
                                        color="teal"
                                        fullWidth
                                        type="submit"
                                    >
                                        Ajouter la marque
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
                            <th className="p-4">Marque</th>
                            <th className="p-4">Modifier</th>
                            <th className="p-4">Supprimer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2">
                        {brands.map((brand) => (
                            <tr key={brand.id}>
                                <td className="p-4">{brand.brandName}</td>
                                <td className="p-4">
                                    
                                    <Button onClick={() => openUpdateModal(brand)} color="teal">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </Button>
                                </td>
                                <td className="p-4">
                                    <Button onClick={() => openDeleteModal(brand.id)} color="red">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

export default Brand;