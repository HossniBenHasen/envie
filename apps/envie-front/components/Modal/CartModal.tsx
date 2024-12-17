 import {
     Button, Dialog,
    DialogBody,
    DialogHeader
} from "@material-tailwind/react";
 import React, {useEffect, useState} from "react";
 import {ReplacementPiece} from "../../models/Replacement_piece/ReplacementPiece";
 import * as ReplacementPieceService from "../../services/ReplacementPieceService";
 import axios from "axios";
 import {session} from "next-auth/core/routes";
 import {useSession} from "next-auth/react";
 import {json} from "stream/consumers";
 import {log} from "util";
 import {UserRole} from "../../enums/UserRole";
 import {XMarkIcon} from "@heroicons/react/24/outline";
 import toast from "react-hot-toast";
 import DeleteModal from "../DeleteModal";

 interface Props {
     cart: any;
     open: boolean;
     onClose: () => any;
 }
 const CartModal = ({ cart, open, onClose}: Props) => {

     const [itemToDelete, setItemToDelete] = useState<number>();
     const [isOpendDeleteModal, setIsOpendDeleteModal] = useState<boolean>(false);
     const [replacementPieces, setReplacementPieces] = useState<ReplacementPiece[]>([]);
     const {data: session, status} = useSession();


     // const openDeleteModal = (id: number) => {
     //     setItemToDelete(id);
     //     toggleDeleteModal()
     // }
     //
     // const handleCloseDeleteModal = () => {
     //     toggleDeleteModal()
     // }
     //
     // const toggleDeleteModal = () => {
     //     setIsOpendDeleteModal(!isOpendDeleteModal);
     // }


     useEffect(() => {
         setReplacementPieces(cart);
         console.log(replacementPieces)
         console.log(cart)
     }, [cart]);


     const orderURL = process.env.API_URL + 'orders/';
     const [comment, setComment] = useState('');

     const checkoutCartToOrderForm = () => {
         let extractedIdsFromCart: any[] = [];
         for (let el of cart) {
             extractedIdsFromCart.push(el.id)
         }
         const data = {
             "userId": session?.token.id,
             "comment": comment,
             "replacementPieces": extractedIdsFromCart,
         }
            axios
                 .post(orderURL, data)
                 .then((response) => {
                     toast.success('Votre commande a été enregistrée avec succès');
                     setReplacementPieces([]);
                     cart = [];
                     onClose();
                 })
     };

         if (replacementPieces === undefined) {
             return <>Still loading...</>
         }

         return (
             <>

                 <Dialog
                     size="xl"
                     open={open}
                     handler={onClose}
                     className="rounded-none">
                     <DialogHeader className="justify-center">
                         Detail du panier
                     </DialogHeader>
                     <DialogBody className="justify-center">
                         <div className="flex flex-col">
                             <div>
                                 <table
                                     className="table mx-auto mt-2 p-4 bg-white shadow text-center text-gray-900 rounded-none divide-y-2">
                                     <thead>
                                     <tr>
                                         <th className="p-2">ID</th>
                                         <th className="p-4">Serial Number</th>
                                         <th className="p-2">Désignation Interne</th>
                                         <th className="p-2">Désignation Fournisseur</th>
                                         <th className="p-2">Fournisseur</th>
                                         <th className="p-2">Reférence</th>
                                         <th className="p-2">Etat</th>
                                         <th className="p-2">Poids (kg)</th>
                                         {/*<th className="p-2">Famille</th>*/}
                                         {/*<th className="p-2">Marque</th>*/}
                                         {/*<th className="p-2">Entreprise</th>*/}
                                     </tr>
                                     </thead>
                                     <tbody className="divide-y-2">
                                     {replacementPieces.map((item) => (
                                         <tr key={item.id}>
                                             <td className="p-4"> {item.id} </td>
                                             <td className="p-4"> {item.serialNumber}</td>
                                             <td className="p-4"> {item.designationInterne}</td>
                                             <td className="p-4"> {item.designationFournisseur}</td>
                                             <td className="p-4"> {item.supplier}</td>
                                             <td className="p-4"> {item.manufacturerReferenceOfPiece}</td>
                                             <td className="p-4"> {item.state}</td>
                                             <td className="p-4"> {item.weight}</td>
                                             {/*<td className="p-4"> {item.family}</td>*/}
                                             {/*<td className="p-4"> {item.brand}</td>*/}

                                             {/*{session &&*/}
                                             {/*    status === "authenticated" &&*/}
                                             {/*    session.token.role !== UserRole.USER && (*/}
                                             {/*        <td className="p-4">*/}
                                             {/*            <Button*/}
                                             {/*                onClick={() => onDelete(item.id)}*/}
                                             {/*                size="sm"*/}
                                             {/*                color="red">*/}
                                             {/*                <XMarkIcon strokeWidth={2} className="h-5 w-5"/>*/}
                                             {/*            </Button>*/}
                                             {/*        </td>*/}
                                             {/*    )}*/}
                                         </tr>
                                     ))}
                                     </tbody>
                                 </table>

                             </div>
                             <div className="flex flex-col item-center justify-center w-full mt-5">
                                 <input name="comment" value={comment} placeholder={'Commentaire optionnel'}
                                        onChange={e => setComment(e.target.value)}
                                        className="border border-black rounded-lg p-2"/>
                                 <div className="flex flex-row item-center justify-around w-full mt-5">
                                     <Button onClick={onClose} className="w-2/5" color="teal">
                                         Fermer
                                     </Button>
                                     <Button onClick={checkoutCartToOrderForm} className="w-2/5" color="teal">
                                         Valider panier
                                     </Button>
                                 </div>
                             </div>
                         </div>
                     </DialogBody>
                 </Dialog>
             </>
         )
 }
 export default CartModal
