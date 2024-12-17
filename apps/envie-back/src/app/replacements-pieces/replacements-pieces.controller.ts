import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AssociateArticleToStorageLocationDto } from "./dto/associate-article-to-storage-location.dto";
import { CreateReplacementPieceDto } from './dto/create-replacement-piece.dto';
import { UpdateReplacementPieceDto } from "./dto/update-replacement-piece.dto";
import { ReplacementsPiecesService } from './replacements-pieces.service';
import {FiltersDto} from "./dto/filters.dto";

@Controller('replacements-pieces')
export class ReplacementsPiecesController {
    constructor(private readonly replacementsPiecesService: ReplacementsPiecesService) {}

    @Post()
    create(@Body() createReplacementPieceDto: CreateReplacementPieceDto) {
        return this.replacementsPiecesService.create(createReplacementPieceDto);
    }

    @Post('filters')
    findPiecesByFiltersAndUserEnterprise(
        @Body()
            filtersDto: FiltersDto
    ) {
        return this.replacementsPiecesService.findPiecesByFiltersAndUserEnterprise(filtersDto);
    }

    @Post('many')
    createMany(@Body() pieces: CreateReplacementPieceDto[]) {
        return this.replacementsPiecesService.createMany(pieces);
    }

    @Get()
    findAll() {
        return this.replacementsPiecesService.findAll();
    }

    @Get('designation')
    findAllDesignation() {
        return this.replacementsPiecesService.findAllDesignation();
    }

    @Get('linked')
    findAllLinkedToStorageLocation() {
        return this.replacementsPiecesService.findAllLinkedToStorageLocation();
    }

    @Get(':id')
    findOne(@Param("id") id: number) {
        return this.replacementsPiecesService.findOne(id);
    }

    @Get('bySerialNumber/:serialNumber')
    findAllBySerialNumber(@Param("serialNumber") serialNumber: string) {
        return this.replacementsPiecesService.findAllBySerialNumber(serialNumber);
    }

    @Patch(':id')
    update(
        @Param('id') replacementPieceId: number,
        @Body() updateReplacementPieceDto: UpdateReplacementPieceDto) {
        return this.replacementsPiecesService.update(replacementPieceId, updateReplacementPieceDto)
    }

    @Patch('app/associate/:replacementPieceId')
    associateArticleToStorageLocation(
        @Param('replacementPieceId') replacementPieceId: number,
        @Body() associateArticleToStorageLocationDto: AssociateArticleToStorageLocationDto) {
        return this.replacementsPiecesService.associateArticleToStorageLocation(replacementPieceId, associateArticleToStorageLocationDto)
    }

    @Patch('app/remove/:replacementPieceId')
    removeArticleToStorageLocation(
        @Param('replacementPieceId') replacementPieceId: number) {
        return this.replacementsPiecesService.removeArticleToStorageLocation(replacementPieceId)
    }
}
