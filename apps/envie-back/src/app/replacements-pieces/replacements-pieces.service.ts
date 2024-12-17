import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import {Brand} from '../brands/entities/brand.entity';
import {StorageLocation} from '../storage-locations/entities/storage-location.entity';
import {Subfamily} from '../subfamilies/entities/subfamily.entity';
import {AssociateArticleToStorageLocationDto} from "./dto/associate-article-to-storage-location.dto";
import {CreateReplacementPieceDto} from './dto/create-replacement-piece.dto';
import {UpdateReplacementPieceDto} from "./dto/update-replacement-piece.dto";
import {ReplacementPiece} from './entities/replacement-piece.entity';
import {TravelHistoryService} from "../travel-history/travel-history.service";
import {ActionTravelHistory} from "../travel-history/enums/action-travel-history.enum";
import {IsNull, Not} from 'typeorm';
import {Company} from "../companies/entities/company.entity";
import {User} from "../users/entities/user.entity";
import {FiltersDto} from "./dto/filters.dto";
import {Family} from "../families/entities/family.entity";

@Injectable()
export class ReplacementsPiecesService {
    constructor(
        readonly travelHistoryService: TravelHistoryService
    ) {
    }

    /**
     * @deprecated
     * Create a new {@link ReplacementPiece}.
     * @param createReplacementPieceDto {@link ReplacementPiece} creation data
     * @returns created {@link ReplacementPiece}
     */
    async create(createReplacementPieceDto: CreateReplacementPieceDto) {
        try {
            const subfamily = await Subfamily.findOneBy({id: createReplacementPieceDto.subfamilyId});
            if (!subfamily) {
                throw new NotFoundException(`Subfamily with id ${createReplacementPieceDto.subfamilyId} not found`);
            }

            const brand = await Brand.findOneBy({id: createReplacementPieceDto.brandId});
            if (!brand) {
                throw new NotFoundException(`Brand with id ${createReplacementPieceDto.brandId} not found`);
            }

            const user = await User.findOneBy({id: createReplacementPieceDto.userId});
            if (!user) {
                throw new NotFoundException(`User with id ${createReplacementPieceDto.userId} not found`);
            }

            const replacementPiece = {
                ...createReplacementPieceDto,
                subfamily,
                brand,
                user
            }

            return await ReplacementPiece.save(replacementPiece)
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    /**
     * Créer plusieurs pièces détachées
     * @param pieces: [] (tableau de pièces détachées)
     */
    async createMany(pieces: CreateReplacementPieceDto[]) {
        try {
            let replacementPiecesToSave: any[] = [];
            for (let p of pieces) {
                const subfamily = await Subfamily.findOneBy({id: p.subfamilyId});
                if (!subfamily) {
                    throw new NotFoundException(`Subfamily with id ${p.subfamilyId} not found`);
                }

                const brand = await Brand.findOneBy({id: p.brandId});
                if (!brand) {
                    throw new NotFoundException(`Brand with id ${p.brandId} not found`);
                }

                const user = await User.findOneBy({id: p.userId});
                if (!user) {
                    throw new NotFoundException(`User with id ${p.userId} not found`);
                }

                const company = await Company.findOneBy({id: p.companyId});
                if (!company) {
                    throw new NotFoundException(`Company with id ${p.companyId} not found`);
                }

                const replacementPiece = {
                    ...p,
                    subfamily,
                    brand,
                    user,
                    company
                }

                replacementPiecesToSave.push(replacementPiece);
            }
            return await ReplacementPiece.save(replacementPiecesToSave)
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    /**
     * Get all persisted {@link ReplacementPiece}.
     *
     * @returns list of persisted {@link ReplacementPiece}
     */
    findAll() {
        return ReplacementPiece.find({
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
            },
            order: {
                id: 'ASC',
            },
        });
    }

    findAllLinkedToStorageLocation() {
        return ReplacementPiece.find({
            where: {
                storageLocation: Not(IsNull())
            },
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
     * retourne les différentes désignations pour filtrer les pièces
     */
    async findAllDesignation() {
        const rps = await ReplacementPiece.createQueryBuilder('rp')
            .select('rp.designationInterne', 'designationInterne')
            .distinctOn(['rp.designationInterne'])
            .getRawMany();

        const uniqueRPs = Array.from(new Set(
            rps.map((rp) => rp.designationInterne.trim().toUpperCase())
        ));

        return uniqueRPs.map((rp: string) => ({
            designationInterne: rp,
        }));
    }

    /**
     * Get filtered replacement pieces
     * @param filtersDto
     */
    async findPiecesByFiltersAndUserEnterprise(filtersDto: FiltersDto) {
        let data = await ReplacementPiece.find({
            select: {
                user: {
                    id: true
                },
                subfamily: {
                    family: { id: true, familyName: true }
                },
                brand: { brandName: true },
                company: { id: true, name: true }
            },
            where: {
                company: {
                    id: filtersDto.companyId ? filtersDto.companyId : undefined
                },
                subfamily: {
                    family: {
                        id: filtersDto.familyId ? filtersDto.familyId : undefined
                    }
                },
                brand: {
                    id: filtersDto.brandId ? filtersDto.brandId : undefined
                },
                designationInterne: filtersDto.designationInterne ? filtersDto.designationInterne : undefined
            },
            relations: {
                subfamily: {
                    family: true,
                },
                brand: true,
                company: true,
                storageLocation: true,
                order: true
            }
        })

        if (!data) throw new HttpException('Elements not found', 404);
        for (let el of data) {
            el.designationInterne = el.designationInterne.toUpperCase();
        }

        data = data.filter((el) => (el.storageLocation !== null));
        data = data.filter((el) => (!el.order?.id));
        return data;
    }

    /**
     * Get a {@link ReplacementPiece} by id.
     *
     * @param id id of {@link ReplacementPiece} to get
     * @returns matched {@link ReplacementPiece}
     */
    async findOne(id: number) {
        const piece = await ReplacementPiece.findOneBy({id});

        if (!piece) {
            throw new NotFoundException("Aucune pièce de rechange ne correspond à l'id spécifié !");
        }

        return piece;
    }

    async findAllBySerialNumber(serialNumber: string) {
        return ReplacementPiece.find({
            where: {
                serialNumber: serialNumber
            }
        })
    }

    async update(id: number, updateReplacementPieceDto: UpdateReplacementPieceDto) {
        try {
            const replacementPiece = await ReplacementPiece.findOneBy({id});

            if (!replacementPiece) {
                throw new HttpException('Replacement piece not found', 404);
            }

            if (updateReplacementPieceDto.subfamilyId) {
                const subfamily = await Subfamily.findOneBy({id: updateReplacementPieceDto.subfamilyId});
                if (!subfamily) {
                    throw new NotFoundException(`Subfamily with id ${updateReplacementPieceDto.subfamilyId} not found`);
                }
                replacementPiece.subfamily = subfamily;
            }

            if (updateReplacementPieceDto.brandId) {
                const brand = await Brand.findOneBy({id: updateReplacementPieceDto.brandId});
                if (!brand) {
                    throw new NotFoundException(`Brand with id ${updateReplacementPieceDto.brandId} not found`);
                }
                replacementPiece.brand = brand;
            }

            if (updateReplacementPieceDto.userId) {
                const user = await User.findOneBy({id: updateReplacementPieceDto.userId});
                if (!user) {
                    throw new NotFoundException(`User with id ${updateReplacementPieceDto.userId} not found`);
                }
                replacementPiece.user = user;
            }

            return await ReplacementPiece.save({...replacementPiece, ...updateReplacementPieceDto});
        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    async associateArticleToStorageLocation(
        replacementPieceId: number,
        associateArticleToStorageLocationDto: AssociateArticleToStorageLocationDto) {

        const piece = await ReplacementPiece.findOneBy({id: replacementPieceId});
        const storageLocation = await StorageLocation.findOneBy({id: associateArticleToStorageLocationDto.storageLocation});

        if (piece && storageLocation) {
            await this.travelHistoryService.create(replacementPieceId, {
                action: piece.storageLocation ? ActionTravelHistory.MOVED_TO_STOCK : ActionTravelHistory.ADDED_TO_STOCK,
                referringUser: "user",
                storageLocationId: storageLocation.id
            });
            piece.storageLocation = storageLocation;
            return await piece.save();
        }

        throw new NotFoundException(
            "Aucune pièce de rechange ne correspond à l'id spécifié !"
        );
    }

    async removeArticleToStorageLocation(replacementPieceId: number) {
        const piece = await ReplacementPiece.findOneBy({id: replacementPieceId});

        if (piece && piece.storageLocation) {
            await this.travelHistoryService.create(replacementPieceId, {
                action: ActionTravelHistory.REMOVE_TO_STOCK,
                referringUser: "user",
                storageLocationId: piece.storageLocation.id
            });
            piece.storageLocation = null
            return await piece.save();
        }

        throw new NotFoundException(
            "Aucune pièce de rechange ne correspond à l'id spécifié !"
        );
    }
}
