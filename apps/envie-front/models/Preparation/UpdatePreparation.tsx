import {PreparationStatut} from "../../enums/PreparationStatut";
export interface UpdatePreparation {   
  userId: string;
  replacementPiecesId: number[];
  statut: PreparationStatut;
} 