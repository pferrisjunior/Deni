import "dotenv/config";
// We will have to change some firebase values here as well.
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
      bundleIdentifier: "com.Foodtruck.deni",  //changed
      supportsTablet: true,
      googleServicesFile: "./GoogleService-Info.plist",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },

    android: {
      package: "com.Foodtruck.deni", //changed
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
            "com.googleusercontent.apps.638018823842-q7432j2ierr9h0g4umb1sit02ns6r7en", //Replace with Jon's iOS URL scheme
        },
      ],
    ],
  },
};
