import type { DesignScreenId } from "@/types/design";

/**
 * Maps manifest screen ids to bundled HTML assets.
 * When Design_html folder structure changes, update paths here
 * (keep in sync with Design_html/manifest.json).
 */
export const designHtmlModules: Record<DesignScreenId, number> = {
  home: require("../../Design_html/home_dashboard/code.html"),
  menu: require("../../Design_html/menu_browser/code.html"),
  reservation: require("../../Design_html/table_reservation/code.html"),
  checkout: require("../../Design_html/order_checkout/code.html"),
};
