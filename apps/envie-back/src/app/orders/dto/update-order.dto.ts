import { OrderStatus } from '../enums/order-status.enum';
import { Allow } from "class-validator";

export class UpdateOrderDto {
    @Allow()
    userId:string;

    @Allow()
    replacementPiecesId : number[];

    @Allow()
    status : OrderStatus;

}
