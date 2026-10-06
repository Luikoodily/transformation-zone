import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "@/generated/prisma/client";

// Neon's pooled TCP endpoint silently drops idle connections; a plain
// pg.Pool then hands out a dead socket on the next query and the request
// hangs until it times out (seen as "Server has closed the connection").
// The Neon serverless driver manages the connection lifecycle itself and
// doesn't have that failure mode, so it's the adapter Prisma recommends
// for Neon specifically.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// PrismaNeon wants a pool CONFIG object here, not a pre-built Pool instance
// (passing a Pool silently loses connectionString and falls back to localhost).
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
