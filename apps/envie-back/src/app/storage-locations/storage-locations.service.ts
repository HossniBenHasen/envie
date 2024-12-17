import {
  HttpException,
  Injectable
} from '@nestjs/common';
import { Storage } from '../storages/entities/storage.entity';
import { CreateStorageLocationDto } from './dto/create-storage-location.dto';
import { PrintStorageLocationDto } from './dto/print-storage-location.dto';
import { StorageLocation } from './entities/storage-location.entity';

@Injectable()
export class StorageLocationsService {
  /**
   * Post new storage location {@link StorageLocation}.
   *
   * @returns {@link StorageLocation}
   */
  async createStorageLocations(
    createStorageLocationDto: CreateStorageLocationDto,
    storageId: string
  ) {
    const storage = await Storage.findOneBy({ id: storageId });

    if (!storage) {
      throw new HttpException("Storage not found", 404);
    }

    if (
      storage.numberOfRows >= createStorageLocationDto.rowNumber &&
      storage.columnPerRow >= createStorageLocationDto.columnNumber &&
      storage.shelfPerColumn >= createStorageLocationDto.shelfNumber &&
      storage.locationPerShelf >= createStorageLocationDto.locationNumber
    ) {
      return await StorageLocation.save({...createStorageLocationDto, storage});
    }

    throw new HttpException("Une erreur est survenu lors de la création", 500);
  }

  /**
   * Get all persisted {@link StorageLocation}.
   *
   * @returns list of persisted {@link StorageLocation}
   */
  getAllStorageLocations() {
    return StorageLocation.find({
      order: {
        storage: {
          name: 'ASC',
        },
        rowNumber: 'ASC',
        columnNumber: 'ASC',
        shelfNumber: 'ASC',
        locationNumber: 'ASC',

      },
      relations: {
        storage: {
          company: {
            storages: false
          },
        }
      },
    });
  }

  findAllForPrint(query: PrintStorageLocationDto) {
    return StorageLocation.find({
      where: {
        storage: {
          id: query.storage
        },
        rowNumber: query.rowNumber,
        columnNumber: query.columnNumber,
        shelfNumber: query.shelfNumber,
        locationNumber: query.locationNumber,
        uid: query.uid, //  adding uid

      },
      relations: {
        storage: {
          company: true
        }
      },
      order: {
        storage: {
          name: 'ASC',
        },
        rowNumber: 'ASC',
        columnNumber: 'ASC',
        shelfNumber: 'ASC',
        locationNumber: 'ASC',
      }
    })
  }
}
