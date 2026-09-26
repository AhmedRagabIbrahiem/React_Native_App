require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  addToCartSupabase,
  listCartSupabase,
  isSupabaseConfigured,
} = require("./supabaseCart");

const app = express();
const PORT = process.env.PORT || 3000;

/** Fallback when DATABASE_URL is not set */
const cartItems = [];

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  if (isSupabaseConfigured()) {
    return res.json({ ok: true, storage: "supabase" });
  }
  res.json({ ok: true, storage: "memory" });
});

app.get("/api/cart/items", async (_req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      return res.json(await listCartSupabase());
    }
    res.json({ items: cartItems, count: cartItems.length });
  } catch (error) {
    next(error);
  }
});

app.post("/api/cart/items", async (req, res, next) => {
  try {
    const { name, price, description, tag } = req.body ?? {};

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const product = {
      name: String(name),
      price: price ? String(price) : "",
      description: description ? String(description) : undefined,
      tag: tag ? String(tag) : undefined,
    };

    if (isSupabaseConfigured()) {
      const result = await addToCartSupabase(product);
      console.log("[supabase] added:", result.item);
      return res.status(201).json(result);
    }
    else{
      console.log("Not Supabase Configured");
    }

    const item = {
      id: String(Date.now()),
      ...product,
      addedAt: new Date().toISOString(),
    };
    cartItems.push(item);
    console.log("[memory] added:", item);

    res.status(201).json({
      success: true,
      item,
      count: cartItems.length,
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error("[api]", error);
  res.status(500).json({
    error: error instanceof Error ? error.message : "Server error",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Cafe API listening on http://0.0.0.0:${PORT}`);
  console.log(
    isSupabaseConfigured()
      ? "Cart storage: Supabase (Postgres)"
      : "Cart storage: in-memory (set DATABASE_URL for Supabase)"
  );
});
