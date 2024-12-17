import { IsString, IsNotEmpty, Allow } from "class-validator";
import { PreparationStatut } from "../enums/preparation-statut.enum";

export class CreatePreparationDto {
  @IsString()
  userId: string;

  @IsNotEmpty()
  replacementPiecesId: number[];

  @IsString()
  name: string;

  @Allow()
  comment: string;

  @Allow()
  statut: PreparationStatut;
}
