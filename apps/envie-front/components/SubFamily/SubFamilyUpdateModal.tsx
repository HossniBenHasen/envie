/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from '@material-tailwind/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SubFamily } from '../../models/SubFamily/SubFamily';
import { UpdateSubFamily } from '../../models/SubFamily/UpdateSubFamily';
import * as subfamilyService from '../../services/SubFamilyService';

interface Props {
  subfamily: SubFamily;
  open: boolean;
  onClose: (updatedSubFamily?: SubFamily) => any;
}

const SubFamilyUpdateModal = ({ subfamily, open, onClose }: Props) => {
  const { register, handleSubmit, setValue } = useForm<UpdateSubFamily>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    setValue('subfamilyName', subfamily ? subfamily.subfamilyName : '');
  }, [subfamily]);

  const UpdateSubFamily = (data: UpdateSubFamily) => {
    subfamilyService.updateSubFamily(subfamily.id, data).then(
      (response) => {
        if (response.status == 200) {
          toast.success('La sous-famille a bien été modifié');
          onClose(response.data);
        }
      },
      (error) => {
        toast.error(
          'Une erreur est survenue lors de la modification de la sous-famille'
        );
        onClose();
      }
    );
  };

  return (
    <>
      <Dialog open={open} handler={onClose}>
        <DialogHeader className="justify-center">
          Modifier une sous-famille
        </DialogHeader>
        <DialogBody>
          {subfamily ? (
            <form className="w-full">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Input
                    label="Sous-famille"
                    variant="outlined"
                    color="teal"
                    required
                    {...register('subfamilyName')}
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
          <Button color="teal" onClick={handleSubmit(UpdateSubFamily)}>
            <span>Modifier</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SubFamilyUpdateModal;
