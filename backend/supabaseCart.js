const postgres = require("postgres");

let sql;

/** Fixes common copy-paste mistakes from Supabase connection strings */
function normalizeDatabaseUrl(raw) {
  let url = raw.trim();

  if (url.startsWith("/postgres:")) {
    url = `postgresql://postgres:${url.slice("/postgres:".length)}`;
  } else if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    throw new Error(
      "DATABASE_URL must start with postgresql:// — copy the URI from Supabase → Database → Connection string"
    );
  }

  try {
    new URL(url.replace(/^postgres:\/\//, "postgresql://"));
  } catch {
    throw new Error(
      "DATABASE_URL is invalid. Expected: postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"
    );
  }

  return url;
}

function getSql() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }
    sql = postgres(normalizeDatabaseUrl(databaseUrl), { ssl: "require" });
  }
  return sql;
}

function getTableName() {
  return process.env.SUPABASE_TABLE ?? "orders";
}

/**
 * Inserts a row into Supabase Postgres.
 * Table columns: id (int8), created_at (timestamptz), Order_name (text)
 */
async function addToCartSupabase(product) {
  const table = getTableName();
  const orderName = String(product.name).trim();

  if (!orderName) {
    throw new Error("product name is required");
  }

  const db = getSql();

  const rows = await db`
    INSERT INTO ${db(table)} ("Order_name")
    VALUES (${orderName})
    RETURNING id, created_at, "Order_name"
  `;

  const row = rows[0];
  const countRows = await db`
    SELECT COUNT(*)::int AS count FROM ${db(table)}
  `;

  return {
    success: true,
    item: {
      id: String(row.id),
      name: row.Order_name,
      price: product.price ? String(product.price) : "",
      description: product.description,
      tag: product.tag,
      addedAt: new Date(row.created_at).toISOString(),
    },
    count: countRows[0].count,
  };
}

async function listCartSupabase() {
  const table = getTableName();
  const db = getSql();

  const rows = await db`
    SELECT id, created_at, "Order_name"
    FROM ${db(table)}
    ORDER BY created_at DESC
  `;

  return {
    items: rows.map((row) => ({
      id: String(row.id),
      name: row.Order_name,
      price: "",
      addedAt: new Date(row.created_at).toISOString(),
    })),
    count: rows.length,
  };
}

function isSupabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

module.exports = {
  addToCartSupabase,
  listCartSupabase,
  isSupabaseConfigured,
};
