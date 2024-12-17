import { Injectable } from "@nestjs/common";
import { DataFactory, Seeder } from "nestjs-seeder";
import { Brand } from "src/app/brands/entities/brand.entity";
import { Subfamily } from "src/app/subfamilies/entities/subfamily.entity";
import { ReplacementPiece } from "../../app/replacements-pieces/entities/replacement-piece.entity";

@Injectable()
export class ReplacementsPiecesSeeder implements Seeder {
    async seed(): Promise<any> {
        const replacementPieces = DataFactory.createForClass(ReplacementPiece).generate(45);
        await Promise.all(replacementPieces.map(async (replacementPiece: any) => {
            const randomSubfamily = await Subfamily.createQueryBuilder()
                .select()
                .orderBy('RANDOM()')
                .getOne();
            replacementPiece.subfamily = randomSubfamily;

            const randomBrand = await Brand.createQueryBuilder()
                .select()
                .orderBy('RANDOM()')
                .getOne();
            replacementPiece.brand = randomBrand;
        }))

        return ReplacementPiece.insert(replacementPieces);
    }

    async drop(): Promise<any> {
        return ReplacementPiece.delete({});
    }
}