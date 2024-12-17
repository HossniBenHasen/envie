import { HttpException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {

  /**
   * Create a new {@link Company}.
   *
   * @param createCompanyDto {@link Company} creation data
   * @returns created {@link Company}
   */
  async create(createCompanyDto: CreateCompanyDto) {
    try {
      return await Company.save({ ...createCompanyDto });
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  /**
   * Find all {@link Company} in database.
   *
   * @returns list of persisted {@link Company}
   */
  async findAll() {
    return Company.find({
      order: {
        id: 'ASC',
      },
      loadEagerRelations: false,
      relations: {
        storages: true,
      },
    });
  }
}
