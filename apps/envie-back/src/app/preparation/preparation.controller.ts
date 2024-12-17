import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreparationService } from './preparation.service';
import { CreatePreparationDto } from './dto/create-preparation.dto';
import { UpdatePreparationDto } from './dto/update-preparation.dto';

@Controller('preparation')
export class PreparationController {
  constructor(private readonly preparationService: PreparationService) {}

  @Post()
  create(@Body() createPreparationDto: CreatePreparationDto) {
    return this.preparationService.create(createPreparationDto);
  }

  @Get()
  findAll() {
    return this.preparationService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.preparationService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preparationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreparationDto: UpdatePreparationDto) {
    return this.preparationService.update(+id, updatePreparationDto);
  }

  @Delete(':preparationId/piece/:pieceId')
  removePiece(@Param('preparationId') preparationId: number, @Param('pieceId') pieceId: number) {
    return this.preparationService.removeReplacementPiece(preparationId, pieceId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preparationService.remove(+id);
  }
}
