import { Injectable } from "@nestjs/common";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Company } from "../../app/companies/entities/company.entity";
import { Storage } from "../../app/storages/entities/storage.entity";

@Injectable()
export class StoragesSeeder implements Seeder {
    async seed(): Promise<any> {
        const storages = DataFactory.createForClass(Storage).generate(4);
        await Promise.all(storages.map(async (storage: any) => {
            const randomCompany = await Company.createQueryBuilder()
                .select()
                .orderBy('RANDOM()')
                .getOne();
            storage.company = randomCompany;
        }))

        return Storage.insert(storages);
    }

    async drop(): Promise<any> {
        return Storage.delete({});
    }
}