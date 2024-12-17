import { Button, Dialog, DialogBody, DialogFooter, DialogHeader,Select,Option } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Storage } from "../../models/Storage/Storage";
import { FormPrintStorageLocation } from "../../models/StorageLocation/FormPrintStorageLocation";
import { StorageLocation } from "../../models/StorageLocation/StorageLocation";
import * as QrcodeService from "../../services/QrcodeService";
import * as StorageLocationService from "../../services/StorageLocationService";
import * as StorageService from "../../services/StorageService";

interface Props {
  open: boolean;
  onClose: () => any;
}

const PrintStorageLocationModal = ({ open, onClose }: Props) => {
  const { register, handleSubmit, setValue, watch, formState: { isValid } } = useForm<FormPrintStorageLocation>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [storages, setStorages] = useState<Storage[]>([]);

  const getAllStorages = () => {
    StorageService.getAll().then((res) => {
      setStorages(res.data);
    })
  };

  const closeModal = () => {
    setValue("storage", undefined);
    setValue("row", undefined);
    setValue("column", undefined);
    setValue("shelf", undefined);
    setValue("location", undefined);
    onClose();
  }

  const generateQrCodes = (data: FormPrintStorageLocation) => {
    // Création d'un iframe pour l'imprimer plus tard
    const iframe = document.createElement("iframe");
    iframe.width = "0";
    iframe.height = "0";
    iframe.style.visibility = "hidden";
    iframe.setAttribute("srcdoc", "<html><body></body></html>");
    document.body.appendChild(iframe);

    iframe.addEventListener("load", () => {
      if (!iframe.contentDocument || !iframe.contentWindow) {
        return;
      }

      // On récupère les qr codes qu'on veut imprimer
      StorageLocationService.getAllStorageLocationToPrint(data).then(async (res) => {
        const storageLocations: StorageLocation[] = res.data;

        const transformedStorageLocations = storageLocations.reduce((acc: StorageLocation[][][], curr, i) => {
          const index = Math.floor(i / 24);
          if (!acc[index]) {
            acc[index] = [];
          }
          const innerIndex = Math.floor((i % 24) / 3);
          if (!acc[index][innerIndex]) {
            acc[index][innerIndex] = [];
          }
          acc[index][innerIndex].push(curr);
          return acc;
        }, []);

        transformedStorageLocations.map((page, index) => {
          const divPage = document.createElement("div");

          if (index === 0) {
            divPage.setAttribute("style", "display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); grid-template-rows: repeat(8, minmax(0, 1fr)); grid-column-gap: 60px; grid-row-gap: 71px; padding-top: 35px; padding-left: 10px; padding-right: 10px;");
          } else {
            divPage.setAttribute("style", "display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); grid-template-rows: repeat(8, minmax(0, 1fr)); grid-column-gap: 60px; grid-row-gap: 71px; padding-top: 45px; padding-left: 10px; padding-right: 10px;");
          }


          page.map(ligne => {
            const divLigne = document.createElement("div");
            divLigne.setAttribute("style", "display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(1, minmax(0, 1fr)); grid-column-gap: 60px;");

            ligne.map(storageLocation => {

              // On crée le qr code
              const qrcode = QrcodeService.createQrcode(storageLocation.id);
              qrcode.setAttribute("style", "width: 100%");

              // On crée le code d'adressage

              const codeAdressage = document.createElement("p");
              codeAdressage.innerText = `${storageLocation.storage.company.id} ${storageLocation.storage.internalName} - ${storageLocation.rowNumber} ${storageLocation.columnNumber} ${storageLocation.shelfNumber} ${storageLocation.locationNumber}`;
              codeAdressage.setAttribute("style", "margin: 0; text-align: center; font-size:20px;");

              // On ajoute le qrcode et le code d'adressage dans une div qu'on ajoute ensuite dans le body de l'iframe
              const div = document.createElement("div");
              div.appendChild(qrcode);
              div.appendChild(codeAdressage);
              divLigne.appendChild(div);
            })
            divPage.appendChild(divLigne);
          })

          iframe.contentDocument?.body.appendChild(divPage);
        })

        // On attend 1 seconde, ça résout un problème qui n'affichait pas les qr code correctement
        await new Promise(resolve => {
          setTimeout(resolve, 1000)
        })

        // On imprime l'iframe
        iframe.contentWindow?.print();

        // Quand on ferme la popup d'impression, on supprime l'iframe
        iframe.contentWindow?.addEventListener('afterprint', () =>
            document.body.removeChild(iframe)
        );
      })
    });


  }

  useEffect(() => {
    getAllStorages();
  }, [])

  return (
      <>
        <Dialog open={open} handler={closeModal} className=" h-2/3 flex flex-col over" size="xxl" >
          <DialogHeader className="justify-center">
          </DialogHeader>
          <DialogBody className="grid grid-cols-1 gap-2 flex-none">
            <Select
                label="Stockage"
                {...register("storage", {
                  required: true
                })}
                onChange={(e: any) => setValue("storage", storages.find((storage) => storage.id === e))}
            >
              {storages.map((storage) => (
                  <Option key={storage.id} value={storage.id}>{storage.name}</Option>
              ))}
            </Select>
            {watch("storage") && (
                <Select
                    label="Numéro de rangée"
                    {...register("row", {
                      valueAsNumber: true
                    })}
                    onChange={(e: any) => setValue("row", e)}
                >
                  {[...Array(watch("storage")?.numberOfRows)].map((_, i) => (
                      <Option key={i} value={(i + 1).toString()}>{i + 1}</Option>
                  ))}
                </Select>
            )}
            {watch("row") && (
                <div>
                  <Select
                      label="Numéro de colonne"
                      {...register("column", {
                        valueAsNumber: true
                      })}
                      onChange={(e: any) => setValue("column", e)}
                  >
                    {[...Array(watch("storage")?.columnPerRow)].map((_, i) => (
                        <Option key={i} value={(i + 1).toString()}>{i + 1}</Option>
                    ))}
                  </Select>
                </div>
            )}
            {watch("column") && (
                <div>
                  <Select
                      label="Numéro d'étagère"
                      {...register("shelf", {
                        valueAsNumber: true
                      })}
                      onChange={(e: any) => setValue("shelf", e)}
                  >
                    {[...Array(watch("storage")?.shelfPerColumn)].map((_, i) => (
                        <Option key={i} value={(i + 1).toString()}>{i + 1}</Option>
                    ))}
                  </Select>
                </div>
            )}
            {watch("shelf") && (
                <div>
                  <Select
                      label="Numéro d'emplacement"
                      {...register("location", {
                        valueAsNumber: true
                      })}
                      onChange={(e: any) => setValue("location", e)}
                  >
                    {[...Array(watch("storage")?.locationPerShelf)].map((_, i) => (
                        <Option key={i} value={(i + 1).toString()}>{i + 1}</Option>
                    ))}
                  </Select>
                </div>
            )}
          </DialogBody>
          <DialogFooter className="mt-auto">
            <Button
                color="red"
                variant="text"
                onClick={closeModal}
            >
              Annuler
            </Button>
            <Button
                color="teal"
                onClick={handleSubmit(generateQrCodes)}
                disabled={!isValid}
            >
              Imprimer
            </Button>
          </DialogFooter>
        </Dialog>
      </>
  )
}

export default PrintStorageLocationModal;
