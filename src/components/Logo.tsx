import { Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/theme";

/** Swap `usePlaceholder` to false after adding assets/images/logo.png */
const usePlaceholder = true;

export function Logo() {
  if (usePlaceholder) {
    return (
      <View style={styles.placeholder} accessibilityLabel="Cafe logo">
        <Ionicons name="cafe" size={100} color={colors.accent} />
      </View>
    );
  }

  return (
    <Image
      source={require("../../assets/images/logo.png")}
      style={styles.logo}
      resizeMode="contain"
      accessibilityLabel="Cafe logo"
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
  },
});
