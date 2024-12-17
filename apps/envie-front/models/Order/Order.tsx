import { OrderStatus } from "../../enums/OrderStatus";
import { User } from "../User/User";
import { ReplacementPiece } from "../Replacement_piece/ReplacementPiece";

export interface Order {
    id: string;
    createdAt: Date;
    status: OrderStatus;
    comment: string;
    userId: User;
    replacementPieces: ReplacementPiece[];
}
