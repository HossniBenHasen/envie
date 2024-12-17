import { Allow } from "class-validator";
import { PreparationStatut } from "../enums/preparation-statut.enum";

export class UpdatePreparationDto {
  @Allow()
  userId: string;

  @Allow()
  replacementPiecesId: number[];

  @Allow()
  statut: PreparationStatut;
}
