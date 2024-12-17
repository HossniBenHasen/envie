import { IsNumber, IsString, IsUUID, Length, Max, Min, ValidateIf, IsOptional } from "class-validator";


export class UpdateReplacementPieceDto {

    @ValidateIf((o) => o.name !== undefined)
    @Length(3, 30, {
        message: "L'état doit être compris entre 3 et 30 caractères !",
    })
    state: string;

    @ValidateIf((o) => o.supplier !== undefined)
    supplier: String;

    // @IsOptional()
    // @ValidateIf((o) => o.weight !== undefined)
    // @Min(0.1, { message: 'Le poids doit être compris supérieur à 0.1 !' })
    // @Max(1000, { message: 'Le poids doit être compris inférieur à 1000 !' })
    // weight?: number;
    //
    // @IsOptional()
    // @ValidateIf((o) => o.excludingTaxesPrice !== undefined)
    // @Min(0, { message: 'Le prix doit être compris supérieur à 0 !' })
    // @Max(1000, { message: 'Le prix doit être compris inférieur à 1000 !' })
    // excludingTaxesPrice?: number;
    //
    // @IsOptional()
    // @ValidateIf((o) => o.indicativePriceOfNewPiece !== undefined)
    // @Min(0, { message: "L'indication du prix doit être compris supérieur à 0 !" })
    // @Max(1000, {
    //     message: "L'indication du prix doit être compris inférieur à 1000 !",
    // })
    // indicativePriceOfNewPiece?: number;

    @IsOptional()
    comments?: string;

    @ValidateIf((o) => o.manufacturerReferenceOfPiece !== undefined)
    @Length(3, 20, {
        message:
            'La reference du constructeur doit être compris entre 3 et 20 caractères !',
    })
    manufacturerReferenceOfPiece: string;

    @ValidateIf((o) => o.designationInterne !== undefined)
    @Length(3, 30, {
        message: 'La désignation doit être compris entre 3 et 30 caractères !',
    })
    designationInterne: string;


    @ValidateIf((o) => o.model !== undefined)
    @Length(3, 20, {
        message: 'Le modele doit être compris entre 3 et 20 caractères !',
    })
    model: string;

    @ValidateIf((o) => o.technicalReferenceDevice !== undefined)
    @Length(3, 20, {
        message:
            'La réference technique doit être compris entre 3 et 20 caractères !',
    })
    technicalReferenceDevice: string;

    @ValidateIf((o) => o.serialNumber !== undefined)
    @Length(3, 30, {
        message: 'Le numéro de serie doit être compris entre 3 et 30 caractères !',
    })
    serialNumber: string;

    @ValidateIf((o) => o.subfamilyId !== undefined)
    @IsString()
    @IsUUID()
    subfamilyId: string;

    @ValidateIf((o) => o.brandId !== undefined)
    @IsString()
    @IsUUID()
    brandId: string;

    @ValidateIf((o) => o.userId !== undefined)
    @IsString()
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsNumber()
    companyId?: number;
}
