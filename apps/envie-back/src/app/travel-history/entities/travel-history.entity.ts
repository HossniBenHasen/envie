import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ActionTravelHistory} from "../enums/action-travel-history.enum";
import {ReplacementPiece} from "../../replacements-pieces/entities/replacement-piece.entity";
import { StorageLocation } from "../../storage-locations/entities/storage-location.entity";

@Entity()
export class TravelHistory extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: ActionTravelHistory,
        nullable: true
    })
    action: ActionTravelHistory

    @Column()
    referringUser: string
    
    @Column()
    @CreateDateColumn()
    createdAt: Date
    
    @ManyToOne(() => ReplacementPiece, (replacementPiece) => replacementPiece.travelHistory)
    replacementPiece: ReplacementPiece

    @ManyToOne(() => StorageLocation, (storageLocation) => storageLocation.travelHistory, {eager: true})
    storageLocation: StorageLocation
}