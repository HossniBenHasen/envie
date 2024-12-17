import { ActionTravelHistory } from "../../enums/ActionTravelHistory";
import { ReplacementPiece } from "../Replacement_piece/ReplacementPiece";
import { StorageLocation } from '../StorageLocation/StorageLocation';

export interface PieceHistory {
    id: number;
    action: ActionTravelHistory;
    referringUser: string;
    createdAt: Date;
    replacementPiece: ReplacementPiece;
    storageLocation: StorageLocation | null;
}