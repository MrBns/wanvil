import { PrismaClient } from "@prisma/client";

try {
  const prisma = new PrismaClient({});
  console.log("Success with empty obj!");
} catch (e) {
  console.log("Failed empty obj:", e);
}
