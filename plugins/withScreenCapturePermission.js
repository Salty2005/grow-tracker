const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withScreenCapturePermission(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    if (!manifest["uses-permission"]) {
      manifest["uses-permission"] = [];
    }
    const perms = manifest["uses-permission"];
    const needed = [
      "android.permission.DETECT_SCREEN_CAPTURE",
      "android.permission.FOREGROUND_SERVICE",
    ];
    for (const p of needed) {
      if (!perms.find((e) => e.$?.["android:name"] === p)) {
        perms.push({ $: { "android:name": p } });
      }
    }
    return config;
  });
};
