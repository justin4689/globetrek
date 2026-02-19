import { Colors, Fonts } from "@/utils/constants";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Link, router } from "expo-router";
import { KeyboardAvoidingView } from "react-native";


export default function ForgotPassword() {

  
  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
      
      behavior= {Platform.OS === 'ios' ? 'padding' : 'height'}
      ><ScrollView contentContainerStyle={{ alignItems: 'center' , flexGrow: 1 }}
       showsVerticalScrollIndicator={false}
      >

    

      <View>
        <Image source={require("../assets/image/logo-full.png")} style={{ width: 200, height: 200 }} />
      </View>

       <View style = {styles.textContainer}>

        <Text style = {styles.title}>Forgot  Password</Text>
        <Text style = {styles.subtitle}>Enter your email and we’ll send you a link to reset your password</Text>
       </View>

       <View style = {styles.formContainer}>
         <View style = {styles.inputContainer}>
           <TextInput 
            style = {styles.input}
            placeholder = "Enter your email"
            keyboardType = "email-address"
            autoCapitalize = "none"
            />
          
         </View>
       

         <Pressable onPress={() =>  router.push('/verify-otp')} style = {({pressed}) => ({opacity: pressed ? 0.5 : 1})} >
          <View style = {styles.buttonContainer}>
            <Text style = {styles.button}>Send Reset Link</Text>
          </View>
         </Pressable>


          

         <Pressable onPress={() =>  router.back()}>
          <Text style = {styles.signIn}>Back to <Text style = {styles.signInLink}>Login</Text> </Text>
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
    fontFamily: Fonts.regular,
    alignItems: "center",
    paddingHorizontal: 16
   
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
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    backgroundColor: Colors.secondaryColor,
    color: Colors.white,
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    fontFamily: Fonts.medium,
  },


 
  signIn : {
    marginTop: 24,
    textAlign: "center",
    color: Colors.textColor,
    fontFamily: Fonts.medium,
  } ,
  
  signInLink : {
    color: Colors.primaryColor,
    fontFamily: Fonts.medium,
  }
});
