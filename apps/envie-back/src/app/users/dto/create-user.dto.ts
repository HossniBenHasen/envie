import { IsEnum, IsNotEmpty, IsNumber, Length } from "class-validator";
import { Role } from "../../auth/roles/role-enum";

export class CreateUserDto {
    @Length(3, 20, {
        message: 'Le nom doit être compris entre 2 et 20 caractères !',
    })
    username: string;

    @Length(3, 20, {
        message: 'Le mot de passe doit être compris entre 3 et 20 caractères !',
    })
    password: string;

    @IsEnum(Role)
    role: Role

    @IsNotEmpty()
    @IsNumber()
    companyId: number;
}
