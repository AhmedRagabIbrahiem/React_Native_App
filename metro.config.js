const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("html");

config.resolver.extraNodeModules = {
  "@": path.resolve(__dirname, "src"),
};

module.exports = config;
