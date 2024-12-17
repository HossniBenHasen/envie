import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  exports: [OrdersService],
  providers: [OrdersService]
})
export class OrdersModule {}
