import { Button, Dialog, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";

interface Props {
  open: boolean;
  onClose: () => any;
  onCancel: () => any;
}

const CancelModal = ({ open, onClose, onCancel }: Props) => {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader className="flex items-center justify-center text-center" >
        <Typography variant="h4" color="black">
          Etes-vous sûr de vouloir annuler cette commande ?
        </Typography>
      </DialogHeader>
      <DialogFooter className="flex justify-around">
        <Button
          variant="outlined"
          color="red"
          onClick={onClose}
        >
          <span>Annuler</span>
        </Button>
        <Button color="teal" onClick={() => onCancel()}>
          <span>Oui je suis sûr !</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CancelModal;