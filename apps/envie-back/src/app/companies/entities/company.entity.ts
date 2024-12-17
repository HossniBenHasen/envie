import { Factory } from 'nestjs-seeder';
import { Storage } from 'src/app/storages/entities/storage.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VatRate } from '../enums/vat-rate.enum';
import {ActivityType} from "../../../common/enums/article-type.enum";
import { User } from 'src/app/users/entities/user.entity';
import {ReplacementPiece} from "../../replacements-pieces/entities/replacement-piece.entity";

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Factory(ActivityType.PIECE)
  @Column({
    type: "enum",
    enum: ActivityType,
    nullable: true
  })
  activityType: ActivityType

  @Factory((faker) => {
    faker!.locale = 'fr';
    return faker?.name.fullName();
  })
  @Column({ nullable: false, length: 40, unique: true })
  name: string;

  @Factory((faker) => faker?.random.numeric(14))
  @Column({ nullable: false, length: 14, unique: true })
  siretNumber: string;

  @Factory((faker) => faker?.address.streetAddress())
  @Column({ nullable: false, length: 45 })
  street: string;

  @Factory((faker) => faker?.address.zipCode())
  @Column({ nullable: false, length: 12 })
  zipCode: string;

  @Factory((faker) => faker?.address.city())
  @Column({ nullable: false, length: 68 })
  city: string;

  @Factory('France')
  @Column({ nullable: false, length: 45 })
  country: string;

  @Factory('0382861529')
  @Column({ nullable: false, length: 12 })
  phoneNumber: string;

  @Factory((faker) => faker?.internet.email())
  @Column({ nullable: false })
  mailAddress: string;

  @Factory((faker) =>
    faker?.helpers.arrayElement(Object.keys(VatRate).filter((n) => Number(n)))
  )
  @Column({
    type: 'enum',
    enum: VatRate,
    nullable: true,
  })
  vatRate?: VatRate;

  @OneToMany(() => Storage, (storage) => storage.company, {
    cascade: true,
  })
  storages: Storage[];

  @OneToMany(
    () => User,
    (user) => user.company,
  )
  users: User[];

  @OneToMany(() => ReplacementPiece, (replacementPiece: ReplacementPiece) => replacementPiece.company)
  replacementPieces: ReplacementPiece[];
}
