import { Colors, Fonts } from "@/utils/constants";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { router } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useRegisterMutation } from "@/hooks/mutations/useAuthMutations";
import { registerSchema } from "@/schemas/auth.schemas";

export default function Register() {
  const { mutate: register, isPending } = useRegisterMutation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleRegister = () => {
    const parsed = registerSchema.safeParse({ firstName, lastName, email: email.trim(), password, confirmPassword });
    if (!parsed.success) {
      Alert.alert('Erreur de saisie', parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    const { confirmPassword: _confirm, ...data } = parsed.data;
    register(data, {
      onSuccess: () => router.push({ pathname: '/verify-otp', params: { email: data.email, purpose: 'register' } }),
      onError: (err) => Alert.alert('Inscription échouée', err.message || 'Une erreur est survenue'),
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
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create a new account to get started</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput style={styles.input} placeholder="Enter your first name" autoCapitalize="words" value={firstName} onChangeText={setFirstName} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} placeholder="Enter your last name" autoCapitalize="words" value={lastName} onChangeText={setLastName} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            <View style={[styles.inputContainer, { position: 'relative' }]}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={!passwordVisible} autoCapitalize="none" value={password} onChangeText={setPassword} />
              <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color={Colors.tintColor} onPress={() => setPasswordVisible(!passwordVisible)} style={{ position: 'absolute', right: 12, bottom: 12 }} />
            </View>

            <View style={[styles.inputContainer, { position: 'relative' }]}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput style={styles.input} placeholder="Confirm your password" secureTextEntry={!confirmPasswordVisible} autoCapitalize="none" value={confirmPassword} onChangeText={setConfirmPassword} />
              <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={24} color={Colors.tintColor} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={{ position: 'absolute', right: 12, bottom: 12 }} />
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={isPending}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.buttonInner}>
                {isPending && <ActivityIndicator color={Colors.white} size="small" style={{ marginRight: 8 }} />}
                <Text style={styles.buttonText}>Register</Text>
              </View>
            </Pressable>

            <Text style={styles.or}>OR</Text>

            <Pressable onPress={() => {}} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <View style={styles.buttonGoogle}>
                <Image source={require('../assets/image/google.png')} style={{ width: 24, height: 24 }} />
                <Text style={styles.textGoogle}> Google</Text>
              </View>
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text style={styles.signUp}>Have an account? <Text style={styles.signUpLink}>Login</Text></Text>
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
  inputWrapper: {
    flexDirection: "row",
    gap: 10,
  },
  inputContainer: {
    marginBottom: 16,
    flex: 1,
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
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: Colors.textColor,
    backgroundColor: Colors.white,
  },
  button: {
    marginTop: 8,
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
