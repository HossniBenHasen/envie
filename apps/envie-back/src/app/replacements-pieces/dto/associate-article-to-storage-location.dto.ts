import { IsString, IsUUID } from "class-validator";

export class AssociateArticleToStorageLocationDto {
    @IsString()
    @IsUUID()
    storageLocation: string
}