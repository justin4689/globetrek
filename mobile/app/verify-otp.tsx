import {StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyOtp() {
    return (
               <SafeAreaView style={styles.container}>
                  <Text>Verify OTP</Text>
                </SafeAreaView>           
    )
}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
  })