import {
  Allow,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  IsOptional
} from 'class-validator';

export class CreateReplacementPieceDto {
  @IsString()
  @Length(3, 30, {
    message: "L'état doit être compris entre 3 et 30 caractères !",
  })
  state: string;

  @Allow()
  supplier: String;

  @IsOptional()
  @IsNumber()
  @Min(0.1, { message: 'Le poids doit être compris supérieur à 0.1 !' })
  @Max(1000, { message: 'Le poids doit être compris inférieur à 1000 !' })
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Le prix doit être compris supérieur à 0 !' })
  @Max(1000, { message: 'Le prix doit être compris inférieur à 1000 !' })
  excludingTaxesPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: "L'indication du prix doit être compris supérieur à 0 !" })
  @Max(1000, {
    message: "L'indication du prix doit être compris inférieur à 1000 !",
  })
  indicativePriceOfNewPiece?: number;

  @Allow()
  comments?: string;

  @IsString()
  @Length(3, 20, {
    message:
      'La reference du constructeur doit être compris entre 3 et 20 caractères !',
  })
  manufacturerReferenceOfPiece: string;

  @IsString()
  @Length(3, 30, {
    message: 'La désignation doit être compris entre 3 et 30 caractères !',
  })
  designationInterne: string;

  @IsString()
  @Length(3, 30, {
    message: 'La désignation fournisseur doit être compris entre 3 et 30 caractères !',
  })
  designationFournisseur: string;

  @IsString()
  @Length(3, 20, {
    message: 'Le modele doit être compris entre 3 et 20 caractères !',
  })
  model: string;

  @IsString()
  @Length(3, 20, {
    message:
      'La réference technique doit être compris entre 3 et 20 caractères !',
  })
  technicalReferenceDevice: string;

  @IsString()
  @Length(3, 30, {
    message: 'Le numéro de serie doit être compris entre 3 et 30 caractères !',
  })
  serialNumber: string;

  @IsString()
  @IsUUID()
  familyId: string;

  @IsString()
  @IsUUID()
  subfamilyId: string;

  @IsString()
  @IsUUID()
  brandId: string;

  @IsString()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  entryStockDate?: Date;

  @IsOptional()
  releaseStockDate?: Date;
}
