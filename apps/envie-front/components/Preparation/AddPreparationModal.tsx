import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Preparation } from "../../models/Preparation/Preparation";

interface PreparationForm {
  name: string;
  comment: string;
}

interface Props {
  open: boolean;
  onClose: (preparation?: Preparation) => any;
}

const AddPreparationModal = ({ open, onClose }: Props) => {
  const { data: session } = useSession();
  const { register, handleSubmit, reset, formState: { isValid } } = useForm<PreparationForm>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: PreparationForm) => {
    axios.post(process.env.API_URL + 'preparation', {
      name: data.name,
      comment: data.comment,
      userId: session?.token.id,
      replacementPiecesId: []
    }).then((res) => {
      onClose(res.data);
      reset();
    })
  };

  const closeModal = () => {
    onClose();
    reset();
  };

  return (
    <Dialog
      open={open}
      handler={closeModal}
    >
      <DialogHeader className="justify-center">
        Ajouter une préparation
      </DialogHeader>
      <DialogBody>
        <form className="w-full">
          <div className="grid grid-cols-1 gap-3">
            <Input
              label="Nom de la préparation"
              variant="outlined"
              type="text"
              {...register('name', {
                required: true
              })}
            />
            <Textarea
              label="Commentaire"
              color="teal"
              variant="outlined"
              {...register('comment')}
            />
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="flex gap-2">
        <Button
          variant="text"
          color="red"
          type="button"
          placeholder="Annuler"
          size="md"
          ripple={true}
          onClick={closeModal}
        >
          Annuler
        </Button>
        <Button
          color="teal"
          type="button"
          placeholder="Ajouter"
          size="md"
          ripple={true}
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Ajouter
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddPreparationModal;