import { Button, Dialog, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";

interface Props {
  open: boolean;
  onClose: () => any;
  onValidate: () => any;
}

const ValidateModal = ({ open, onClose, onValidate }: Props) => {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader className="flex items-center justify-center text-center" >
        <Typography variant="h4" color="black">
          Etes-vous sûr de vouloir livrer cette commande ?
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
        <Button color="teal" onClick={() => onValidate()}>
          <span>Oui je suis sûr !</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ValidateModal;