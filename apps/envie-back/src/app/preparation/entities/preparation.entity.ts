import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReplacementPiece } from "../../replacements-pieces/entities/replacement-piece.entity";
import { User } from "../../users/entities/user.entity";
import { PreparationStatut } from "../enums/preparation-statut.enum";

@Entity()
export class Preparation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: "enum",
    enum: PreparationStatut,
    default: PreparationStatut.IN_PROGRESS
  })
  statut: PreparationStatut;

  @Column()
  name: string;

  @Column({
    nullable: true,
    type: "text"
  })
  comment: string;

  @ManyToOne(() => User, user => user.preparations, { nullable: false })
  user: User;

  @ManyToMany(() => ReplacementPiece, { eager: true })
  @JoinTable()
  replacementPieces: ReplacementPiece[];
}