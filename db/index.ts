import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  // DB remains optional until an actual D1 binding is configured.
  const bindings: typeof env & { DB?: D1Database } = env;
  if (!bindings.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Add a `d1_databases` binding named `DB` to wrangler.jsonc before using the database."
    );
  }

  return drizzle(bindings.DB, { schema });
}
