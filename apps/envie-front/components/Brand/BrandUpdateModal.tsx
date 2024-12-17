import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "@material-tailwind/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Brand } from "../../models/Brand/Brand";
import { UpdateBrand } from "../../models/Brand/UpdateBrand";
import * as brandService from "../../services/BrandService";

interface Props {
  brand: Brand;
  open: boolean;
  onClose: (updatedBrand?: Brand) => any;
}

const BrandUpdateModal = ({ brand, open, onClose }: Props) => {
  const { register, handleSubmit, setValue } = useForm<UpdateBrand>({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    setValue("brandName", brand ? brand.brandName : "");
  }, [brand]);

  const updateBrand = (data: UpdateBrand) => {
    brandService.updateBrand(brand.id, data).then((response) => {
      if (response.status == 200) {
        toast.success("La marque a bien été modifié");
        onClose(response.data);
      }
    }, (error) => {
      toast.error("Une erreur est survenue lors de la modification de la marque");
      onClose();
    });
  };

  return (
    <>
      <Dialog open={open} handler={onClose}>
        <DialogHeader className="justify-center">
          Modifier une marque
        </DialogHeader>
        <DialogBody>
          {brand ? (
            <form className="w-full">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Input
                    label="Marque"
                    variant="outlined"
                    color="teal"
                    required
                    {...register('brandName')}
                  />
                </div>
              </div>
            </form>
          ) : (
            <p>Chargement...</p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => onClose()}
            className="mr-1"
          >
            <span>Annuler</span>
          </Button>
          <Button color="teal" onClick={handleSubmit(updateBrand)}>
            <span>Modifier</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BrandUpdateModal;