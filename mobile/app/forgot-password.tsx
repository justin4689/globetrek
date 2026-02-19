import {StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
    return (
               <SafeAreaView style={styles.container}>
                        <Text>Forgot Password</Text>
                  </SafeAreaView>           
    )
}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
  })