import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReplacementPiece } from "../../replacements-pieces/entities/replacement-piece.entity";
import { User } from "../../users/entities/user.entity";
import { OrderStatus } from "../enums/order-status.enum";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.WAITING
  })
  status: OrderStatus;

  @Column({
    nullable: true,
    type: "text"
  })
  comment: string;

  @ManyToOne(() => User, (user: User) => user.orders, { nullable: false })
  @JoinTable()
  user: User;

  @OneToMany(() => ReplacementPiece, (replacementPiece: ReplacementPiece) => replacementPiece.order)
  replacementPieces: ReplacementPiece[];
}
