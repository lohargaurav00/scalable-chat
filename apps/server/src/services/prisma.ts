import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["warn"],
});

export default prisma;
