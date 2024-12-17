import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  Length,
  Matches
} from 'class-validator';
import { VatRate } from '../enums/vat-rate.enum';
import {ActivityType} from "../../../common/enums/article-type.enum";

export class CreateCompanyDto {


  @IsEnum(ActivityType)
  activityType: ActivityType;

  @Length(3, 20, {
    message: 'Le nom doit être compris entre 3 et 20 caractères !',
  })
  name: string;

  @Matches(/^\d{14}$/, {
    message:
      'Le numéro de siret doit respecter le format français, composé de 14 chiffres !',
  })
  siretNumber: string;

  @Length(5, 45, {
    message: 'La rue doit être comprise entre 5 et 45 caractères !',
  })
  street: string;

  @Matches(/^[1-9]{2}\d{3}$/, {
    message:
      'Le code postal doit respecter le format XXYYY composé de chiffres !',
  })
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

  @IsEmail(
    {},
    {
      message:
        "L'adresse e-mail doit respecter le format nom@domaine.exemple !",
    }
  )
  mailAddress: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le taux de TVA doit être un nombre!' })
  @IsEnum(VatRate, {
    message: `Merci de renseigner un taux valide : [${Object.keys(VatRate)
      .filter((n) => Number(n))
      .join(', ')}]`,
  })
  vatRate?: VatRate;
}
