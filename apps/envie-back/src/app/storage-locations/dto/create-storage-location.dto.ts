import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class CreateStorageLocationDto {
    @IsNotEmpty()
    @IsNumber()
    @Max(100, {
      message:
        'Le numero de rangée doit être compris entre 1 et 100',
    })
    @Min(1, {
      message:
        'Le numero de rangée doit être compris entre 1 et 100',
    })
    rowNumber: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1, {message: 'Le numéro de colonne doit être comprit entre 1 et 26 !'})
    @Max(26, {message: 'Le numéro de colonne doit être comprit entre 1 et 26 !'})
    columnNumber: number

    @IsNotEmpty()
    @IsNumber()
    @Min(1, {message: 'Le numéro d\'étagères doit être comprit entre 1 et 9 !'})
    @Max(9, {message: 'Le numéro d\'étagères doit être comprit entre 1 et 9 !'})
    shelfNumber: number

    @IsNotEmpty()
    @Max(100, {
        message: 'Le numéro d\'emplacement doit être compris entre 1 et 100',
      })
    @Min(1, {
      message: 'Le numéro d\'emplacement doit être compris entre 1 et 100',
    })
    locationNumber: number;



}
