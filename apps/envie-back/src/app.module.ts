import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from "./app/auth/auth.module";
import { AdminGuard } from "./app/auth/roles/admin.guard";
import { RolesGuard } from "./app/auth/guards/roles.guard";
import { SuperAdminGuard } from "./app/auth/roles/super-admin.guard";
import { BikesModule } from "./app/bikes/bikes.module";
import { BrandsModule } from "./app/brands/brands.module";
import { CompaniesModule } from './app/companies/companies.module';
import { FamiliesModule } from './app/families/families.module';
import { ReplacementsPiecesModule } from './app/replacements-pieces/replacements-pieces.module';
import { StorageLocationsModule } from "./app/storage-locations/storage-locations.module";
import { StoragesModule } from './app/storages/storages.module';
import { SubfamiliesModule } from './app/subfamilies/subfamilies.module';
import { TravelHistoryModule } from "./app/travel-history/travel-history.module";
import { UsersModule } from "./app/users/users.module";
import ormconfig from './database/ormconfig';
import { PreparationModule } from './app/preparation/preparation.module';
import { OrdersModule } from './app/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    BikesModule,
    BrandsModule,
    CompaniesModule,
    ReplacementsPiecesModule,
    PreparationModule,
    StoragesModule,
    StorageLocationsModule,
    StoragesModule,
    SubfamiliesModule,
    TravelHistoryModule,
    UsersModule,
    FamiliesModule,
    OrdersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [],
  providers: [AppService, RolesGuard, AdminGuard, SuperAdminGuard],
})
export class AppModule {
}
