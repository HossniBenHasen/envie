import { Injectable, HttpException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import {Order} from "./entities/order.entity";
import {OrderStatus} from "./enums/order-status.enum";
import {User} from "../users/entities/user.entity";
import {ReplacementPiece} from "../replacements-pieces/entities/replacement-piece.entity";
import {StorageLocation} from "../storage-locations/entities/storage-location.entity";
import {OrderFiltersDto} from "./dto/order-filters.dto";

@Injectable()
export class OrdersService {

  /*
  Créer un bon de commande avec des pièces dedans (FK replacement_piece.orderId)
   */
  async create(createOrderDto: CreateOrderDto) {
    try {
      let order = new Order();

      let replacementPiecesToAdd: ReplacementPiece[] = [];

      const user = await User.findOneBy({id: createOrderDto.userId});
      if (!user) {
        throw new HttpException('User not found', 404);
      } else {
        order.user = user;
      }

      if (createOrderDto.comment) {
        order.comment = createOrderDto.comment;
      }

      for (let el of createOrderDto.replacementPieces) {
        let piece = await ReplacementPiece.findOneBy({
          id: el
        })
        if (piece) {
          replacementPiecesToAdd.push(piece);
        }
      }

      order.replacementPieces = replacementPiecesToAdd;

      order.save();
      return true;

    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async findAll() {
    return await Order.find();
  }

  async findAllWithUser() {
    return await Order.find({
    order:{
      id: 'DESC',
    },
      relations:{
      user: true
      }
    });
  }


  async findAllFiltered(orderFiltersDto: OrderFiltersDto) {
    let waiting = orderFiltersDto.waiting ?{status: OrderStatus.WAITING}: new Order();
    let inProgress = orderFiltersDto.inProgress ?{status: OrderStatus.IN_PROGRESS}: new Order();
    let reservedFull = orderFiltersDto.reservedFull ?{status: OrderStatus.RESERVED_FULL}: new Order();
    let reservedIncomplete = orderFiltersDto.reservedIncomplete ?{status: OrderStatus.RESERVED_INCOMPLETE}: new Order();
    let delivered = orderFiltersDto.delivered ?{status: OrderStatus.DELIVERED}: new Order();
    let canceled = orderFiltersDto.canceled ?{status: OrderStatus.CANCELED}: new Order();
    return await Order.find({
      select: {},
      where: [
        waiting,
        inProgress,
        reservedFull,
        reservedIncomplete,
        delivered,
        canceled
      ],
      relations: {
        user: true
      }
    })
  }

  async findOneWithPieces(orderId: number): Promise<any> {
    return await ReplacementPiece
        .getRepository()
        .createQueryBuilder('replacementPiece')
        .select('replacementPiece')
        .where('replacementPiece.orderId = :id', {id: orderId})
        .leftJoinAndSelect('replacementPiece.order', 'order')
        .leftJoinAndSelect('replacementPiece.storageLocation', 'storageLocation')
        .leftJoinAndSelect('order.user', 'user')
        .orderBy('storageLocation.rowNumber', 'ASC')
        .addOrderBy('storageLocation.columnNumber', 'ASC')
        .addOrderBy('storageLocation.shelfNumber', 'ASC')
        .addOrderBy('storageLocation.locationNumber', 'ASC')
        .getMany();
  };

 /*
 async prepare(id: number) {
  }
  */

  async deliver(id: number) {
      try {

        //On recupere la commande
        let order = await Order.find({
          select: {
            id: true,
            status: true,
          },
          where: [
            { id: id }
          ]
        })

      // On met à jour la commande

      order[0].status = OrderStatus.DELIVERED;

      return await Order.save(order);
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }


  async cancel(id: number) {
    try {

      //On recupere la commande
        let order = await Order.find({
          select: {
            id: true,
            status: true,
          },
          where: [
            { id: id }
          ]
        })

      // On met à jour la commande

      order[0].status = OrderStatus.CANCELED;

      return await Order.save(order);
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

}
