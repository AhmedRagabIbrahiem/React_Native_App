import type { DesignScreenId } from "@/types/design";

import { buildMenuActionsBridgeScript } from "./menuActionsBridge";
import { buildNavigationBridgeScript } from "./navigationBridge";

function stripTrailingTrue(script: string): string {
  return script.replace(/\n?true;\s*$/, "");
}

/** Combined scripts injected into design HTML */
export function buildDesignBridgeScripts(screenId: DesignScreenId): string {
  let combined = stripTrailingTrue(buildNavigationBridgeScript());

  if (screenId === "menu") {
    combined += "\n" + stripTrailingTrue(buildMenuActionsBridgeScript());
  }

  return combined + "\ntrue;";
}

/** For web iframe: wrap in script tag */
export function injectDesignBridges(html: string, screenId: DesignScreenId): string {
  const script = `<script>${stripTrailingTrue(buildDesignBridgeScripts(screenId).replace(/\n?true;\s*$/, ""))}</script>`;
  if (html.includes("</body>")) {
    return html.replace("</body>", `${script}</body>`);
  }
  return html + script;
}
