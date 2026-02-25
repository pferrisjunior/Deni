import "dotenv/config";

export default {
  expo: {
    name: "Deni",
    slug: "rn-app",
    scheme: "deni-auth",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,

    ios: {
      bundleIdentifier: "com.wjb21301.deni",
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },

    android: {
      package: "com.wjb21301.deni",
      userInterfaceStyle: "light",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },

    plugins: [
      "expo-router",
      "expo-system-ui",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.202780657934-u7fuk7v8ckjhqfi6h1tbi4nrk25fvmdj",
        },
      ],
    ],
  },
};
