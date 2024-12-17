import { Button, Dialog, DialogFooter, DialogHeader } from "@material-tailwind/react";

interface Props {
  open: boolean;
  onClose: () => any;
  onDelete: () => any;
}

const DeleteModal = ({ open, onClose, onDelete }: Props) => {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader className="text-center">Etes-vous sûr de vouloir supprimer cette information ?</DialogHeader>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onClose}
          className="mr-1"
        >
          <span>Annuler</span>
        </Button>
        <Button color="teal" onClick={() => onDelete()}>
          <span>Oui je suis sûr !</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DeleteModal;