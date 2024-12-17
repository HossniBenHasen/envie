import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import { Company } from '../companies/entities/company.entity';
import { CreateSubfamilyDto } from './dto/create-subfamily.dto';
import { UpdateSubfamilyDto } from './dto/update-subfamily.dto';
import { Subfamily } from './entities/subfamily.entity';
import {Family} from "../families/entities/family.entity";

@Injectable()
export class SubfamiliesService {
  /**
   * Create a new {@link Subfamily}.
   *
   * @param createSubfamilyDto {@link Subfamily} creation data
   * @returns created {@link Company}
   */
  async create(createSubfamilyDto: CreateSubfamilyDto) {
    try {
      const family = await Family.findOneBy({id: createSubfamilyDto.familyId});
      if (!family) {
        throw new NotFoundException(`Family with id ${createSubfamilyDto.familyId} not found`);
      }

      const subfamilies = {
        ...createSubfamilyDto,
        family
      }

      return await Subfamily.save(subfamilies)
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  /**
   * Find all {@link Subfamily} in database.
   *
   * @returns list of persisted {@link Subfamily}
   */
  findAll(): Promise<Subfamily[]> {
    return Subfamily.find({
      order: {
        subfamilyName: 'ASC',
      },
      relations: {
        family: true
      }
    });
  }

  findOne(id: string) {
    return Subfamily.findOneBy({ id });
  }

  async update(id: string, updateSubfamilyDto: UpdateSubfamilyDto) {
    try {
      const subFamily = await Subfamily.findOneBy({ id });

      if (!subFamily) {
        throw new HttpException('SubFamily not found', 404);
      }

      return await Subfamily.save({id, ...updateSubfamilyDto});
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async remove(id: string) {
    try {
      const subFamily = await Subfamily.findOneBy({ id });

      if (!subFamily) {
        throw new HttpException('SubFamily not found', 404);
      }

      return await subFamily.remove();
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
