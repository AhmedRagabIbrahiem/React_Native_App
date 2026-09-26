import { Platform } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

import { designHtmlModules } from "@/design/registry";
import type { DesignScreenId } from "@/types/design";

/** Loads bundled HTML from Design_html for native and web */
export async function loadDesignHtml(screenId: DesignScreenId): Promise<string> {
  const moduleId = designHtmlModules[screenId];
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();

  const uri = asset.localUri ?? asset.uri;
  if (!uri) {
    throw new Error("Could not resolve design HTML asset");
  }

  if (Platform.OS === "web" || uri.startsWith("http")) {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to load design (${response.status})`);
    }
    return response.text();
  }

  return FileSystem.readAsStringAsync(uri);
}
