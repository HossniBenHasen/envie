import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '../companies/entities/company.entity';
import { StorageLocation } from '../storage-locations/entities/storage-location.entity';
import { CreateStorageDto } from './dto/create-storage.dto';
import { Storage } from './entities/storage.entity';

@Injectable()
export class StoragesService {
  /**
   * Create a new {@link Storage}.
   *
   * @param createStorageDto {@link Storage} creation data
   * @returns created {@link Storage}
   */
  async create(createStorageDto: CreateStorageDto) {
    try {
      const company = await Company.findOneBy({ id: createStorageDto.companyId });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const storage = {
        ...createStorageDto,
        company,
      }

      const resultStorage = await Storage.save(storage);

      let listStorageLocation = [];
      for (let rangee = 1; rangee <= createStorageDto.numberOfRows; rangee++) {
        for (let colonne = 1; colonne <= createStorageDto.columnPerRow; colonne++) {
          for (let etagere = 1; etagere <= createStorageDto.shelfPerColumn; etagere++) {
            for (let emplacement = 1; emplacement <= createStorageDto.locationPerShelf; emplacement++) {
              const storageLocation = {
                rowNumber: rangee,
                columnNumber: colonne,
                shelfNumber: etagere,
                locationNumber: emplacement,
                storage: storage
              }
              listStorageLocation.push(storageLocation);
            }
          }
        }
      }

      await StorageLocation.save(listStorageLocation);

      return resultStorage;
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  /**
   * Get all persisted {@link Storage}.
   *
   * @returns list of persisted {@link Storage}
   */
  findAll() {
    return Storage.find();
  }

  /**
   * Get storage by id {@link Storage}
   *
   * @returns one storage
   */
  findStorageById(id: string) {
    return Storage.findOne({
      relations: {
        storageLocations: true
      },
      where: {
        id: id,
      },
    });
  }

  /**
   * Get a {@link StorageLocation} by id.
   *
   * @returns matched {@link StorageLocation}
   * @param storageId
   * @param storageLocationId
   */
  async getStorageById(storageId: string, storageLocationId: string) {
    const storage = await Storage.findOneBy({id: storageId})

    if (!storage) {
      throw new HttpException("Storage not found", 404);
    }

    const storageLocation = await StorageLocation.findOneBy({id: storageLocationId})

    if (!storageLocation) {
      throw new HttpException("Storage Location not found", 404);
    }

    return storageLocation;
  }
}
