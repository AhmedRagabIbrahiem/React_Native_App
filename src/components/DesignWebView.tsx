import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { buildDesignBridgeScripts } from "@/design/bridgeScripts";
import { loadDesignHtml } from "@/design/loadDesignHtml";
import { useDesignMessageHandler } from "@/hooks/useDesignMessageHandler";
import { colors } from "@/constants/theme";
import type { DesignScreenId } from "@/types/design";

interface DesignWebViewProps {
  screenId: DesignScreenId;
}

export function DesignWebView({ screenId }: DesignWebViewProps) {
  const handleMessage = useDesignMessageHandler();
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadDesignHtml(screenId)
      .then((contents) => {
        if (!cancelled) {
          setHtml(contents);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load design");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [screenId]);

  const onMessage = (event: WebViewMessageEvent) => {
    handleMessage(event.nativeEvent.data);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Could not load design</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!html) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <WebView
      style={styles.webview}
      source={{ html, baseUrl: "https://localhost/" }}
      originWhitelist={["*"]}
      onMessage={onMessage}
      injectedJavaScript={buildDesignBridgeScripts(screenId)}
      javaScriptEnabled
      domStorageEnabled
      allowsInlineMediaPlayback
      mixedContentMode="always"
      setSupportMultipleWindows={false}
      onError={() => setError("WebView failed to render the design")}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
