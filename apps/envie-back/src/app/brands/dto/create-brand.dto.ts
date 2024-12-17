import { IsString, Length } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @Length(1, 40, {message: 'Le nom de marque doit être compris entre 1 et 40 caractères !'})
    brandName: string
}
