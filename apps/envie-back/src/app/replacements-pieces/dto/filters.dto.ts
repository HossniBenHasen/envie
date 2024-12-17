import {IsNumber, IsString, IsUUID, IsOptional } from "class-validator";

export class FiltersDto {
    @IsOptional()
    @IsNumber()
    companyId: number | undefined;

    @IsOptional()
    @IsUUID()
    brandId?: string | undefined;

    @IsOptional()
    @IsUUID()
    familyId?: string | undefined;

    @IsOptional()
    @IsString()
    designationInterne?: string | undefined;

    @IsOptional()
    @IsString()
    supplier?: string | undefined;
}