"use strict";

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

function normalizeSupabasePoolUrl(rawUrl) {
  const url = new URL(rawUrl);

  if (url.hostname.includes(".pooler.supabase.com")) {
    url.port = "6543";
    if (!url.searchParams.has("pgbouncer")) {
      url.searchParams.set("pgbouncer", "true");
    }
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "1");
    }
  }

  if (url.searchParams.has("sslmode")) {
    url.searchParams.delete("sslmode");
  }

  return url.toString();
}

function getRuntimeDatabaseUrl() {
  return normalizeSupabasePoolUrl(ensureEnv("DATABASE_URL"));
}

function getDirectDatabaseUrl() {
  return process.env.DIRECT_URL || ensureEnv("DATABASE_URL");
}

function maskDatabaseUrl(rawUrl) {
  const url = new URL(rawUrl);
  if (url.password) {
    url.password = "********";
  }
  return url.toString();
}

module.exports = {
  getRuntimeDatabaseUrl,
  getDirectDatabaseUrl,
  maskDatabaseUrl,
  normalizeSupabasePoolUrl
};
