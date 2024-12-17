import { HttpException, Injectable } from '@nestjs/common';
import { Company } from '../companies/entities/company.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import {ActivityType} from "../../common/enums/article-type.enum";

@Injectable()
export class FamiliesService {
  /**
   * Create a new {@link Family}.
   *
   * @param createFamilyDto {@link Family} creation data
   * @returns created {@link Company}
   */
  async create(createFamilyDto: CreateFamilyDto) {
    try {
      return await Family.save({...createFamilyDto});
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  /**
   * Find all {@link Family} in database.
   *
   * @returns list of persisted {@link Family}
   */
  async findAll(): Promise<Family[]> {
    return Family.find({
      order: {
        familyName: 'ASC',
      },
      relations: {subfamilies:true}
    });
  }

  async findByActivityType(activityTypeParameter: ActivityType): Promise<Family[]> {
    return Family.find({
      order: {
        familyName: 'ASC',
      },
      relations: {subfamilies:true},
      where: {
        activityType: activityTypeParameter
      }
    })
  }

  async findOne(id: string) {
    return Family.findOne({
      where: {
        id
      },
      relations: {subfamilies:true}
    });
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    try {
      const family = await Family.findOneBy({ id });

      if (!family) {
        throw new HttpException('Family not found', 404);
      }

      return await Family.save({id, ...updateFamilyDto});
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async remove(id: string) {
    try {
      const family = await Family.findOneBy({ id });

      if (!family) {
        throw new HttpException('Family not found', 404);
      }

      return await family.remove();
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
