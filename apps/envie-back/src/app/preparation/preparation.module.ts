import { Module } from '@nestjs/common';
import { PreparationService } from './preparation.service';
import { PreparationController } from './preparation.controller';

@Module({
  controllers: [PreparationController],
  providers: [PreparationService]
})
export class PreparationModule {}
