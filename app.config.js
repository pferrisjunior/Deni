import "dotenv/config";

export default {
  expo: {
    name: "Deni",
    slug: "Deni",

    android: {
      package: "com.wjb21301.deni",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },

    ios: {
      bundleIdentifier: "com.wjb21301.deni",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
};
