import {IsEnum, IsString, Length} from 'class-validator';
import {ActivityType} from "../../../common/enums/article-type.enum";

export class CreateFamilyDto {
  @IsString()
  @Length(1, 40, {
    message:
      'Le nom de la famille doit être compris entre 1 et 40 caractères !',
  })
  familyName: string;

  @IsEnum(ActivityType)
  activityType: ActivityType;
}
