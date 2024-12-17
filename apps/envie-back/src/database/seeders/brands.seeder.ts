import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Brand } from "../../app/brands/entities/brand.entity";

@Injectable()
export class BrandsSeeder implements Seeder {
    async seed(): Promise<any> {
        const brands = DataFactory.createForClass(Brand).generate(10);
        return Brand.insert(brands);
    }

    async drop(): Promise<any> {
        return Brand.delete({});
    }
}
