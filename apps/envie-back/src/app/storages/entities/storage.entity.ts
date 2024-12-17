import { Factory } from 'nestjs-seeder';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { StorageLocation } from '../../storage-locations/entities/storage-location.entity';

@Entity()
export class Storage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker?.company.name())
  @Column({ unique: true })
  name: string;

  @Factory((faker) => faker?.company.name())
  @Column({ unique: true })
  internalName: string;

  @OneToMany(() => StorageLocation, (shelveLocation) => shelveLocation.storage)
  storageLocations: StorageLocation[];

  @Factory((faker) => faker?.address.street())
  @Column({ length: 45 })
  street: string;

  @Factory((faker) => faker?.datatype.number())
  @Column()
  zipCode: string;

  @Factory((faker) => faker?.address.city())
  @Column({ length: 68 })
  city: string;

  @Factory((faker) => faker?.address.country())
  @Column({ length: 42 })
  country: string;

  @Factory((faker) => faker?.phone.number())
  @Column()
  phoneNumber: string;

  @Factory((faker) => faker?.internet.email())
  @Column()
  mailAddress: string;

  @Factory((faker) => faker?.name.firstName())
  @Column()
  responsiblePerson: string;

  @Factory((faker) => faker?.datatype.number({ min: 0.1, max: 100 }))
  @Column()
  numberOfRows: number;

  @Factory((faker) => faker?.datatype.number({ min: 0.1, max: 100 }))
  @Column()
  columnPerRow: number;

  @Factory((faker) => faker?.datatype.number({ min: 0.1, max: 100 }))
  @Column()
  shelfPerColumn: number;

  @Factory((faker) => faker?.datatype.number({ min: 0.1, max: 100 }))
  @Column()
  locationPerShelf: number;

  @ManyToOne(
    () => Company,
    (company) => company.storages,
    {
      eager: true
    }
  )
  company: Company;
}
