import { Factory } from "nestjs-seeder";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReplacementPiece } from "../../replacements-pieces/entities/replacement-piece.entity";
import { Bike } from "src/app/bikes/entities/bike.entity";

@Entity()
export class Brand extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Factory(faker => faker?.company.name())
    @Column()
    brandName: string

    @OneToMany(() => ReplacementPiece, (replacementPiece) => replacementPiece.brand)
    replacementPiece: ReplacementPiece[]

    @OneToMany(() => Bike, (bike) => bike.brand)
    bike: Bike[]
}
