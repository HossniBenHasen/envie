import { Brand } from "../Brand/Brand";
import { SubFamily } from "../SubFamily/SubFamily";

export interface ReplacementBike {
    id: number;
    state: string;
    weight : number;
    subfamily: SubFamily;
    excludingTaxesPrice: number;
    indicativePriceOfNewPiece: number;
    comments: string;
    designation: string;
    brand: Brand;
    model: string;
}
