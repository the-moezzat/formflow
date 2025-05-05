// import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { keys } from "./keys";
import { drizzle as drizzleEdge } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { form } from "./schema";
import { eq } from "drizzle-orm";

const connectionString = keys().DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

export const databaseEdge = drizzleEdge({ client: sql });
export const database = drizzle(client);
export * from "drizzle-orm";

databaseEdge.select().from(form).where(eq(form.id, "1234"));
