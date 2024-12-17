import { PreparationStatut } from "../../enums/PreparationStatut";
import { ReplacementPiece } from "../Replacement_piece/ReplacementPiece";
import { User } from "../User/User";

export interface Preparation {
  id: string;
  name: string;
  comment: string;
  createdAt: Date;
  user: User;
  replacementPieces: ReplacementPiece[];
  statut: PreparationStatut;
}