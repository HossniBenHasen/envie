import { Company } from "src/app/companies/entities/company.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../auth/roles/role-enum";
import { Preparation } from "../../preparation/entities/preparation.entity";
import { Order } from "../../orders/entities/order.entity";
import {ReplacementPiece} from "../../replacements-pieces/entities/replacement-piece.entity";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @Column({
        type: "enum",
        enum: Role,
        nullable: true,
        default: Role.ADMIN
    })
    role: Role

    @ManyToOne(
        () => Company,
        (company: Company) => company.users,
        { nullable: false }
    )
    company: Company;

    @OneToMany(() => Preparation, (preparation: Preparation) => preparation.user)
    preparations: Preparation[];

    @OneToMany(() => Order, (order: Order) => order.user)
    orders: Order[];

    @OneToMany(() => ReplacementPiece, (replacementPiece) => replacementPiece.user)
    replacementPiece: ReplacementPiece[]
}
