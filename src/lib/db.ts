import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  // Reuse the application pool across Next.js development reloads.
  var leadMultiChoicePrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error(
      "MySQL is not configured. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD and MYSQL_DATABASE.",
    );
  }

  const adapter = new PrismaMariaDb({
    host: MYSQL_HOST,
    port: Number(process.env["MYSQL_PORT"] ?? 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD ?? "",
    database: MYSQL_DATABASE,
    connectionLimit: Number(process.env["MYSQL_CONNECTION_LIMIT"] ?? 5),
    connectTimeout: Number(process.env["MYSQL_CONNECT_TIMEOUT"] ?? 10000),
    acquireTimeout: Number(process.env["MYSQL_ACQUIRE_TIMEOUT"] ?? 10000),
  });
  return new PrismaClient({ adapter });
}

export function getDb() {
  const cached = globalThis.leadMultiChoicePrisma;
  if (cached && typeof cached.requestMessage !== "undefined") return cached;

  // Next.js can retain this global Prisma instance through HMR after `prisma generate`.
  // Recreate it when the generated schema adds a model that the cached client lacks.
  if (cached) {
    console.warn("Discarding stale Prisma client after schema generation.");
    globalThis.leadMultiChoicePrisma = undefined;
    void cached.$disconnect().catch((error) => {
      console.error("Could not close stale Prisma client", error);
    });
  }

  const prisma = createPrismaClient();
  if (typeof prisma.requestMessage === "undefined") {
    throw new Error(
      "The generated Prisma client is missing the requestMessage model. Run prisma generate and restart Next.js.",
    );
  }
  globalThis.leadMultiChoicePrisma = prisma;
  return prisma;
}
