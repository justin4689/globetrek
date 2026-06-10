import { Colors, Fonts } from "@/utils/constants";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useChangePasswordMutation } from "@/hooks/mutations/useAuthMutations";
import { changePasswordSchema } from "@/schemas/auth.schemas";

export default function ChangePassword() {
  const { mutate: changePassword, isPending } = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      Alert.alert('Erreur de saisie', parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    changePassword({ currentPassword, newPassword }, {
      onSuccess: () => { setSuccess(true); setTimeout(() => router.back(), 1500); },
      onError: (err) => Alert.alert('Erreur', err?.message || 'Failed to update password.'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.tintColor} />
          </Pressable>

          <View>
            <Image
              source={require("../assets/image/logo-full.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Use a combination of numbers, lowercase and uppercase letters, and special
              characters to create a strong password.{"\n"}
              Avoid personal or common words to keep your account secure.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="••••••••••"
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <Pressable style={styles.eyeIcon} onPress={() => setShowNew((v) => !v)}>
                  <Ionicons name={showNew ? "eye-outline" : "eye-off-outline"} size={22} color={Colors.textColor} />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="••••••••••"
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <Pressable style={styles.eyeIcon} onPress={() => setShowConfirm((v) => !v)}>
                  <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={22} color={Colors.textColor} />
                </Pressable>
              </View>
            </View>

            {success && <Text style={styles.success}>Password updated successfully!</Text>}

            <Pressable
              onPress={handleSubmit}
              disabled={isPending}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.buttonInner}>
                {isPending && <ActivityIndicator color={Colors.white} size="small" style={{ marginRight: 8 }} />}
                <Text style={styles.buttonText}>Update password</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 4,
    padding: 4,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 8,
    width: "100%",
  },
  description: {
    fontSize: 13,
    color: Colors.textColor,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  formContainer: {
    width: "100%",
    marginTop: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: Colors.tintColor,
    fontFamily: Fonts.medium,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: 52,
    borderColor: Colors.disabledColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: Colors.textColor,
    backgroundColor: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
  },
  button: {
    marginTop: 12,
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  success: { color: "#22c55e", fontSize: 13, fontFamily: Fonts.medium, textAlign: "center" },
});
