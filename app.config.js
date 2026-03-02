export default ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    bundleIdentifier: config.ios?.bundleIdentifier ?? "com.deni.mobile",
  },
  android: {
    ...config.android,
    package: config.android?.package ?? "com.deni.mobile",
  },
  plugins: [
    ...(config.plugins ?? []),
    [
      "react-native-maps",
      {
        iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY,
        androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY,
      },
    ],
  ],
});
