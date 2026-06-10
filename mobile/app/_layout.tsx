import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Colors } from "@/utils/constants";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  if ((!fontsLoaded && !fontError) || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.backgroundColor }}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>

      {/* ── Routes protégées (authentifié) ───────────────────────────── */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="destination/[id]" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="notification-detail" />
        <Stack.Screen name="reservation-detail" />
        <Stack.Screen name="edit-profil" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="help-support" />
        <Stack.Screen
          name="filter-sheet"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.705],
            sheetCornerRadius: 24,
          }}
        />
      </Stack.Protected>

      {/* ── Routes publiques (non authentifié) ───────────────────────── */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="reset-password" />
      </Stack.Protected>

    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </SafeAreaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
