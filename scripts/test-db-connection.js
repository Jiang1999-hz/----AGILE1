"use strict";

require("dotenv").config();

const { query, closePool } = require("../lib/pg");
const { getRuntimeDatabaseUrl, maskDatabaseUrl } = require("../lib/database-url");

async function main() {
  const runtimeUrl = getRuntimeDatabaseUrl();
  console.log(`Testing database connection with ${maskDatabaseUrl(runtimeUrl)}`);

  const result = await query(
    "select current_database() as database_name, current_user as user_name, now() as connected_at"
  );

  console.log(JSON.stringify(result.rows[0], null, 2));
}

main()
  .catch((error) => {
    console.error(error.stack || error.message || String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool().catch(() => {});
  });
