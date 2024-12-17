import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ReplacementPiece } from '../../replacements-pieces/entities/replacement-piece.entity';
import { Storage } from '../../storages/entities/storage.entity';
import { Bike } from '../../bikes/entities/bike.entity';
import { TravelHistory } from '../../travel-history/entities/travel-history.entity';

@Entity()
@Index(
  ['storage', 'rowNumber', 'columnNumber', 'shelfNumber', 'locationNumber'],
  { unique: true }
)
export class StorageLocation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Storage,
    (storage) => storage.storageLocations,
    {
      eager: true
    }
  )
  storage: Storage;

  @Column({ nullable: false })
  rowNumber: number;

  @Column({ nullable: false })
  columnNumber: number;

  @Column({ nullable: false })
  shelfNumber: number;

  @Column({ nullable: false })
  locationNumber: number;

  @Column({ nullable: false })
  uid:number; //adding the uid column

  @OneToMany(
    () => ReplacementPiece,
    (replacementPiece) => replacementPiece.storageLocation
  )
  replacementPiece: ReplacementPiece[];

  @OneToMany(() => Bike, (bike) => bike.storageLocation)
  bike: Bike[];

  @OneToMany(() => TravelHistory, (travelHistory) => travelHistory.storageLocation)
  travelHistory: TravelHistory[];
}
