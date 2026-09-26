import { apiPost } from "@/services/api/client";
import type { AddToCartResponse, CartProduct } from "@/types/cart";

/**
 * Sends the product to the API; the backend writes to Supabase when DATABASE_URL is set.
 */
export async function addToCart(product: CartProduct): Promise<AddToCartResponse> {
  return apiPost<AddToCartResponse>("/api/cart/items", product);
}
