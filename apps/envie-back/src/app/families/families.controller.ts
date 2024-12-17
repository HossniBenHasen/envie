import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors
} from '@nestjs/common';
import { QueryUniqueViolationInterceptor } from '../../common/interceptors/query-unique-violation/query-unique-violation.interceptor';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamiliesService } from './families.service';
import {ActivityType} from "../../common/enums/article-type.enum";
  
  @Controller('families')
  export class FamiliesController {
    constructor(private readonly familiesService: FamiliesService) {}
  
    @UseInterceptors(
      new QueryUniqueViolationInterceptor(
        'Une famille existe déjà avec le même nom !'
      )
    )
    @Post()
    create(@Body() createFamilyDto: CreateFamilyDto) {
      return this.familiesService.create(createFamilyDto);
    }
    
    @Get()
    findAll() {
      return this.familiesService.findAll();
    }

    @Get('activity-type/:activityType')
    findAllByActivityType(@Param('activityType') activityType: ActivityType ) {
      return this.familiesService.findByActivityType(activityType);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.familiesService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateFamilyDto: UpdateFamilyDto
    ) {
      return this.familiesService.update(id, updateFamilyDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.familiesService.remove(id);
    }
  }
  