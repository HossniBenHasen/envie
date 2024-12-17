import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Family } from 'src/app/families/entities/family.entity';
import { Storage } from 'src/app/storages/entities/storage.entity';
import { Subfamily } from 'src/app/subfamilies/entities/subfamily.entity';
import { Bike } from "../app/bikes/entities/bike.entity";
import { Brand } from "../app/brands/entities/brand.entity";
import { Company } from '../app/companies/entities/company.entity';
import { Preparation } from '../app/preparation/entities/preparation.entity';
import { ReplacementPiece } from '../app/replacements-pieces/entities/replacement-piece.entity';
import { StorageLocation } from "../app/storage-locations/entities/storage-location.entity";
import { TravelHistory } from "../app/travel-history/entities/travel-history.entity";
import { User } from "../app/users/entities/user.entity";
import { Order } from 'src/app/orders/entities/order.entity';

const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [Brand, Bike, Company, ReplacementPiece, Preparation, Storage, StorageLocation, Subfamily, User, Family, TravelHistory, Order],
  synchronize: process.env.NODE_ENV === 'development',
};

export default options;
