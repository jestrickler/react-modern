import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
	var __db__: PrismaClient | undefined;
}

// This prevents the creation of a new connection on every file save during development.
if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!global.__db__) {
		global.__db__ = new PrismaClient();
	}
	prisma = global.__db__;
	// Explicitly connect to catch issues early in dev
	prisma.$connect();
}

export { prisma };
