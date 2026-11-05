import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

loadEnvConfig(process.cwd());

function databaseUrl() {
  const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    throw new Error("Set MYSQL_HOST, MYSQL_USER and MYSQL_DATABASE before running Prisma commands.");
  }
  const user = encodeURIComponent(MYSQL_USER);
  const password = encodeURIComponent(MYSQL_PASSWORD ?? "");
  const host = MYSQL_HOST.includes(":") && !MYSQL_HOST.startsWith("[") ? `[${MYSQL_HOST}]` : MYSQL_HOST;
  const port = process.env["MYSQL_PORT"] ?? "3306";
  return `mysql://${user}:${password}@${host}:${port}/${encodeURIComponent(MYSQL_DATABASE)}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: databaseUrl() },
});
