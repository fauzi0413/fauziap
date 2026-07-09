import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function readDatabaseUrlFromFile(fileName: string) {
  try {
    const envFile = readFileSync(join(process.cwd(), fileName), "utf8");
    const databaseUrlLine = envFile
      .split(/\r?\n/)
      .find((line) => line.trim().startsWith("DATABASE_URL="));

    return databaseUrlLine?.replace(/^DATABASE_URL=/, "").trim().replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

function normalizeDatabaseUrl(databaseUrl?: string) {
  if (!databaseUrl) return databaseUrl;

  const url = new URL(databaseUrl);
  const sslMode = url.searchParams.get("sslmode");

  if (sslMode === "require" || sslMode === "prefer" || sslMode === "verify-ca") {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
}

function createPrismaClient() {
  const connectionString = normalizeDatabaseUrl(
    process.env.DATABASE_URL ?? readDatabaseUrlFromFile(".env") ?? readDatabaseUrlFromFile("env"),
  );
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
