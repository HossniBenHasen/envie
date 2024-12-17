import { HttpException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from "./entities/brand.entity";

@Injectable()
export class BrandsService {
    /**
     * Create a new {@link Brand}.
     *
     * @param createBrandDto {@link Brand} creation data
     * @returns created {@link Brand}
     */
    async create(createBrandDto: CreateBrandDto) {
        try {
            return await Brand.save({...createBrandDto})
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    /**
     * Find all {@link Brand} in database.
     *
     * @returns list of persisted {@link Brand}
     */
    findAll(): Promise<Brand[]> {
        return Brand.find({
            order: {
                brandName: 'ASC'
            }
        })
    }

    /**
     * It returns a promise that resolves to a single Brand object
     * @param {string} id - The id of the brand you want to find.
     * @returns A promise that resolves to a Brand instance.
     */
    findOne(id: string) {
        return Brand.findOneBy({id});
    }

    async update(id: string, updateBrandDto: UpdateBrandDto) {
        try {
            const brand = await Brand.findOneBy({id});
    
            if (!brand) {
                throw new HttpException('Brand not found', 404);
            }

            return await Brand.save({id, ...updateBrandDto});
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    async remove(id: string) {
        try {
            const brand = await Brand.findOneBy({id});
            
            if (!brand) {
                throw new HttpException('Brand not found', 404);
            }

            return await brand.remove();
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }
}
