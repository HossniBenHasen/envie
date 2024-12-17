import { Allow, IsString } from "class-validator";

export class PrintStorageLocationDto {
  @IsString()
  storage: string;

  @Allow()
  rowNumber?: number;

  @Allow()
  columnNumber?: number

  @Allow()
  shelfNumber?: number

  @Allow()
  locationNumber?: number;

  @Allow()
  uid?: number;


}
