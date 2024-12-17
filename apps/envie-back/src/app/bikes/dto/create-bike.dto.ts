import {
    IsString,
    IsUUID,
    Length,
    IsNumber,
    Min,
    Max,
    Allow
} from 'class-validator';


export class CreateBikeDto {

 @IsString()
@Length(3, 30, {
    message: "L'état doit être compris entre 3 et 30 caractères !",
})
state: string;
  
@IsNumber()
@Min(0.1, { message: 'Le poids doit être compris supérieur à 0.1 !' })
@Max(1000, { message: 'Le poids doit être compris inférieur à 1000 !' })
weight: number;
  
@IsNumber()
@Min(0, { message: 'Le prix doit être compris supérieur à 0 !' })
@Max(1000, { message: 'Le prix doit être compris inférieur à 1000 !' })
excludingTaxesPrice: number;
  
@IsNumber()
@Min(0, { message: "L'indication du prix doit être compris supérieur à 0 !" })
@Max(1000, {
    message: "L'indication du prix doit être compris inférieur à 1000 !",
})
indicativePriceOfNewPiece: number;

@IsString()
@Length(3, 30, {
    message: 'La désignation doit être compris entre 3 et 30 caractères !',
})
designation: string;

@IsString()
@Length(3, 20, {
    message: 'Le modele doit être compris entre 3 et 20 caractères !',
})
model: string;

@Allow()
comments: string;

  @IsString()
  @IsUUID()
  familyId: string;

 @IsString()
 @IsUUID()
 subfamilyId: string;

 @IsString()
 @IsUUID()
 brandId: string;
 
}
