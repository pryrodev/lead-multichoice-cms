import "server-only";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // Reuse the application pool across Next.js development reloads.
  var leadMultiChoicePrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error("MySQL is not configured. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD and MYSQL_DATABASE.");
  }

  const pool = mariadb.createPool({
    host: MYSQL_HOST,
    port: Number(process.env["MYSQL_PORT"] ?? 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD ?? "",
    database: MYSQL_DATABASE,
    connectionLimit: Number(process.env["MYSQL_CONNECTION_LIMIT"] ?? 5),
    connectTimeout: Number(process.env["MYSQL_CONNECT_TIMEOUT"] ?? 10000),
    acquireTimeout: Number(process.env["MYSQL_ACQUIRE_TIMEOUT"] ?? 10000),
  });
  const adapter = new PrismaMariaDb(pool, { database: MYSQL_DATABASE, disposeExternalPool: true });
  return new PrismaClient({ adapter });
}

export function getDb() {
  if (globalThis.leadMultiChoicePrisma) return globalThis.leadMultiChoicePrisma;
  const prisma = createPrismaClient();
  globalThis.leadMultiChoicePrisma = prisma;
  return prisma;
}
