import { Colors, Fonts } from "@/utils/constants";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useResetPasswordMutation } from "@/hooks/mutations/useAuthMutations";
import { resetPasswordSchema } from "@/schemas/auth.schemas";

export default function ResetPassword() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      Alert.alert('Erreur de saisie', parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    resetPassword({ token, password: parsed.data.password }, {
      onSuccess: () => router.replace('/login'),
      onError: (err) => Alert.alert('Erreur', err?.message || 'Failed to reset password.'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: "100%" }}>
        <ScrollView contentContainerStyle={{ alignItems: "center", flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          <View>
            <Image source={require("../assets/image/logo-full.png")} style={styles.logo} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.subtitle}>Choose a strong password to secure your account.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={[styles.input, styles.inputWithIcon]} placeholder="••••••••••" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoCapitalize="none" />
                <Pressable style={styles.eyeIcon} onPress={() => setShowPassword(v => !v)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color={Colors.textColor} />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={[styles.input, styles.inputWithIcon]} placeholder="••••••••••" secureTextEntry={!showConfirm} value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" />
                <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm(v => !v)}>
                  <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={22} color={Colors.textColor} />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={isPending}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.buttonInner}>
                {isPending && <ActivityIndicator color={Colors.white} size="small" style={{ marginRight: 8 }} />}
                <Text style={styles.buttonText}>Reset Password</Text>
              </View>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundColor, paddingHorizontal: 16 },
  logo: { width: 160, height: 160, resizeMode: "contain" },
  textContainer: { alignItems: "center", marginBottom: 8 },
  title: { fontSize: 32, color: Colors.tintColor, fontFamily: Fonts.bold },
  subtitle: { fontSize: 14, marginTop: 8, textAlign: "center", color: Colors.textColor, fontFamily: Fonts.regular },
  formContainer: { width: "100%", marginTop: 16, gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, color: Colors.tintColor, fontFamily: Fonts.medium },
  inputWrapper: { position: "relative", justifyContent: "center" },
  input: { height: 52, borderColor: Colors.disabledColor, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, color: Colors.textColor, backgroundColor: Colors.white, fontFamily: Fonts.regular, fontSize: 16 },
  inputWithIcon: { paddingRight: 48 },
  eyeIcon: { position: "absolute", right: 14 },
  button: { marginTop: 12, backgroundColor: Colors.primaryColor, borderRadius: 10, paddingVertical: 16, alignItems: "center" },
  buttonInner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  buttonText: { color: Colors.white, fontSize: 16, fontFamily: Fonts.medium },
});
