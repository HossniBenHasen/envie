import { Module } from '@nestjs/common';
import { SubfamiliesController } from './subfamilies.controller';
import { SubfamiliesService } from './subfamilies.service';

@Module({
  controllers: [SubfamiliesController],
  providers: [SubfamiliesService],
})
export class SubfamiliesModule {}
