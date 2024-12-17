import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {TravelHistoryService} from "./travel-history.service";
import {CreateTravelHistoryDto} from "./dto/create-travel-history.dto";

@Controller('travel-history')
export class TravelHistoryController {

    constructor(private readonly travelHistoryService: TravelHistoryService) {
    }
    @Post(':pieceId')
    create(@Param('pieceId') pieceId: number, @Body() createTravelHistoryDto: CreateTravelHistoryDto) {
        return this.travelHistoryService.create(pieceId, createTravelHistoryDto);
    }

    @Get(':pieceId')
    getTravelHistoryById(@Param('pieceId') pieceId: number){
        return this.travelHistoryService.getTravelHistory(pieceId)
    }

}