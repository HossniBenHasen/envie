import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {OrderFiltersDto} from "./dto/order-filters.dto";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('filters')
  findAllFiltered(@Body() orderFiltersDto: OrderFiltersDto) {
    return this.ordersService.findAllFiltered(orderFiltersDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  //Recherche des orders a traiter pour le magasinier
  @Get('all')
  findAllNotDone(){
    return this.ordersService.findAllWithUser();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ordersService.findOneWithPieces(id);
  }

 /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Patch('prepare/:id')
  prepare(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.prepare(id, updateOrderDto);
  }
*/
  @Patch('deliver/:id')
  deliver(@Param('id') id: number) {
    return this.ordersService.deliver(id);
  }

  @Patch('cancel/:id')
  cancel(@Param('id') id: number) {
    return this.ordersService.cancel(id);
  }
}
