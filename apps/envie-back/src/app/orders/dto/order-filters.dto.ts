import {IsBoolean, IsOptional } from "class-validator";

export class OrderFiltersDto {
    @IsOptional()
    @IsBoolean()
    waiting: boolean;

    @IsOptional()
    @IsBoolean()
    inProgress?: boolean;

    @IsOptional()
    @IsBoolean()
    reservedFull?: boolean;

    @IsOptional()
    @IsBoolean()
    reservedIncomplete?: boolean;

    @IsOptional()
    @IsBoolean()
    delivered?: boolean;

    @IsOptional()
    @IsBoolean()
    canceled?: boolean;
}