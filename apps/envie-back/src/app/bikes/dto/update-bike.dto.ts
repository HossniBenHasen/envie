import { PartialType } from '@nestjs/mapped-types';
import { CreateBikeDto } from './create-bike.dto';
import { IsString, IsUUID, Length, Max, Min, ValidateIf } from 'class-validator';


export class UpdateBikeDto extends PartialType(CreateBikeDto) {

    @ValidateIf((o) => o.name !== undefined)
    @Length(3, 30, {
        message: "L'état doit être compris entre 3 et 30 caractères !",
    })
    state: string;

    @ValidateIf((o) => o.weight !== undefined)
    @Min(0.1, { message: 'Le poids doit être compris supérieur à 0.1 !' })
    @Max(1000, { message: 'Le poids doit être compris inférieur à 1000 !' })
    weight: number;

    @ValidateIf((o) => o.excludingTaxesPrice !== undefined)
    @Min(0, { message: 'Le prix doit être compris supérieur à 0 !' })
    @Max(1000, { message: 'Le prix doit être compris inférieur à 1000 !' })
    excludingTaxesPrice: number;

    @ValidateIf((o) => o.indicativePriceOfNewPiece !== undefined)
    @Min(0, { message: "L'indication du prix doit être compris supérieur à 0 !" })
    @Max(1000, {
        message: "L'indication du prix doit être compris inférieur à 1000 !",
    })
    indicativePriceOfNewPiece: number;

    @ValidateIf((o) => o.comments !== undefined)
    @Length(1, 200, {
        message: 'Le commentaire doit être compris entre 3 et 200 caractères !',
    })
    comments: string;

    @ValidateIf((o) => o.familyId !== undefined)
    @IsString()
    @IsUUID()
    familyId: string;

    @ValidateIf((o) => o.subfamilyId !== undefined)
    @IsString()
    @IsUUID()
    subfamilyId: string;

    @ValidateIf((o) => o.brandId !== undefined)
    @IsString()
    @IsUUID()
    brandId: string;

}
