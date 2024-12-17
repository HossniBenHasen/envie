import { IsString, Length } from "class-validator";

export class UpdateFamilyDto {
    @IsString()
    @Length(1, 40, {
        message:
        'Le nom de la famille doit être compris entre 1 et 40 caractères !',
    })
    familyName: string;
}
