export interface CartProduct {
  name: string;
  price: string;
  description?: string;
  tag?: string;
}

export interface CartItem extends CartProduct {
  id: string;
  addedAt: string;
}

export interface AddToCartResponse {
  success: boolean;
  item: CartItem;
  count: number;
}
