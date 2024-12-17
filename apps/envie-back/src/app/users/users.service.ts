import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Company } from '../companies/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from "./entities/user.entity";
import { Role } from "../auth/roles/role-enum";


@Injectable()
export class UsersService {

  /**
   * Create a new {@link User}.
   *
   * @param createUserDto {@link User} creation data
   * @returns created {@link User}
   */
  async create(createUserDto: CreateUserDto) {
    try {
      let user = new User();
      user.username = createUserDto.username;
      user.role = createUserDto.role;
      user.password = bcrypt.hashSync(createUserDto.password, 10);
      
      const company = await Company.findOneBy({id: createUserDto.companyId});
      if (!company) {
        throw new HttpException('Company not found', 404);
      }
      user.company = company;

      return await user.save();

    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async findAll(): Promise<User[]> {
    return User.find({
      relations: {
        company: true
      }
    });
  }

  findOne(id: string) {
    return User.findOne({
      where: {
        id
      },
      relations: {
        company: true
      }
    })
  }

  findOperator() {
    return User.find({
      where: [
          {role : Role.OPERATOR},
          {role : Role.WAREHOUSEMAN}
          ],
      relations: {
        company: true
      },
    })
  }

  async remove(id: string) {
    try {
      const user = await User.findOneBy({id});
      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return await user.remove();
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
