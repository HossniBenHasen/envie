import { Factory } from 'nestjs-seeder';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { StorageLocation } from '../../storage-locations/entities/storage-location.entity';
import { Subfamily } from '../../subfamilies/entities/subfamily.entity';
import { TravelHistory } from '../../travel-history/entities/travel-history.entity';
import {Order} from "../../orders/entities/order.entity";
import {Company} from "../../companies/entities/company.entity";
import {User} from "../../users/entities/user.entity";

@Entity()
export class ReplacementPiece extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory('EMO')
  @Column({ nullable: false, length: 30 })
  state: string;

  @Column({ nullable: false, length: 10 })
  supplier: String;

  @Factory((faker) => faker?.datatype.number({ min: 0, max: 200 }))
  @Column({ nullable: true, type: 'float' })
  weight?: number;

  @ManyToOne(() => Subfamily, (subfamily) => subfamily.replacementPiece, {
    eager: true,
  })
  subfamily: Subfamily;

  @Factory((faker) => faker?.datatype.number({ min: 0.1, max: 1000 }))
  @Column({ nullable: true, type: 'float' })
  excludingTaxesPrice?: number;

  @Factory((faker) => faker?.datatype.number({ min: 0.1, max: 1000 }))
  @Column({ nullable: true, type: 'float' })
  indicativePriceOfNewPiece?: number;

  @Factory((faker) => faker?.random.words(10))
  @Column({ nullable: true, length: 200 })
  comments?: string;

  @Factory((faker) => faker?.random.numeric(7))
  @Column({ nullable: false, length: 20 })
  manufacturerReferenceOfPiece: string;

  @Factory((faker) =>
    faker?.helpers.arrayElement([
      'Machine à laver',
      'Boulon',
      'Vitre',
      'Ventilateur',
      'Moteur',
    ])
  )
  @Column({ nullable: false, length: 30 })
  designationInterne: string;

  @Factory((faker) =>
  faker?.helpers.arrayElement([
    'Machine laver',
    'Boulon 33mm',
    'Vitre PVC2010',
    'Vent_001',
    'Moteur10x26',
    ])
  )
  @Column({ nullable: false, length: 30 })
  designationFournisseur: string;

  @Factory((faker) => faker?.commerce.productName())
  @Column({ nullable: false, length: 60 })
  model: string;

  @Factory((faker) => faker?.random.numeric(15))
  @Column({ nullable: false, length: 20 })
  technicalReferenceDevice: string;

  @Factory((faker) => faker?.random.numeric(15))
  @Column({ nullable: false, length: 30 })
  serialNumber: string;

  @Column({ nullable: true })
  dismantlingDate: Date;

  @Column()
  @CreateDateColumn()
  entryStockDate: Date;

  @Column()
  @CreateDateColumn()
  releaseStockDate: Date;

  @ManyToOne(() => User, (user) => user.replacementPiece, {
    eager: true,
  })
  user: User;

  @ManyToOne(() => Brand, (brand) => brand.replacementPiece, { eager: true })
  brand: Brand;

  @ManyToOne(
    () => StorageLocation,
    (storageLocation) => storageLocation.replacementPiece,
    { eager: true }
  )
  storageLocation: StorageLocation | null;

  @OneToMany(
    () => TravelHistory,
    (travelHistory) => travelHistory.replacementPiece
  )
  travelHistory: TravelHistory;

  @ManyToOne(() => Order, (order: Order) => order.replacementPieces, { nullable: true })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Company, (company: Company) => company.replacementPieces, { nullable: true })
  @JoinColumn()
  company: Company;
}
