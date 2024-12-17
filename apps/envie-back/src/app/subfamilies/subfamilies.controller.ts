import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors
} from '@nestjs/common';
import { QueryUniqueViolationInterceptor } from '../../common/interceptors/query-unique-violation/query-unique-violation.interceptor';
import { CreateSubfamilyDto } from './dto/create-subfamily.dto';
import { UpdateSubfamilyDto } from './dto/update-subfamily.dto';
import { SubfamiliesService } from './subfamilies.service';

@Controller('subfamilies')
export class SubfamiliesController {
  constructor(private readonly subfamiliesService: SubfamiliesService) {}

  @UseInterceptors(
      new QueryUniqueViolationInterceptor(
          'Une sous-famille existe déjà avec le même nom !'
      )
  )
  @Post()
  create(@Body() createSubfamilyDto: CreateSubfamilyDto) {
    return this.subfamiliesService.create(createSubfamilyDto);
  }

  @Get()
  findAll() {
    return this.subfamiliesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subfamiliesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubfamilyDto: UpdateSubfamilyDto
  ) {
    return this.subfamiliesService.update(id, updateSubfamilyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subfamiliesService.remove(id);
  }
}
