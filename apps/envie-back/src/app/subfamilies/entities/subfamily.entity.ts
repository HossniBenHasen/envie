import { Factory } from 'nestjs-seeder';
import {BaseEntity, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { ReplacementPiece } from '../../replacements-pieces/entities/replacement-piece.entity';
import {Family} from "../../families/entities/family.entity";
import { Bike } from 'src/app/bikes/entities/bike.entity';

@Entity()
@Index(['subfamilyName', 'family'], {unique: true})
export class Subfamily extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker?.helpers.unique(faker?.commerce.product))
  @Column()
  subfamilyName: string;

  @OneToMany(
    () => ReplacementPiece,
    (replacementPiece) => replacementPiece.subfamily
  )
  replacementPiece: ReplacementPiece;

  @ManyToOne(
      () => Family,
      (family) => family.subfamilies
  )
 family: Family
 
  @OneToMany(
      () => Bike,
      (bike) => bike.subfamily
  )
  bikes: Bike
}
