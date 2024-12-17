import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { FamiliesModule } from 'src/app/families/families.module';
import { StoragesModule } from 'src/app/storages/storages.module';
import { SubfamiliesModule } from 'src/app/subfamilies/subfamilies.module';
import { BrandsModule } from '../app/brands/brands.module';
import { CompaniesModule } from '../app/companies/companies.module';
import { ReplacementsPiecesModule } from '../app/replacements-pieces/replacements-pieces.module';
import { StorageLocation } from '../app/storage-locations/entities/storage-location.entity';
import { StorageLocationsModule } from '../app/storage-locations/storage-locations.module';
import ormconfig from './ormconfig';
import { BrandsSeeder } from './seeders/brands.seeder';
import { CompaniesSeeder } from './seeders/companies.seeder';
import { FamiliesSeeder } from './seeders/families.seeder';
import { ReplacementsPiecesSeeder } from './seeders/replacements-pieces.seeder';
import { StoragesSeeder } from './seeders/storages.seeder';
import { SubfamiliesSeeder } from './seeders/subfamilies.seeder';

seeder({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    BrandsModule,
    CompaniesModule,
    ReplacementsPiecesModule,
    SubfamiliesModule,
    StorageLocation,
    StoragesModule,
    StorageLocationsModule,
    FamiliesModule,
  ],
}).run([
  // FamiliesSeeder,
  // SubfamiliesSeeder,
  // BrandsSeeder,
  // CompaniesSeeder,
  // StoragesSeeder,
  // ReplacementsPiecesSeeder,
]);
