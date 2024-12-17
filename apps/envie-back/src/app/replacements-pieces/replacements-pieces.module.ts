import { Module } from '@nestjs/common';
import { ReplacementsPiecesController } from './replacements-pieces.controller';
import { ReplacementsPiecesService } from './replacements-pieces.service';
import {TravelHistoryModule} from "../travel-history/travel-history.module";

@Module({
  controllers: [ReplacementsPiecesController],
  imports: [TravelHistoryModule],
  providers: [ReplacementsPiecesService]
})
export class ReplacementsPiecesModule {}
