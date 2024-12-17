import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Family } from '../../app/families/entities/family.entity';

@Injectable()
export class FamiliesSeeder implements Seeder {
  async seed(): Promise<any> {
    const families = DataFactory.createForClass(Family).generate(5);
    return Family.insert(families);
  }

  async drop(): Promise<any> {
    return Family.delete({});
  }
}
