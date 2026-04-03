"use strict";

const { Pool } = require("pg");
const { getRuntimeDatabaseUrl } = require("./database-url");

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: getRuntimeDatabaseUrl(),
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

async function withTransaction(run) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await run(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function closePool() {
  if (pool) {
    const current = pool;
    pool = null;
    await current.end();
  }
}

module.exports = {
  getPool,
  query,
  withTransaction,
  closePool
};
