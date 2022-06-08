import { PrismaClient } from "@prisma/client/edge";
export const client = () => new PrismaClient();
