import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding } = useAuth();
  if (isAuthenticated) return <Redirect href="/(tabs)/home" />;
  if (!hasSeenOnboarding) return <Redirect href="/onboarding" />;
  return <Redirect href="/login" />;
}
