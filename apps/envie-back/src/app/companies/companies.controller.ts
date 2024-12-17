import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { QueryUniqueViolationInterceptor } from '../../common/interceptors/query-unique-violation/query-unique-violation.interceptor';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseInterceptors(
    new QueryUniqueViolationInterceptor(
      'Une entreprise existe déjà avec le même nom et/ou siret !'
    )
  )
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  // @HasRoles(Role.admin)
  // @UseGuards(AdminGuard, RolesGuard)
  async findAll() {
    return this.companiesService.findAll();
  }
}
