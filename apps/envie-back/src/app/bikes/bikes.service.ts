import { HttpException ,Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '../brands/entities/brand.entity';
import { Bike } from './entities/bike.entity';
import { StorageLocation } from '../storage-locations/entities/storage-location.entity';
import { Subfamily } from '../subfamilies/entities/subfamily.entity';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { AssociateArticleToStorageLocationDto } from '../replacements-pieces/dto/associate-article-to-storage-location.dto';

@Injectable()
export class BikesService {
  

   /**
   * Create a new {@link Bike}.
   *
   * @param createBikeDto {@link Bike} creation data
   * @returns created {@link Bike}
   */

  async create(createBikeDto: CreateBikeDto) {
    try {
      const subfamily = await Subfamily.findOneBy({id: createBikeDto.subfamilyId});
      if (!subfamily) {
        throw new NotFoundException(`Family with id ${createBikeDto.subfamilyId} not found`);
      }

      const brand = await Brand.findOneBy({id: createBikeDto.brandId});
      if (!brand) {
        throw new NotFoundException(`Brand with id ${createBikeDto.brandId} not found`);
      }

      const bike = {
        ...createBikeDto,
        subfamily,
        brand,

      }
      return await Bike.save(bike)
  } catch (e){
    throw new HttpException(e, 500);
  }
}

    /**
   * Get all persisted {@link Bike}.
   *
   * @returns list of persisted {@link Bike}
   */ 
  findAll() {
    return Bike.find({
      relations: {
        storageLocation: {
          storage: {
            company: {
              storages: false
            }
          }
        },
        subfamily: {
          family: true
        }
      }
    });
  }
   /**
   * Get a {@link Bike} by id.
   *
   * @param id id of {@link Bike} to get
   * @returns matched {@link Bike}
   */
  async findOne(id: number) {
   const piece = await Bike.findOneBy({ id });
    
   if (!piece) {
      throw new NotFoundException("Aucune pièce de rechange ne correspond à l'id spécifié !");
    }
    return piece;
  }

  async associateArticleToStorageLocation(
    bikeId: number,
    associateArticleToStorageLocationDto: AssociateArticleToStorageLocationDto) {

    const bike = await Bike.findOneBy({id :bikeId})
    const storageLocation = await StorageLocation.findOneBy({ id: associateArticleToStorageLocationDto.storageLocation });

    if (bike && storageLocation) {
      bike.storageLocation = storageLocation;

      return await bike.save();
    }

    throw new NotFoundException(
      "Aucune pièce de rechange ne correspond à l'id spécifié !"
    );
  }
  async update(id: number, updateBikeDto: UpdateBikeDto) {
    try {
      const remplacementbike= await Bike.findOneBy({id});

      if (!remplacementbike) {
        throw new NotFoundException('Replacement piece not found');
      }

      if (updateBikeDto.subfamilyId) {
        const subfamily = await Subfamily.findOneBy({id: updateBikeDto.subfamilyId});
        if (!subfamily) {
          throw new NotFoundException(`Family with id ${updateBikeDto.subfamilyId} not found`);
        }
        remplacementbike.subfamily = subfamily;
      }

      if (updateBikeDto.brandId) {
        const brand = await Brand.findOneBy({id: updateBikeDto.brandId});
        if (!brand) {
          throw new NotFoundException(`Brand with id ${updateBikeDto.brandId} not found`);
        }
        remplacementbike.brand = brand;
      }

      return await Bike.save({...remplacementbike, ...updateBikeDto});
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async remove(id: number) {
    try {
      const bike = await Bike.findOneBy({id});

      if (!bike) {
        throw new NotFoundException('Bike not found',);
      }

      return await Bike.remove(bike);
    } catch (e) {
      throw new HttpException(e, 500);
    
    }
  }
}
