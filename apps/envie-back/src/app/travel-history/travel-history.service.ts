import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { ReplacementPiece } from "../replacements-pieces/entities/replacement-piece.entity";
import { StorageLocation } from "../storage-locations/entities/storage-location.entity";
import { CreateTravelHistoryDto } from "./dto/create-travel-history.dto";
import { TravelHistory } from "./entities/travel-history.entity";

@Injectable()
export class TravelHistoryService {

    async create(id: number, createTravelHistoryDto: CreateTravelHistoryDto) {
        try {
            const replacementPiece = await ReplacementPiece.findOneBy({id});
            const storageLocation = await StorageLocation.findOneBy({id: createTravelHistoryDto.storageLocationId})

            if (!replacementPiece) {
                throw new NotFoundException();
            }

            if (!storageLocation) {
                throw new NotFoundException();
            }

            const history = {
                ...createTravelHistoryDto,
                replacementPiece,
                storageLocation
            }
            return await TravelHistory.save({...history})

        } catch (e) {
            throw new HttpException(e, 500);
        }
    }

    async getTravelHistory(id: number) {
        const piece = await ReplacementPiece.findOneBy({id})

        if (!piece) {
            throw new NotFoundException("Aucune pièce de rechange ne correspond à l'id spécifié !");
        }

        return TravelHistory.find({
            where: {
                replacementPiece: {
                    id
                }
            },
            order: {
                replacementPiece: {
                    id: "ASC"
                },
                createdAt: "ASC",
                action: "ASC"
            }
        })
    }
}