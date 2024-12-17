import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Company } from '../../app/companies/entities/company.entity';

@Injectable()
export class CompaniesSeeder implements Seeder {
  async seed(): Promise<any> {
    const companies = DataFactory.createForClass(Company).generate(4);
    return Company.insert(companies);
  }

  async drop(): Promise<any> {
    return Company.delete({});
  }
}
