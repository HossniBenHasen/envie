import {Factory} from 'nestjs-seeder';
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Subfamily} from "../../subfamilies/entities/subfamily.entity";
import {ActivityType} from "../../../common/enums/article-type.enum";


@Entity()
export class Family extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker?.helpers.unique(faker?.commerce.product))
  @Column({ unique: true })
  familyName: string;

  @OneToMany(() => Subfamily, (subfamily) => subfamily.family, {onDelete: "CASCADE"})
  subfamilies: Subfamily[]

  @Column({
    type: "enum",
    enum: ActivityType,
    nullable: false
  })
    activityType: ActivityType
}
