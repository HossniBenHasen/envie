import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { QueryUniqueViolationInterceptor } from 'src/common/interceptors/query-unique-violation/query-unique-violation.interceptor';
import { CreateStorageLocationDto } from './dto/create-storage-location.dto';
import { PrintStorageLocationDto } from './dto/print-storage-location.dto';
import { StorageLocationsService } from './storage-locations.service';

@Controller('storage-locations')
export class StorageLocationsController {
  constructor(private readonly storageLocationsService: StorageLocationsService) {}

  @Get()
  async getAllPieces() {
    return await this.storageLocationsService.getAllStorageLocations()
  }

  @Get('print')
  findAllForPrint(@Query() query: PrintStorageLocationDto) {
    return this.storageLocationsService.findAllForPrint(query);
  }

  @Post(':storageId')
  @UseInterceptors(
    new QueryUniqueViolationInterceptor(
      'Le stockage existe déjà avec le même emplacement de stockage !'
    )
  )
  create(@Param('storageId') storageId: string, @Body() createStorageLocationDto: CreateStorageLocationDto) {
    return this.storageLocationsService.createStorageLocations(createStorageLocationDto, storageId);
  }

}
