import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import {
  QueryUniqueViolationInterceptor
} from 'src/common/interceptors/query-unique-violation/query-unique-violation.interceptor';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StoragesService } from './storages.service';

@Controller('storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Post()
  @UseInterceptors(
    new QueryUniqueViolationInterceptor(
      'Un entrepôt de stockage existe déjà avec le même nom ou/et le nom interne !'
    )
  )
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storagesService.create(createStorageDto);
  }

  @Get()
  findAll() {
    return this.storagesService.findAll();
  }

  @Get(':storageId/storage-locations/:storageLocationId')
  getStorageById(@Param('storageId') storageId: string, @Param('storageLocationId') storageLocationId: string){
    return this.storagesService.getStorageById(storageId, storageLocationId)
  }
}
