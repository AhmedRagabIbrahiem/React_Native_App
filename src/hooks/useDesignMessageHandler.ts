import { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

import { routeToScreen, routes } from "@/constants/routes";
import { addToCart } from "@/services/cart/cartService";
import type { CartProduct } from "@/types/cart";

interface DesignMessage {
  type?: string;
  route?: string;
  product?: CartProduct;
}

export function useDesignMessageHandler() {
  const router = useRouter();

  return useCallback(
    async (raw: string) => {
      let data: DesignMessage;
      try {
        data = JSON.parse(raw) as DesignMessage;
      } catch {
        return;
      }

      if (data.type === "navigate" && data.route) {
        const target = routeToScreen[data.route];
        if (target) {
          router.push(routes[target]);
        }
        return;
      }

      if (data.type === "addToCart" && data.product) {
        try {
          const result = await addToCart(data.product);
          Alert.alert(
            "Added to cart",
            `${result.item.name} (${result.item.price})`
          );
        } catch (e) {
          const message =
            e instanceof Error ? e.message : "Could not save item to cart";
          Alert.alert("Could not add item", message);
        }
      }
    },
    [router]
  );
}
