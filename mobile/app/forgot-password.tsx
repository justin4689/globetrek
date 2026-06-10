import { Colors, Fonts } from "@/utils/constants";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useState } from 'react';
import { router } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useForgotPasswordMutation } from "@/hooks/mutations/useAuthMutations";
import { forgotPasswordSchema } from "@/schemas/auth.schemas";

export default function ForgotPassword() {
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    const parsed = forgotPasswordSchema.safeParse({ email: email.trim() });
    if (!parsed.success) {
      Alert.alert('Erreur de saisie', parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    forgotPassword(parsed.data.email, {
      onSuccess: () => router.push({ pathname: '/verify-otp', params: { email: parsed.data.email } }),
      onError: (err) => Alert.alert('Erreur', err.message || 'Une erreur est survenue'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }} showsVerticalScrollIndicator={false}>

          <View>
            <Image source={require("../assets/image/logo-full.png")} style={{ width: 200, height: 200 }} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your email and we'll send you a link to reset your password</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={isPending}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.buttonInner}>
                {isPending && <ActivityIndicator color={Colors.white} size="small" style={{ marginRight: 8 }} />}
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text style={styles.signIn}>Back to <Text style={styles.signInLink}>Login</Text></Text>
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
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: Colors.tintColor,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
    color: Colors.textColor,
  },
  formContainer: {
    width: "100%",
    marginTop: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: Colors.textColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: Colors.textColor,
    backgroundColor: Colors.white,
  },
  button: {
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    paddingVertical: 14,
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
  signIn: {
    marginTop: 24,
    textAlign: "center",
    color: Colors.textColor,
    fontFamily: Fonts.medium,
  },
  signInLink: {
    color: Colors.primaryColor,
    fontFamily: Fonts.medium,
  },
});
