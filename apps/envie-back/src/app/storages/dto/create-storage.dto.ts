import {
  IsEmail, IsNumber, IsPhoneNumber,
  Length,
  Matches,
  Max,
  Min
} from 'class-validator';

export class CreateStorageDto {
  @IsNumber()
  companyId: number;

  @Length(3, 20, {
    message: 'Le nom doit être compris entre 3 et 20 caractères !',
  })
  name: string;

  @Length(3, 20, {
    message: 'Le nom interne doit être compris entre 3 et 20 caractères !',
  })
  internalName: string;

  @Length(5, 45, {
    message: 'La rue doit être comprise entre 5 et 45 caractères !',
  })
  street: string;

  @Matches(/^\d{2}\d{3}$/, { message: "votre code postal n'est pas valide" })
  zipCode: string;

  @Matches(/^[a-z- ]{1,68}$/i, {
    message: 'Une ville doit être composée de lettres, de 1 à 68 caractères !',
  })
  city: string;

  @Matches(/^[a-z- ]{2,42}$/i, {
    message: 'Un pays doit être composée de lettres, de 2 à 42 caractères !',
  })
  country: string;

  @IsPhoneNumber('FR', {
    message:
      'Le numéro de téléphone doit respecter le format +XX X XX XX XX XX',
  })
  phoneNumber: string;

  @IsEmail({ message: "votre adresse mail n'est pas valide" })
  mailAddress: string;

  @Length(3, 20, {
    message:
      'Le nom du responsable doit être compris entre 3 et 20 caractères !',
  })
  responsiblePerson: string;

  @Max(100, {
    message: 'Le un nombre de rangée doit être compris entre 1 et 100',
  })
  @Min(1, {
    message: 'Le un nombre de rangée doit être compris entre 1 et 100',
  })
  numberOfRows: number;

  @Max(100, {
    message: 'Le nombre de colonne par rangée doit être compris entre 1 et 100',
  })
  @Min(1, {
    message: 'Le nombre de colonne par rangée doit être compris entre 1 et 100',
  })
  columnPerRow: number;

  @Max(100, {
    message: 'Le nombre d&apos;étagères par colonne doit être compris entre 1 et 100',
  })
  @Min(1, {
    message: 'Le nombre d&apos;étagères par colonne doit être compris entre 1 et 100',
  })
  shelfPerColumn: number;

  @Max(100, {
    message:
      'Le nombre d’emplacement par étagère doit être compris entre 1 et 100',
  })
  @Min(1, {
    message:
      'Le nombre d’emplacement par étagère doit être compris entre 1 et 100',
  })
  locationPerShelf: number;
}
