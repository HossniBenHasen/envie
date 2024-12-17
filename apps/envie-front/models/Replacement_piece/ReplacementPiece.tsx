import { Brand } from '../Brand/Brand';
import { Family } from '../Family/Family';
import { StorageLocation } from '../StorageLocation/StorageLocation';
import { SubFamily } from '../SubFamily/SubFamily';

export interface ReplacementPiece {
  id: number;
  state: string;
  weight: number;
  subfamily: SubFamily;
  family: Family;
  excludingTaxesPrice: number;
  indicativePriceOfNewPiece: number;
  comments: string;
  manufacturerReferenceOfPiece: string;
  designationInterne: string;
  designationFournisseur: string;
  brand: Brand;
  model: string;
  technicalReferenceDevice: string;
  serialNumber: string;
  entryStockDate: Date;
  dismantlingDate: Date;
  releaseStockDate: Date;
  storageLocation: StorageLocation | null;
  supplier: string;
}
