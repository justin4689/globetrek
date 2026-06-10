import { Colors, Fonts } from "@/utils/constants";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Link, router } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations";
import { loginSchema } from "@/schemas/auth.schemas";

export default function Login() {
  const { mutate: login, isPending } = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    const parsed = loginSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      Alert.alert('Erreur de saisie', parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    login(parsed.data, {
      onError: (err) => {
        if ((err as any)?.data?.code === 'EMAIL_NOT_VERIFIED') {
          Alert.alert(
            'Email non vérifié',
            'Un code de vérification a été envoyé à votre adresse email. Veuillez le confirmer pour continuer.',
            [{ text: 'OK', onPress: () => router.push({ pathname: '/verify-otp', params: { email: parsed.data.email, purpose: 'register' } }) }]
          );
        } else {
          Alert.alert('Connexion échouée', err.message || 'Une erreur est survenue');
        }
      },
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
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Welcome back! Enter your email and password to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[styles.inputContainer, { position: 'relative' }]}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color={Colors.tintColor}
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ position: 'absolute', right: 12, bottom: 12 }}
              />
            </View>

            <Link href="/forgot-password">
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Link>

            <Pressable
              onPress={handleLogin}
              disabled={isPending}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.buttonInner}>
                {isPending && <ActivityIndicator color={Colors.white} size="small" style={{ marginRight: 8 }} />}
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </Pressable>

            <Text style={styles.or}>OR</Text>

            <Pressable onPress={() => {}} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <View style={styles.buttonGoogle}>
                <Image source={require('../assets/image/google.png')} style={{ width: 24, height: 24 }} />
                <Text style={styles.textGoogle}> Google</Text>
              </View>
            </Pressable>

            <Text style={styles.signUp}>
              Don't have an account?{' '}
              <Link href="/register"><Text style={styles.signUpLink}>Sign Up</Text></Link>
            </Text>
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
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.textColor,
    fontFamily: Fonts.medium,
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
    marginTop: 24,
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
  forgotPassword: {
    color: Colors.primaryColor,
    textAlign: "right",
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  buttonGoogle: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.tintColor,
    marginTop: 24,
  },
  or: {
    marginTop: 24,
    textAlign: "center",
    color: Colors.textColor,
    fontFamily: Fonts.medium,
  },
  textGoogle: {
    color: Colors.tintColor,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  signUp: {
    marginTop: 24,
    textAlign: "center",
    color: Colors.textColor,
    fontFamily: Fonts.medium,
  },
  signUpLink: {
    color: Colors.primaryColor,
    fontFamily: Fonts.medium,
  },
});
