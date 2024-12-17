import {
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    Typography
} from "@material-tailwind/react";
import React, {useEffect, useState, useRef} from "react";
import {ReplacementPiece} from "../../models/Replacement_piece/ReplacementPiece";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { useReactToPrint } from "react-to-print";

interface Props {
    data: any;
    open: boolean;
    onClose: () => any;
}
const OrderDetailModal = ({ data, open, onClose}: Props) => {

    const [replacementPieces, setReplacementPieces] = useState<ReplacementPiece[]>([]);

    useEffect(() => {
        setReplacementPieces(data)
    }, [data]);

    const componentRef = useRef();

    const handlePrint = useReactToPrint ({
        content:()=> componentRef.current,
    })

    return (
        <>
            <Dialog
                size="lg"
                open={open} handler={onClose}
                className="rounded-none">
                <DialogHeader className="justify-center">
                    <Typography variant="h2" className="text-background">
                        Détail de la commande Numéro : { data[0]?.order.id }
                    </Typography>
                </DialogHeader>
                <DialogBody className="justify-center">
                    <div className="flex flex-col">
                        <div ref={componentRef}>
                            <div className="page-break">
                                <p className="text-gray-900 text-3xl text-center">Détail de la commande Numéro : { data[0]?.order.id }</p>
                            </div>
                            <p className="text-xl text-black">
                                Commande créé par : { data[0]?.order.user.username }
                            </p>
                            <table className="table mx-auto mt-2 p-4 bg-white shadow text-center text-gray-900 rounded-none divide-y-2">
                                <thead>
                                <tr>
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Désignation Interne</th>
                                    <th className="p-2">Désignation Fournisseur</th>
                                    <th className="p-2">Allée</th>
                                    <th className="p-2">Colonne</th>
                                    <th className="p-2">Etagere</th>
                                    <th className="p-2">Emplacement</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y-2">
                                {replacementPieces?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-4"> {item.id} </td>
                                        <td className="p-4"> {item.designationInterne}</td>
                                        <td className="p-4"> {item.designationFournisseur}</td>
                                        <td className="p-4"> {item.storageLocation
                                            ? item.storageLocation.rowNumber
                                            : ''}</td>
                                        <td className="p-4"> {item.storageLocation
                                            ? item.storageLocation.columnNumber
                                            : ''}</td>
                                        <td className="p-4"> {item.storageLocation
                                            ? item.storageLocation.shelfNumber
                                            : ''}</td>
                                        <td className="p-4"> {item.storageLocation
                                            ? item.storageLocation.locationNumber
                                            : ''}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div>
                                <p className="mt-5 text-xl text-black">
                                    Commentaire :
                                </p>
                                <div className="border border-black">
                                    <p className="p-2 text-black text-lg">
                                        { data[0]?.order.comment }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row item-center justify-around w-full mt-5">
                            <Button onClick={handlePrint} className="flex item-center justify-center w-2/5" color="teal" variant="outlined">
                                <PrinterIcon strokeWidth={2} className="h-5 w-5 mr-5" />
                                Imprimer
                            </Button>
                            <Button onClick={onClose} className="w-2/5" color="teal">
                                Fermer
                            </Button>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    )
}
export default OrderDetailModal