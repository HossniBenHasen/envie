import {Module} from "@nestjs/common";
import {TravelHistoryService} from "./travel-history.service";
import {TravelHistoryController} from "./travel-history.controller";

@Module({
    controllers: [TravelHistoryController],
    exports: [TravelHistoryService],
    providers: [TravelHistoryService]
})

export class TravelHistoryModule {
    
}