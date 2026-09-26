/**
 * Injected on the menu screen only.
 * Reads product info from the HTML card and sends it to the React Native layer.
 */
export function buildMenuActionsBridgeScript(): string {
  return `
(function () {
  if (window.__cafeMenuActionsInstalled) return;
  window.__cafeMenuActionsInstalled = true;

  function postToApp(payload) {
    var msg = JSON.stringify(payload);
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(msg);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(msg, "*");
    }
  }

  function extractFromGridCard(card) {
    if (!card) return null;
    var name = (card.querySelector("h4") || {}).textContent || "";
    name = name.trim();
    var priceEl = card.querySelector(".h-48 .rounded-full span, .relative .rounded-full span");
    var price = priceEl ? priceEl.textContent.trim() : "";
    var descEl = card.querySelector("p.font-body-md, p.text-body-md");
    var description = descEl ? descEl.textContent.trim() : "";
    var tagEl = card.querySelector("span.rounded-full.border");
    var tag = tagEl ? tagEl.textContent.trim() : "";
    if (!name || !price) return null;
    return { name: name, price: price, description: description, tag: tag };
  }

  function extractFromListRow(row) {
    if (!row) return null;
    var spans = row.querySelectorAll("span");
    var name = "";
    var price = "";
    spans.forEach(function (span) {
      var text = (span.textContent || "").trim();
      if (!text) return;
      if (text.indexOf("$") === 0) price = text;
      else if (!name && span.className.indexOf("headline") !== -1) name = text;
    });
    if (!name || !price) return null;
    return { name: name, price: price };
  }

  function wireGridAddButtons() {
    document.querySelectorAll("button").forEach(function (btn) {
      var addIcon = btn.querySelector('[data-icon="add"]');
      if (!addIcon) return;
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          var card = btn.closest(".group") || btn.closest(".bg-surface-container-low");
          var product = extractFromGridCard(card);
          if (product) {
            postToApp({ type: "addToCart", product: product });
          }
        },
        true
      );
    });
  }

  function wireListAddButtons() {
    document.querySelectorAll('[data-icon="add_circle"]').forEach(function (icon) {
      var btn = icon.closest("button") || icon.parentElement;
      if (!btn) return;
      btn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          var row = btn.closest(".flex.items-end");
          var product = extractFromListRow(row);
          if (product) {
            postToApp({ type: "addToCart", product: product });
          }
        },
        true
      );
    });
  }

  wireGridAddButtons();
  wireListAddButtons();
})();
true;
`;
}
