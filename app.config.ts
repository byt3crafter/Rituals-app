import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Ritual',
  slug: 'ritual-fasting-app',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  scheme: 'ritual',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#121212',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ritual.fastingapp',
    userInterfaceStyle: 'dark'
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#121212',
    },
    package: 'com.ritual.fastingapp',
    userInterfaceStyle: 'dark'
  },
  plugins: [
    'expo-router',
    [
      "expo-build-properties",
      {
        "android": {
          "minSdkVersion": 23
        }
      }
    ]
  ],
  extra: {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    router: {
      origin: false,
    },
    eas: {
      projectId: 'YOUR_PROJECT_ID', // Replace with your EAS Project ID
    },
  },
});