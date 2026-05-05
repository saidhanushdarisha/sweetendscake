import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Only use webSocketConstructor if we are in a serverless environment or using Neon
if (process.env.DATABASE_URL?.includes('neon.tech')) {
  neonConfig.webSocketConstructor = ws;
}

export let db: any;

if (process.env.DATABASE_URL) {
  const poolConnection = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: poolConnection, schema });
}
