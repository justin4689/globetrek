import { Colors, Fonts } from "@/utils/constants";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Link } from "expo-router";
import { KeyboardAvoidingView } from "react-native";


export default function Register() {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
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

        <Text style = {styles.title}>Register</Text>
        <Text style = {styles.subtitle}>Create a new account to get started</Text>
       </View>

       <View style = {styles.formContainer}>
         <View style = {styles.inputWrapper}>
           <View style = {styles.inputContainer}>
              <Text style = {styles.label}>First Name</Text>
           <TextInput 
            style = {styles.input}
            placeholder = "Enter your first name"
            autoCapitalize = "words"
            />
           </View>
           <View style = {styles.inputContainer}>
              <Text style = {styles.label}>Last Name</Text>
           <TextInput 
            style = {styles.input}
            placeholder = "Enter your last name"
            autoCapitalize = "words"
            />
           </View>
          
         </View>
         <View style = {styles.inputContainer}>
           <Text style = {styles.label}>Email address</Text>
           <TextInput 
            style = {styles.input}
            placeholder = "Enter your email"
            keyboardType = "email-address"
            autoCapitalize = "none"
            />
          
         </View>
         <View style = {[styles.inputContainer, {position: 'relative'}]}>
           <Text style = {styles.label}>Password</Text>
           <TextInput 
            style = {styles.input}
            placeholder = "Enter your password"
            secureTextEntry = {!passwordVisible}
            autoCapitalize = "none"
            />
                  <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color={Colors.tintColor} onPress={() => setPasswordVisible(!passwordVisible)} style={{position: 'absolute', right: 12, bottom: 12}} />

          
         </View>
           <View style = {[styles.inputContainer, {position: 'relative'}]}>
           <Text style = {styles.label}>Confirm Password</Text>
           <TextInput 
            style = {styles.input}
            placeholder = "Confirm your password"
            secureTextEntry = {!confirmPasswordVisible}
            autoCapitalize = "none"
            />
                  <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={24} color={Colors.tintColor} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={{position: 'absolute', right: 12, bottom: 12}} />

          
         </View>

         <Pressable onPress={() => console.log('Login pressed')} style = {({pressed}) => ({opacity: pressed ? 0.5 : 1})} >
          <View style = {styles.buttonContainer}>
            <Text style = {styles.button}>Login</Text>
          </View>
         </Pressable>

         <Text style = {styles.or}>OR</Text>

           <Pressable onPress={() => console.log('Login pressed')} style = {({pressed}) => ({opacity: pressed ? 0.5 : 1})} >
          <View style = {styles.buttonGoogle}>
                        <Image source={require('../assets/image/google.png')} style={{width: 24, height: 24}} />

            <Text style = {styles.textGoogle}> 
              Google</Text>
          </View>
         </Pressable>

          <Text style = {styles.signUp}>Have an account? <Link href="/login"><Text style = {styles.signUpLink}> Login</Text></Link> </Text>


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
    flexDirection : "row",
     gap:10
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


   buttonGoogle : {
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

   or : {

     marginTop: 24,
     textAlign: "center",
     color: Colors.textColor,
     fontFamily: Fonts.medium,

   } ,

  textGoogle : {
    color: Colors.tintColor,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.medium,
  } , 

  signUp : {
    marginTop: 24,
    textAlign: "center",
    color: Colors.textColor,
    fontFamily: Fonts.medium,
  } ,
  
  signUpLink : {
    color: Colors.primaryColor,
    fontFamily: Fonts.medium,
  }
});
