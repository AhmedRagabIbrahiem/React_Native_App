import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { injectDesignBridges } from "@/design/bridgeScripts";
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
          setHtml(injectDesignBridges(contents, screenId));
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

  useEffect(() => {
    const onWindowMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      handleMessage(event.data);
    };

    window.addEventListener("message", onWindowMessage);
    return () => window.removeEventListener("message", onWindowMessage);
  }, [handleMessage]);

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
    <View style={styles.container}>
      <iframe
        srcDoc={html}
        title={`design-${screenId}`}
        style={styles.frame}
        sandbox="allow-scripts allow-same-origin"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
  },
  frame: {
    border: "none",
    width: "100%",
    height: "100%",
    flex: 1,
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
