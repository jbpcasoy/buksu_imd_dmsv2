import { User } from "@prisma/client";
import type { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: User;
  }
}