import { PlusIcon, QrCodeIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {
    Button,
} from '@material-tailwind/react';
import Select from 'react-select';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import toast, { Toast } from 'react-hot-toast';
import HeaderNav from '../../../components/HeaderNav';
import PieceHistoryModal from '../../../components/PieceHistory/PieceHistoryModal';
import { UserRole } from '../../../enums/UserRole';
import { Preparation } from '../../../models/Preparation/Preparation';
import { ReplacementPiece } from '../../../models/Replacement_piece/ReplacementPiece';
import { Storage } from '../../../models/Storage/Storage';
import React from "react";
import CartModal from "../../../components/Modal/CartModal";
import {Brand} from "../../../models/Brand/Brand";
import {Family} from "../../../models/Family/Family";


const PieceList = () => {
    const { data: session, status } = useSession();
    const tableaHeaderElement = useRef<HTMLTableRowElement>(null);
    const [replacementsPieces, setReplacementsPieces] = useState<ReplacementPiece[]>([]);
    const [company, setCompany] = useState<Storage[]>([]);
    const [isOpenPieceHistoryModal, setIsOpenPieceHistoryModal] = useState<boolean>(false);
    const [replacementPieceId, setReplacementPieceId] = useState<number>();
    const [selectedPreparation, setSelectedPreparation] = useState<Preparation>();
    const [isOpenCartModal, setIsOpenCartModal] = useState<boolean>(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandType, setBrandType] = useState<string>('');
    const [families, setFamilies] = useState<Family[]>([]);
    const [familyType, setFamilyType] = useState<string>('');
    const [internalDesignations, setInternalDesignationss] = useState<Family[]>([]);
    const [selectedInternalDesignation, setselectedInternalDesignation] = useState<string>('');

    const openPieceHistoryModal = (ReplacementPieceId?: number, Reference?: string) => {
        setReplacementPieceId(ReplacementPieceId);
        togglePieceHistoryModal();
    };

    const handleClosePieceHistoryModal = () => {
        setReplacementPieceId(undefined);
        togglePieceHistoryModal();
    };

    const togglePieceHistoryModal = () => {
        setIsOpenPieceHistoryModal(!isOpenPieceHistoryModal);
    };

    const openCartModal = () => {
        toggleCartModal();
    };

    const selectBrand = (e: any) => {
        setBrandType(e);
    };
    const selectFamily = (e: any) => {
        setFamilyType(e);
    };
    const selectInternalDesignation = (e: any) => {
        setselectedInternalDesignation(e);
    };

    const handleCloseCartModal = () => {
        setReplacementPieceId(undefined);
        toggleCartModal();
    };

    const toggleCartModal = () => {
        setIsOpenCartModal(!isOpenCartModal);
    };

    const initialState: any[] | (() => any[]) = [];
    const [cart, setCart] = useState(initialState);
    const handleClick = (itemAddedToCart: ReplacementPiece) => {
        setCart(current => [...current, itemAddedToCart]);
    }

    const addToCart = (replacementPiece: ReplacementPiece) => {
        const data = {
            userId: session?.token.id,
            replacementPiecesId: [replacementPiece.id],
        };

        axios
            .patch(process.env.API_URL + 'preparation/' + selectedPreparation?.id, data)
            .then((data) => {
                toast.success(
                    (t: Toast) => (
                        <div className="flex items-center gap-4">
                            <span>Votre article a été ajouté !</span>
                            <section className="flex gap-2 text-white">
                                <Link href={"/Summary"}>
                                    <Button color="teal">
                                        Voir les préparations
                                    </Button>
                                </Link>
                                <Button
                                    color="teal"
                                    onClick={() => toast.dismiss(t.id)}
                                >
                                    <XMarkIcon className="w-5" />
                                </Button>
                            </section>
                        </div>
                    )
                );
            })
            .catch((error) => {
                toast.error('Une erreur est survenue');
            });
    }
    useEffect(() => {
        let internalDesignation = selectedInternalDesignation ? selectedInternalDesignation.value : "";
        let brand = brandType ? brandType.value : null;
        let family = familyType ? familyType.value : null;
        let data = {"companyId": session?.token.company.id, "designationInterne": internalDesignation, "brandId": brand, "familyId": family};
        axios.post(process.env.API_URL + 'replacements-pieces/filters', data).then((response) => {
            setReplacementsPieces(response.data);
        });
    }, [selectedInternalDesignation, brandType, familyType]);

    useEffect(() => {
        // Récupération des pièces lors du chargement de la page
        axios.post(process.env.API_URL + 'replacements-pieces/filters').then((response) => {
            setReplacementsPieces(response.data);
        });
        // Récupération des companies
        axios.get(process.env.API_URL + 'companies').then((response) => {
            setCompany(response.data);
        });
        // Récupération des familles
        axios.get(process.env.API_URL + 'families/activity-type/1').then((response) => {
            setFamilies(response.data);
        });
        // Récupération des marques
        axios.get(process.env.API_URL + 'brands').then((response) => {
            setBrands(response.data);
        });
        // Récupération des designations interne
        axios.get(process.env.API_URL + 'replacements-pieces/designation').then((response) => {
            setInternalDesignationss(response.data);
        });
    }, []);

    return (
        <>
            <PieceHistoryModal
                replacementPieceId={replacementPieceId}
                open={isOpenPieceHistoryModal}
                onClose={handleClosePieceHistoryModal}
            />

            <CartModal
                cart={cart}
                open={isOpenCartModal}
                onClose={handleCloseCartModal}
            />

            <div className="bg-background h-screen pt-5">
                <HeaderNav />
                <div className="flex gap-2 w-3/4 mx-auto mb-1 bg-white p-2 rounded-none justify-around" style={{color: "black"}}>
                    <div className="w-1/4">
                        <Select
                            name="selectInternalDesignation"
                            options={internalDesignations.map((designation) => ({ value: designation.designationInterne, label: designation.designationInterne }))}
                            onChange={selectInternalDesignation}
                            placeholder={'Sélectionner la désignation interne'}
                            isClearable={true}
                        />
                    </div>
                    <div className="w-3/8">
                        <Select
                            name="selectBrand"
                            options={brands.map((brand) => ({ value: brand.id, label: brand.brandName }))}
                            onChange={selectBrand}
                            placeholder={'Sélectionner la marque de la machine'}
                            isClearable={true}
                        />
                    </div>
                    {/*<div className="w-3/8">*/}
                    {/*    <Select*/}
                    {/*        color="gray-500"*/}
                    {/*        name="selectFamily"*/}
                    {/*        options={families.map((family) => ({ value: family.id, label: family.familyName }))}*/}
                    {/*        onChange={selectFamily}*/}
                    {/*        placeholder={'Sélectionner la famille de produit' }*/}
                    {/*        isClearable={true}*/}

                    {/*    />*/}

                    {/*</div>*/}
                  {/*test mise en place bouton "panier"*/}
                    <div className="w-2/8 flex justify-around">
                        <Button onClick={openCartModal} color="teal">
                            Voir mon Panier
                        </Button>
                    </div>
                </div>
                <table className="table w-3/4 mx-auto mt-2 p-2 bg-white shadow text-center text-gray-900 rounded-none divide-y-2">
                    <thead>
                    <tr ref={tableaHeaderElement}>
                        <th className="p-2">ID</th>
                        <th className="p-2">Désignation Interne</th>
                        <th className="p-2">Désignation Fournisseur</th>
                        <th className="p-2">Fournisseur</th>
                        <th className="p-2">Reférence</th>
                        <th className="p-2">Etat</th>
                        {/*<th className="p-2">Famille</th>*/}
                        <th className="p-2">Marque</th>
                        <th className="p-2">Entreprise</th>
                        {session &&
                            status === "authenticated" &&
                            session.token.role !== UserRole.USER && (
                                    <th className="p-2">Ajouter au Panier</th>
                            )}
                    </tr>
                    </thead>
                    <tbody className="divide-y-2">
                    {replacementsPieces
                        .map((replacementPiece) => (
                            <tr key={replacementPiece.id} className="hover:bg-gray-100 hover:cursor-pointer" id="row" onClick={(event) => {
                                if (event.currentTarget.id === 'row') {
                                    openPieceHistoryModal(replacementPiece.id)
                                }
                                event.stopPropagation()
                            }} >
                                <td className="p-2"> {replacementPiece.id}</td>
                                <td className="p-2">{replacementPiece.designationInterne}</td>
                                <td className="p-2">{replacementPiece.designationFournisseur}</td>
                                <td className="p-2">{replacementPiece.supplier}</td>
                                <td className="p-2">
                                    {replacementPiece.manufacturerReferenceOfPiece}
                                </td>
                                <td className="p-2">{replacementPiece.state}</td>
                                {/*<td className="p-2">*/}
                                {/*    {replacementPiece.subfamily &&*/}
                                {/*    replacementPiece.subfamily.family*/}
                                {/*        ? replacementPiece.subfamily.family.familyName*/}
                                {/*        : ''}*/}
                                {/*</td>*/}
                                <td className="p-2">
                                    {replacementPiece.brand
                                        ? replacementPiece.brand.brandName
                                        : ''}
                                </td>

                                <td className="p-2">
                                    {replacementPiece.company
                                        ? replacementPiece.company.name
                                        : ''}
                                </td>
                                {session &&
                                    status === "authenticated" &&
                                    session.token.role !== UserRole.USER && (
                                        <td className="p-2">
                                            <Button
                                                id="odr"
                                                color="teal"
                                                onClick={(event) => {
                                                    if (event.currentTarget.id === 'odr') {
                                                        toast.success('Pièce ajoutée au panier');
                                                        handleClick(replacementPiece)
                                                    }
                                                    event.stopPropagation()
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                                </svg>

                                            </Button>
                                        </td>
                                    )}
                            </tr>
                        ))}

                    {!replacementsPieces && (
                        <tr>
                            <td colSpan={tableaHeaderElement.current?.childNodes.length} className="p-2">
                                Aucune pièce trouvée
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
};


export default PieceList;
