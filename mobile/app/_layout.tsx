import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "@/context/AuthContext";

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

  if ((!fontsLoaded && !fontError) || isLoading) return null;

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
      </Stack.Protected>

    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
