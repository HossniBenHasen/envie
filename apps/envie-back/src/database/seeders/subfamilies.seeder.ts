import { Injectable } from '@nestjs/common';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Family } from 'src/app/families/entities/family.entity';
import { Subfamily } from '../../app/subfamilies/entities/subfamily.entity';

@Injectable()
export class SubfamiliesSeeder implements Seeder {
  async seed(): Promise<any> {
    const subfamilies = DataFactory.createForClass(Subfamily).generate(10);

    await Promise.all(subfamilies.map(async (subfamily: any) => {
      const randomFamily = await Family.createQueryBuilder()
        .select()
        .orderBy('RANDOM()')
        .getOne();
      subfamily.family = randomFamily;
    }))
    
    return Subfamily.insert(subfamilies);
  }

  async drop(): Promise<any> {
    return Subfamily.delete({});
  }
}
