import type { DesignScreenId } from "@/types/design";

/** Expo Router paths — keep aligned with Design_html/manifest.json */
export const routes = {
  home: "/",
  menu: "/menu",
  reservation: "/reservation",
  checkout: "/checkout",
} as const satisfies Record<DesignScreenId, string>;

export const routeToScreen: Record<string, DesignScreenId> = {
  [routes.home]: "home",
  [routes.menu]: "menu",
  [routes.reservation]: "reservation",
  [routes.checkout]: "checkout",
};
