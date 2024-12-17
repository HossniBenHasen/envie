import { SubFamily } from "../SubFamily/SubFamily";

export interface Family {
    id: string;
    familyName: string;
    subfamilies: SubFamily[];
}