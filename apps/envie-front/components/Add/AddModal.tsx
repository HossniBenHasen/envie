import { useEffect, useState, useRef } from 'react';
import {Button, Dialog, DialogBody, DialogHeader} from "@material-tailwind/react";
import { ReplacementPiece } from "../../models/Replacement_piece/ReplacementPiece";
import { PrintRemplacementPiece} from "../../models/Replacement_piece/PrintRemplacementPiece";
import { useForm } from "react-hook-form";
import * as QrcodeService from "../../services/QrcodeService";
import * as ReplacementPieceService from "../../services/ReplacementPieceService";
import login from "../../pages/Login";
import {json} from "stream/consumers";

interface Props {
    data: any;
    open: boolean;
    onClose: () => any;
}

const AddModal = ({ data, open, onClose }: Props) => {
    // const replacementPieces: PrintRemplacementPiece[] = Array.from(data);
    const replacementPieces: any = data;


    const {handleSubmit, setValue, watch, resetField,formState: { isValid } } = useForm<PrintRemplacementPiece[]>({
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const [replacementsPieces, setReplacementPiece] = useState<ReplacementPiece[]>([]);
    const tableHeaderElement = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        if (data !== undefined || null){
            for(let item of data){
                setReplacementPiece(item);
        }};
    }, [data]);
    // setReplacementsPieces(prevArray => [...prevArray, data]);


    const generateQrCodes = async (data: any) =>{

// Création d'un iframe pour l'imprimer plus tard
        const iframe = document.createElement("iframe");
        iframe.width = "0";
        iframe.height = "0";
        iframe.style.visibility = "hidden";
        iframe.setAttribute("srcdoc", "<html><body></body></html>");
        document.body.appendChild(iframe);

        iframe.addEventListener("load", async () => {
            if (!iframe.contentDocument || !iframe.contentWindow) {
                return;
            }

            // Ajout de style au body de l'iframe pour agencer les qr codes en grille
            iframe.contentDocument.body.setAttribute("style", "display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); grid-column-gap: 40px;");


            // On récupère les qr codes qu'on veut imprimer
            replacementPieces[0].map(piece => {
                // On crée le qr code
                const qrcode = QrcodeService.createQrcode(String(piece.id));
                qrcode.setAttribute("style", "padding-top: 27px; with: 100%");

                //on crée le code d'adressage
                const codeAdressage = document.createElement("div");
                codeAdressage.innerText =`${piece.id} ${piece.designationInterne}`;
                codeAdressage.setAttribute("style", "margin: 0; padding-bottom: 45.4px;");


                // On créé une div pour contenir le qr code et son id
                const div = document.createElement("div");
                div.setAttribute("style", "text-align: left; margin-left: 15px ;");
                div.appendChild(qrcode);
                div.appendChild(codeAdressage);
                iframe.contentDocument?.body.appendChild(div);
            })

            // On attend 1 seconde, ça résout un problème qui n'affichait pas les qr code correctement
            await new Promise(resolve => {
                setTimeout(resolve, 1000)
            })

            // On imprime l'iframe
            iframe.contentWindow?.print()

            // Quand on ferme la popup d'impression, on supprime l'iframe
            // iframe.contentWindow?.addEventListener("afterprint", () =>
            //     document.body.removeChild(iframe)
            // );
        })
    }



    return (
        <>
            <Dialog size = "xl"  open={open} handler={onClose}>
                <DialogHeader className="justify-center">
                    Liste des pieces ajoutées
                </DialogHeader>
                <DialogBody className="justify-center">
                    <div className="flex-col flex">
                    <table className="table mx-auto mt-2 mb-2 text-center text-gray-900">
                        <thead>
                        <tr ref={tableHeaderElement}>
                            <th className="p-2">Identifiant</th>
                            <th className="p-2">Désignation interne</th>
                            <th className="p-2">Désignation fournisseur</th>
                            <th className="p-2">Fournisseur</th>
                            <th className="p-2">Référence fournisseur</th>
                            <th className="p-2">Etat</th>
                            <th className="p-2">Numéro de Série</th>
                            <th className="p-2">Marque</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y-2">
                        {replacementsPieces?.map((replacementPiece) => (
                                <tr key={replacementPiece.id} className="hover:bg-gray-100 hover:cursor-pointer" id="row" >
                                    <td className="p-2">{replacementPiece.id}</td>
                                    <td className="p-2">{replacementPiece.designationInterne}</td>
                                    <td className="p-2">{replacementPiece.designationFournisseur}</td>
                                    <td className="p-2">{replacementPiece.supplier}</td>
                                    <td className="p-2">{replacementPiece.manufacturerReferenceOfPiece}</td>
                                    <td className="p-2">{replacementPiece.state}</td>
                                    <td className="p-2">{replacementPiece.serialNumber}</td>
                                    <td className="p-2">
                                        {replacementPiece.brand
                                            ? replacementPiece.brand.brandName
                                            : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-around">
                        <Button
                            color="blue"
                            onClick={handleSubmit(onClose)}

                        >

                            fermer
                        </Button>

                        <Button
                            color="blue"
                            onClick={handleSubmit(generateQrCodes)}
                        >
                            imprimer
                        </Button>
                    </div>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
};

export default AddModal;
