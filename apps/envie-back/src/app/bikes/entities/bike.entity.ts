import {Factory} from "nestjs-seeder";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {StorageLocation} from "../../storage-locations/entities/storage-location.entity";
import {Subfamily} from "../../subfamilies/entities/subfamily.entity";
import {Brand} from "src/app/brands/entities/brand.entity";


@Entity()
export class Bike extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Factory('NEW')
    @Column({nullable: false, length: 30})
    state: string

    @Factory(faker => faker?.datatype.number({min: 0, max: 200}))
    @Column({nullable: false, type: 'float'})
    weight: number

    @Factory(faker => faker?.datatype.number({min: 0.1, max: 1000}))
    @Column({nullable: false, type: 'float'})
    excludingTaxesPrice: number

    @Factory(faker => faker?.datatype.number({min: 0.1, max: 1000}))
    @Column({nullable: false, type: 'float'})
    indicativePriceOfNewPiece: number

    @Factory(faker => faker?.random.words(10))
    @Column({nullable: true, length: 200})
    comments: string

    @Factory(faker => faker?.helpers.arrayElement(['Roux', 'Boulon', 'selle', 'guidon']))
    @Column({nullable: false, length: 30})
    designation: string

    @Factory(faker => faker?.commerce.productName())
    @Column({nullable: false, length: 60})
    model: string

    @ManyToOne(() => Subfamily, (subfamily) => subfamily.bikes, {eager: true})
    subfamily: Subfamily

    @ManyToOne(() => Brand, (brand) => brand.bike, {eager: true})
    brand: any;

    @ManyToOne(() => StorageLocation, (StorageLocation) => StorageLocation.bike, {eager: true})
    storageLocation: StorageLocation
}
