import {IsEnum, IsNumber, IsString, Length} from "class-validator";
import {ActionTravelHistory} from "../enums/action-travel-history.enum";
import {ReplacementPiece} from "../../replacements-pieces/entities/replacement-piece.entity";

export class CreateTravelHistoryDto {

    @IsEnum(ActionTravelHistory)
    action: ActionTravelHistory

    @IsString()
    @Length(2, 20)
    referringUser: string

    @IsString()
    storageLocationId: string
}