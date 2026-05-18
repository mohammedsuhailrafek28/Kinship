// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../src/store/auth.store";
import { connectSocket, disconnectSocket } from "../src/lib/socket";
import { COLORS } from "../src/constants/theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 30_000 },
    mutations: { retry: 0 },
  },
});

function AppInit() {
  const { loadFromStorage, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadFromStorage().finally(() => SplashScreen.hideAsync());
  }, []);

  useEffect(() => {
    if (token && isAuthenticated) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  }, [token, isAuthenticated]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chat/[userId]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="post/[id]" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="notifications" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="booking/[talentId]" options={{ presentation: "modal" }} />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppInit />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
