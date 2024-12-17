import { QrCodeIcon } from '@heroicons/react/20/solid';
import { Button, Card, CardBody } from '@material-tailwind/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import BikeUpdateModal from '../../../components/Bikes/BikesUpdateModal';
import HeaderNav from '../../../components/HeaderNav';
import QrModal from "../../../components/Qrcode/QrModal";
import { UserRole } from '../../../enums/UserRole';
import { ReplacementBike } from '../../../models/Remplacement_bike/Replacement_Bike';
import * as BikeService from '../../../services/BikeService';


const PieceList = () => {
    const { data: session, status } = useSession();
    const tableaHeaderElement = useRef<HTMLTableRowElement>(null);
    const [bikes, setBikes] = useState<ReplacementBike[]>([]);
    const [qrData, setQrData] = useState('');
    const [openQrModal, setOpenQrModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
    const [bikeToUpdate, setBikeToUpdate] = useState<any>();
  
    const handleQrModal = (data: string) => {
        setQrData(data);
        setOpenQrModal(true);
    };

    const openUpdateModal = (bike: ReplacementBike) => {
        setBikeToUpdate(bike);
        toggleUpdateModal();
    };

    const handleCloseUpdateModal = (
        updateBike?: ReplacementBike,
    ) => {
        if (updateBike) {
            setBikes((current)=>
            current.map((c)=>
            c.id === updateBike.id ? updateBike : c
            )
        );
        }
        toggleUpdateModal();
    };

    const toggleUpdateModal = () => {
        setIsOpenUpdateModal(!isOpenUpdateModal);
    };

    useEffect(() => {
        axios.get(process.env.API_URL +'Bikes').then((response) => {
            setBikes(response.data);
        });
    }, []);

    return (
        <>

            <BikeUpdateModal
                bikes={bikeToUpdate}
                open={isOpenUpdateModal}
                onClose={handleCloseUpdateModal}
            />


            <div className="bg-background h-screen  pt-5">
                <QrModal
                    data={qrData}
                    showModal={openQrModal}
                    setShowModal={setOpenQrModal}
                    text={qrData}
                />

                <HeaderNav />

                {session &&
                status === 'authenticated' &&
                session.token.role !== UserRole.USER && (
                    <div className="mx-auto flex justify-center mb-3">
                        <Card className="flex">
                            <CardBody>
                                <Link href="Bikes/Add">
                                    <Button
                                        color="teal"
                                        type="button"
                                        placeholder="Ajouter une pièce"
                                        size="lg"
                                        ripple={true}
                                    >
                                        Ajouter une pièce de velo
                                    </Button>
                                </Link>
                            </CardBody>
                        </Card>
                    </div>
                )}

                <table className="table mx-auto mt-5 p-4 bg-white shadow text-center text-gray-900 rounded-lg divide-y-2">
                    <thead>
                        <tr ref={tableaHeaderElement}>
                            <th className="p-4">ID</th>
                            <th className="p-4">Désignation</th>
                            <th className="p-4">Etat</th>
                            <th className="p-4">Modèle</th>
                            <th className="p-4">Poids (kg)</th>
                            <th className="p-4">Famille</th>
                            <th className="p-4">Marque de la pièce</th>
                            <th className="p-4">Prix neuf indicatif (€)</th>
                            <th className="p-4">Prix TTC (€) </th>
                            <th className="p-4">Info commentaire</th>
                            
                            {session &&
                            status === 'authenticated' &&
                            session.token.role !== UserRole.USER && (
                                <>
                                <th className="p-4">QR</th>
                                <th className="p-4">Modifier</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className='divide-y-2'>
                        {bikes.map((bike) => (
                            <tr key={bike.id}>
                                <td className="p-4">{bike.id}</td>
                                <td className="p-4">{bike.designation}</td>
                                <td className="p-4">{bike.state}</td>
                                <td className="p-4">{bike.model}</td>
                                <td className="p-4">{bike.weight}</td>
                                <td className="p-4">
                                    {bike.subfamily && bike.subfamily.family ? bike.subfamily.family.familyName : ''}
                                </td>
                                <td className="p-4">
                                    {bike.brand ? bike.brand.brandName : ''}
                                </td>
                                <td className="p-4">{bike.indicativePriceOfNewPiece}</td>
                                <td className="p-4">{bike.excludingTaxesPrice}</td>
                                <td className="p-4">{bike.comments}</td>
                                
                                {session &&
                                status === 'authenticated' &&
                                session.token.role !== UserRole.USER && (
                                    <>
                                    <td className="p-4">
                                        <Button
                                            color="teal"
                                            onClick={() => handleQrModal(bike.id.toString())}
                                        >
                                            <QrCodeIcon className="w-5" />
                                        </Button>
                                    </td><td className="p-2">
                                            <Button
                                                id="upDM"
                                                onClick={(event) => {
                                                    if (event.currentTarget.id === "upDM") {
                                                       openUpdateModal(bike);
                                                    }
                                                    event.stopPropagation();
                                                } }
                                                color="teal"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </Button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        
                        {!bikes.length && (
                            <tr>
                                <td colSpan={tableaHeaderElement.current?.childNodes.length} className="p-4">
                                    Aucun vélo trouvé
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
