import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";

for (const envFile of [".env.local", ".env"]) {
  if (!existsSync(envFile)) continue;
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    const rawValue = match[2].trim();
    process.env[match[1]] = rawValue.replace(/^("|')(.*)\1$/, "$2");
  }
}

const required = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE", "ADMIN_EMAIL", "ADMIN_NAME", "ADMIN_ORGANIZATION", "ADMIN_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const password = process.env.ADMIN_PASSWORD;
if (password.length < 14) {
  console.error("ADMIN_PASSWORD in .env.local must be at least 14 characters. Choose a stronger development password.");
  process.exit(1);
}

const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD ?? "",
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 1,
});
const prisma = new PrismaClient({ adapter });

try {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  await prisma.user.create({
    data: {
      id: randomBytes(16).toString("hex"),
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      organization: process.env.ADMIN_ORGANIZATION,
      role: "admin",
      passwordHash: `scrypt:${salt}:${key}`,
    },
  });
  console.log(`Admin account created for ${process.env.ADMIN_EMAIL.toLowerCase()}.`);
} catch (error) {
  if (error?.code === "P2002") {
    console.error("That email already exists. Use another email or update the account through an approved admin workflow.");
  } else {
    console.error("Could not create the admin account.", error);
  }
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
