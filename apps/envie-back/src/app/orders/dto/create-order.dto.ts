import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsString()
    comment?: string;

    // array of IDs
    @IsNotEmpty()
    replacementPieces: number[];
}
