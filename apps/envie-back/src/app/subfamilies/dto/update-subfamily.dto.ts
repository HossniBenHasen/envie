import { PartialType } from '@nestjs/mapped-types';
import { CreateSubfamilyDto } from './create-subfamily.dto';

export class UpdateSubfamilyDto extends PartialType(CreateSubfamilyDto) {}
