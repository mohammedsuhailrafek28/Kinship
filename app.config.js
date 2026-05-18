// app.config.js
export default {
  expo: {
    name: "Kinship",
    slug: "kinship-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0D0D0F"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.kinship.app",
      infoPlist: {
        NSCameraUsageDescription: "Kinship uses your camera to upload portfolio content.",
        NSPhotoLibraryUsageDescription: "Kinship accesses your photos to upload portfolio content.",
        NSMicrophoneUsageDescription: "Kinship uses your microphone for video recording."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#7C5CFC"
      },
      package: "com.kinship.app",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECORD_AUDIO",
        "VIBRATE"
      ]
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-image-picker",
        {
          photosPermission: "Allow Kinship to access your photos.",
          cameraPermission: "Allow Kinship to use your camera."
        }
      ]
    ],
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000/api/v1",
      eas: { projectId: "YOUR_EAS_PROJECT_ID" }
    },
    scheme: "kinship"
  }
};
