import { Typography, Button, Switch } from '@material-tailwind/react';
import Link from 'next/link';
import HeaderNav from "../../components/HeaderNav";
import { UserRole } from "../../enums/UserRole";
import { Order } from "../../models/Order/Order";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { XMarkIcon, ListBulletIcon, CheckIcon } from "@heroicons/react/24/outline";
import CancelModal from "../../components/Modal/CancelModal";
import ValidateModal from "../../components/Modal/ValidateModal";
import OrderDetailModal from "../../components/Modal/OrderDetailModal";

const OrderIndex = () => {
    const { data: session, status } = useSession();
    const [isOpenOrderDetailModal, setIsOpenOrderDetailModal] = useState<boolean>(false);
    const [isOpenCancelModal, setIsOpenCancelModal] = useState<boolean>(false);
    const [isOpenValidateModal, setIsOpenValidateModal] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<number>();
    const [orderIdToCancel, setOrderIdToCancel] = useState<number>();
    const [orderIdToValidate, setOrderIdToValidate] = useState<number>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [dataDetail, setDataDetail] = useState<any[]>([]);
    const [waitingStatus, setWaitingStatus] = useState<boolean>(true);
    const [inProgressStatus, setInProgressStatus] = useState<boolean>(true);
    const [reservedFullStatus, setReservedFullStatus] = useState<boolean>(true);
    const [reservedIncompleteStatus, setReservedIncompleteStatus] = useState<boolean>(true);
    const [deliveredStatus, setDeliveredStatus] = useState<boolean>(false);
    const [canceledStatus, setCanceledStatus] = useState<boolean>(false);

    useEffect(() => {
        let data = {"waiting": waitingStatus, "inProgress": inProgressStatus, "reservedFull": reservedFullStatus, "reservedIncomplete": reservedIncompleteStatus, "delivered":deliveredStatus , "canceled":canceledStatus};
                axios.post(process.env.API_URL + 'orders/filters', data).then((response) => {
                    console.log(response.data);
            setOrders(response.data);
        });
                }, [waitingStatus, inProgressStatus, reservedFullStatus, reservedIncompleteStatus, deliveredStatus, canceledStatus]);

    // useEffect(() => {
    //     axios.get(process.env.API_URL + 'orders/all').then((response) => {
    //         setOrders(response.data);
    //     });
    // }, []);

    const openCancelModal = (id: number) => {
        setOrderIdToCancel(id);
        toggleCancelModal();
    };

    const handleCloseCancelModal = () => {
        toggleCancelModal();
    };

    const toggleCancelModal = () => {
        setIsOpenCancelModal(!isOpenCancelModal);
    };

    const openValidateModal = (id: number) => {
        setOrderIdToValidate(id);
        toggleValidateModal();
    };

    const handleCloseValidateModal = () => {
        toggleValidateModal();
    };

    const toggleValidateModal = () => {
        setIsOpenValidateModal(!isOpenValidateModal);
    };
    const openOrderDetailModal = (id?: number) => {
        setOrderId(id);
        axios
            .get(process.env.API_URL + 'orders/' + id)
            .then((response) => {
                if (response.status == 200) {
                    setDataDetail(response.data);
                }
            })
        toggleOrderDetailModal();
    };

    const handleCloseOrderDetailModal = () => {
        toggleOrderDetailModal();
    };

    const toggleOrderDetailModal = () => {
        setIsOpenOrderDetailModal(!isOpenOrderDetailModal);
    };

    const onCancel = (id?: number) => {
        axios
            .patch(process.env.API_URL + 'orders/cancel/' + id)
            .then((response) => {
                if (response.status == 200) {
                    axios.get(process.env.API_URL + 'orders/all').then((response) => {
                        setOrders(response.data);
                    });
                    toast.success("La commande a bien été annulée");
                }
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de l\'annulation de la commande');
            })
            .finally(handleCloseCancelModal());
    };
    const onValidate = (id?: number) => {
        axios
            .patch(process.env.API_URL + 'orders/deliver/' + id)
            .then((response) => {
                if (response.status == 200) {
                    axios.get(process.env.API_URL + 'orders/all').then((response) => {
                        setOrders(response.data);
                    });
                    toast.success("La commande a bien été livrée");
                }
            })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la livraison de la commande');
            })
            .finally(handleCloseValidateModal());
    };

    return (
        <div className="bg-background h-screen  pt-5">

            <CancelModal open={isOpenCancelModal} onClose={handleCloseCancelModal} onCancel={() => onCancel(orderIdToCancel)}/>

            <ValidateModal open={isOpenValidateModal} onClose={handleCloseValidateModal} onValidate={() => onValidate(orderIdToValidate)}/>

            <OrderDetailModal open={isOpenOrderDetailModal} onClose={handleCloseOrderDetailModal} data={dataDetail}/>

            <HeaderNav/>

            <div className="mx-auto max-w-screen-xl mr-50 ml-50 mb-5 flex justify-center">
                <Link href="Order/Create">
                    <Button
                        color="white"
                        size="lg"
                        variant="outlined">
                        Passer une commande
                    </Button>
                </Link>
            </div>

            <section className="mx-auto max-w-screen-xl mr-50 ml-50 mt-5 mb-5">
                <div className="mx-auto w-10/12 mr-50 ml-50 flex items-center bg-white bg-opacity-100 h-16 p-2">
                    <div className="w-max gap-3 flex mx-auto">
                        <Switch onChange={(event) => {setWaitingStatus(event?.target.checked)}} id="waiting" color="red" label={
                            <div className="flex text-center">
                                <Typography color="black" className="font-normal">
                                    En Attente
                                </Typography>
                            </div>
                        } defaultChecked />
                        <Switch onChange={(event) => {setInProgressStatus(event?.target.checked)}} id="inProgress" color="orange" label={
                            <div className="flex text-center">
                                <Typography color="black" className="font-normal">
                                    En préparation
                                </Typography>
                            </div>
                        } defaultChecked />
                        <Switch onChange={(event) => {setReservedFullStatus(event?.target.checked)}} id="reservedFull" color="lime" label={
                            <div className="flex text-center">
                                <Typography color="black" className="font-normal">
                                    Réservée incomplete
                                </Typography>
                            </div>
                        } defaultChecked />
                        <Switch onChange={(event) => {setReservedIncompleteStatus(event?.target.checked)}} id="reservedIncomplete" color="green" label={
                            <div className="flex text-center">
                                <Typography color="black" className="font-normal">
                                    Réservée complete
                                </Typography>
                            </div>
                        } defaultChecked />
                        <Switch onChange={(event) => {setDeliveredStatus(event?.target.checked)}} id="delivered" color="teal" label={
                            <div className="flex text-center">
                                <Typography color="black" className="font-normal">
                                    Livrée
                                </Typography>
                            </div>
                        }  />
                        <Switch onChange={(event) => {setCanceledStatus(event?.target.checked)}} id="canceled" color="gray" label={
                            <div className="flex text-center">
                                <Typography color="black" className="font-normal">
                                    Annulée
                                </Typography>
                            </div>
                        }  />
                    </div>
                </div>
            </section>


            <section className="mx-auto max-w-screen-xl mr-50 ml-50 mt-5 mb-5">
                <table className="table w-10/12 mx-auto mt-5 p-4 bg-white shadow text-center text-gray-900 rounded-none divide-y-2 mb-10">
                    <thead>
                    <tr>
                        <th className="p-4">Id</th>
                        <th className="p-4">Crée</th>
                        {session &&
                            status === "authenticated" &&
                            (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                <th className="p-4">Par</th> )}
                        <th className="p-4">Statut</th>
                        {session &&
                            status === "authenticated" &&
                            (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                <th className="p-4">Details</th> )}
                        {session &&
                            status === "authenticated" &&
                            (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                <th className="p-4">Livrer</th> )}
                        {session &&
                            status === "authenticated" &&
                            (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                <th className="p-4">Annuler</th> )}
                    </tr>
                    </thead>
                    <tbody className="divide-y-2">
                    {orders
                        .map((order) => (
                            <tr key={order.id}>
                                <td className="p-4">{order.id}</td>
                                <td className="p-4">Le {new Date(order.createdAt).toLocaleDateString()} à {new Date(order.createdAt).toLocaleTimeString()}</td>
                                {session &&
                                    status === "authenticated" &&
                                    (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                        <td className="p-4">
                                            {order.user.username}
                                        </td>
                                    )}
                                <td className="p-4">
                                    {order.status === "waiting" ? "En Attente" : order.status === "in_progress" ? "En préparation" :
                                        order.status === "reserved_incomplete" ? "Réservée incomplete" : order.status === "reserved_full" ? "Réservée complete" :
                                            order.status === "delivered" ? "Livrée" : "Annulée"}
                                </td>
                                {session &&
                                    status === "authenticated" &&
                                    (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                        <td className="p-4">
                                            <Button
                                                onClick={() => openOrderDetailModal(order.id)}
                                                color="teal"
                                                size="sm">
                                                <ListBulletIcon strokeWidth={2} className="h-5 w-5" />
                                            </Button>
                                        </td> )}
                                {session &&
                                    status === "authenticated" &&
                                    (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                        <td className="p-4">
                                            <Button
                                                onClick={() => openValidateModal(order.id)}
                                                size="sm"
                                                color="green">
                                                <CheckIcon strokeWidth={2} className="h-5 w-5" />
                                            </Button>
                                        </td> )}
                                {session &&
                                    status === "authenticated" &&
                                    (session.token.role === UserRole.ADMIN || session.token.role === UserRole.SUPER_ADMIN  || session.token.role === UserRole.WAREHOUSEMAN) && (
                                        <td className="p-4">
                                            <Button
                                                onClick={() => openCancelModal(order.id)}
                                                size="sm"
                                                color="red">
                                                <XMarkIcon strokeWidth={2} className="h-5 w-5" />
                                            </Button>
                                        </td> )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>



        </div>
    );
};

export default OrderIndex;
