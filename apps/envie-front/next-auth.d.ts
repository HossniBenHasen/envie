import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";
import { UserRole } from "./enums/UserRole";
import { Company } from "./models/Company/Company";

declare module "next-auth" {
  interface Session {
    user: {},
    token: JWT,
    expires: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    exp: number;
    iat: number;
    sub: string;
    jti: string;
    role: UserRole;
    username: string;
    access_token: string;
    company: Company;
    id: string;
  }
}