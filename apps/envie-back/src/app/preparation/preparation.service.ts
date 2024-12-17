import { HttpException, Injectable } from '@nestjs/common';
import { ReplacementPiece } from '../replacements-pieces/entities/replacement-piece.entity';
import { User } from '../users/entities/user.entity';
import { CreatePreparationDto } from './dto/create-preparation.dto';
import { UpdatePreparationDto } from './dto/update-preparation.dto';
import { Preparation } from './entities/preparation.entity';
import { PreparationStatut } from './enums/preparation-statut.enum';

@Injectable()
export class PreparationService {
  async create(createPreparationDto: CreatePreparationDto) {
    try {
      const user = await User.findOneBy({ id: createPreparationDto.userId });
      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const replacementPieces = await Promise.all(createPreparationDto.replacementPiecesId.map(async (id) => {
        const replacementPiece = await ReplacementPiece.findOneBy({ id });

        if (!replacementPiece) {
          throw new HttpException('ReplacementPiece not found', 404);
        }

        return replacementPiece;
      }))

      return await Preparation.save({
        user,
        replacementPieces,
        statut: createPreparationDto.statut || PreparationStatut.IN_PROGRESS,
        name: createPreparationDto.name,
        comment: createPreparationDto.comment,
      })
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  findAll() {
    return Preparation.find();
  }

  findByUser(userId: string) {
    return Preparation.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        statut: 'DESC',
        replacementPieces: {
          storageLocation: {
            rowNumber: 'ASC',
            columnNumber: 'ASC',
            shelfNumber: 'ASC',
            locationNumber: 'ASC',
          }
        }
      }
    })
  }

  findOne(id: number) {
    return Preparation.findOneBy({ id });
  }

  async update(id: number, updatePreparationDto: UpdatePreparationDto) {
    try {
      // On récupère la préparation
      const preparation = await Preparation.findOneBy({ id });

      if (!preparation) {
        throw new HttpException('Preparation not found', 404);
      }

      // On récupère les pièces de rechange
      const replacementPieces = await Promise.all(updatePreparationDto.replacementPiecesId.map(async (id) => {
        const replacementPiece = await ReplacementPiece.findOneBy({ id });

        if (!replacementPiece) {
          throw new HttpException('ReplacementPiece not found', 404);
        }

        return replacementPiece;
      }))

      // On met à jour la préparation
      preparation.replacementPieces.push(...replacementPieces);
      preparation.statut = updatePreparationDto.statut || PreparationStatut.IN_PROGRESS;

      return await Preparation.save(preparation);
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async remove(id: number) {
    try {
      const preparation = await Preparation.findOneBy({ id });

      if (!preparation) {
        throw new HttpException('Preparation not found', 404);
      }

      return await Preparation.remove(preparation);
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }

  async removeReplacementPiece(preparationId: number, replacementPieceId: number) {
    try {
      const preparation = await Preparation.findOneBy({ id: preparationId });

      if (!preparation) {
        throw new HttpException('Preparation not found', 404);
      }

      const replacementPiece = await ReplacementPiece.findOneBy({ id: replacementPieceId });

      if (!replacementPiece) {
        throw new HttpException('ReplacementPiece not found', 404);
      }

      preparation.replacementPieces = preparation.replacementPieces.filter((rp) => rp.id !== replacementPiece.id);

      return await Preparation.save(preparation);
    } catch (e) {
      throw new HttpException(e, 500);
    }
  }
}
