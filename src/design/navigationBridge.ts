import manifest from "../../Design_html/manifest.json";

import type { DesignScreenId } from "@/types/design";
import { routes } from "@/constants/routes";

/** Injected into each WebView to wire HTML taps to Expo Router */
export function buildNavigationBridgeScript(): string {
  const bottomNav = manifest.navigation.bottomNav as DesignScreenId[];
  const navRoutes = bottomNav.map((id) => routes[id]);
  const actions = manifest.navigation.actions as Record<string, DesignScreenId>;
  const actionEntries = Object.entries(actions).map(([label, screen]) => ({
    label,
    route: routes[screen],
  }));

  return `
(function () {
  if (window.__cafeNavBridgeInstalled) return;
  window.__cafeNavBridgeInstalled = true;

  function postRoute(route) {
    var msg = JSON.stringify({ type: "navigate", route: route });
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(msg);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(msg, "*");
    }
  }

  var navRoutes = ${JSON.stringify(navRoutes)};
  var actionRoutes = ${JSON.stringify(
    Object.fromEntries(actionEntries.map((e) => [e.label, e.route]))
  )};

  function wireBottomNav() {
    var nav = document.querySelector("nav");
    if (!nav) return;
    var items = nav.querySelectorAll("a, :scope > div");
    if (items.length === 0) {
      items = nav.children;
    }
    items.forEach(function (el, index) {
      if (index >= navRoutes.length) return;
      el.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          postRoute(navRoutes[index]);
        },
        true
      );
    });
  }

  function wireActionButtons() {
    document.querySelectorAll("button, a").forEach(function (el) {
      var text = (el.textContent || "").trim();
      if (actionRoutes[text]) {
        el.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
            postRoute(actionRoutes[text]);
          },
          true
        );
      }
    });
  }

  wireBottomNav();
  wireActionButtons();
})();
true;
`;
}
