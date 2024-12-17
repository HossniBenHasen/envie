import { UserRole } from "../../enums/UserRole";
import { Company } from "../Company/Company";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  company?: Company;
}
