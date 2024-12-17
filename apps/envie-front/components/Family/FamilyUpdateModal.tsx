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
import { Family } from '../../models/Family/Family';
import { UpdateFamily } from '../../models/Family/UpdateFamily';
import * as familyService from '../../services/FamilyService';

interface Props {
  family: Family;
  open: boolean;
  onClose: (updatedFamily?: Family) => any;
}

const FamilyUpdateModal = ({ family, open, onClose }: Props) => {
  const { register, handleSubmit, setValue } = useForm<UpdateFamily>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    setValue('familyName', family ? family.familyName : '');
  }, [family]);

  const updateFamily = (data: UpdateFamily) => {
    familyService.updateFamily(family.id, data).then(
      (response) => {
        if (response.status == 200) {
          toast.success('La famille a bien été modifié');
          onClose(response.data);
        }
      },
      (error) => {
        toast.error(
          'Une erreur est survenue lors de la modification de la famille'
        );
        onClose();
      }
    );
  };

  return (
    <>
      <Dialog open={open} handler={onClose}>
        <DialogHeader className="justify-center">
          Modifier une famille
        </DialogHeader>
        <DialogBody>
          {family ? (
            <form className="w-full">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Input
                    label="Famille"
                    variant="outlined"
                    color="teal"
                    required
                    {...register('familyName')}
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
          <Button color="teal" onClick={handleSubmit(updateFamily)}>
            <span>Modifier</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default FamilyUpdateModal;
