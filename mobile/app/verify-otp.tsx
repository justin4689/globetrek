import { Colors, Fonts } from "@/utils/constants";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "@/hooks/mutations/useAuthMutations";
import { useAuth } from "@/context/AuthContext";

export default function VerifyOtp() {
  const { email, purpose } = useLocalSearchParams<{ email: string; purpose?: string }>();
  const { mutate: verifyOtp, isPending } = useVerifyOtpMutation();
  const { mutate: resend, isPending: isResending } = useForgotPasswordMutation();
  const { loginWithTokens } = useAuth();

  const [digits, setDigits] = useState(['', '', '', '', '']);
  const [seconds, setSeconds] = useState(180);
  const refs = useRef<(TextInput | null)[]>([null, null, null, null, null]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (text: string, index: number) => {
    const d = [...digits];
    d[index] = text;
    setDigits(d);
    if (text && index < 4) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handleVerify = () => {
    const otp = digits.join('');
    if (otp.length < 5) {
      Alert.alert('Code incomplet', 'Please enter the 5-digit code');
      return;
    }
    verifyOtp({ email, otp, purpose }, {
      onSuccess: async (data: any) => {
        if (purpose === 'register') {
          await loginWithTokens(data.accessToken, data.refreshToken, data.user);
          // Stack.Protected redirige automatiquement vers /(tabs)/home
        } else {
          router.push({ pathname: '/reset-password', params: { token: data.resetToken } });
        }
      },
      onError: (err) => Alert.alert('Code invalide', err?.message || 'Invalid code. Please try again.'),
    });
  };

  const handleResend = () => {
    setSeconds(180);
    setDigits(['', '', '', '', '']);
    resend(email, {
      onError: (err) => Alert.alert('Erreur', err.message || 'Could not resend code'),
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
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>We sent a 5-digit code to {email}. Please enter it below.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              {digits.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={el => { refs.current[i] = el; }}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleChange(text, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                />
              ))}
            </View>

            <Pressable
              onPress={handleVerify}
              disabled={isPending}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View style={styles.buttonInner}>
                {isPending && <ActivityIndicator color={Colors.white} size="small" style={{ marginRight: 8 }} />}
                <Text style={styles.buttonText}>Verify</Text>
              </View>
            </Pressable>

            <Text style={styles.timer}>{formatTime(seconds)}</Text>

            <Pressable onPress={handleResend} disabled={seconds > 0 || isResending}>
              <Text style={[styles.signIn, seconds > 0 && { opacity: 0.4 }]}>
                Haven't got the email yet? <Text style={styles.signInLink}>Resend Link</Text>
              </Text>
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  input: {
    height: 50,
    width: 50,
    borderColor: Colors.textColor,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: Colors.textColor,
    backgroundColor: Colors.white,
    textAlign: "center",
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
  timer: {
    marginTop: 24,
    textAlign: "center",
    color: Colors.textColor,
    fontFamily: Fonts.medium,
  },
});
