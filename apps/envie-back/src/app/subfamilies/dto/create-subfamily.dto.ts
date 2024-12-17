import {IsString, IsUUID, Length} from 'class-validator';

export class CreateSubfamilyDto {
  @IsString()
  @Length(1, 40, {
    message:
      'Le nom de la sous-famille doit être compris entre 1 et 40 caractères !',
  })
  subfamilyName: string;

  @IsUUID()
  familyId: string;
}
