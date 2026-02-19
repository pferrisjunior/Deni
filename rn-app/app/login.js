import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, KeyboardAvoidingView, } from "react-native";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword,  } from "firebase/auth"; 
import { useRouter } from 'expo-router';
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const signIn = async () => {
      try{
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/home");
    }catch (error) {
      console.log("Login error:", error.message);
    }
  };
  const registrationButton = () => {
    router.replace("/register")
  };
  useEffect(() => {
  GoogleSignin.configure({
    webClientId: "202780657934-aeh8u3vtt9v4nisv1amsfban9ut4paj2.apps.googleusercontent.com",
    offlineAccess: true,
  });
  setGoogleReady(true);
}, []);
const signInWithGoogle = async () => {
  try {
    setIsSubmitting(true);
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    console.log("GoogleSignin response:", response);
    const { data } = response;
    const { idToken } = data;
    if (!idToken) throw new Error("No idToken returned from Google");
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    console.log("Firebase user:", userCredential.user);
    router.replace("/home");
  } catch (error) {
    console.log("Google Login Error:", error);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <View style={{ flex: 1, backgroundColor: '#fbe0b3' }}>
    <SafeAreaView style ={{ flex: 1, backgroundColor: '#fbe0b3' }}>
      <KeyboardAvoidingView
      style = {{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
      <ScrollView
      contentContainerStyle={{ flexGrow: 1}}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={true}
      >
      <View style = {styles.container}>
        <View style = {styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style = {styles.headerImg}
            />
        <Text style = {styles.title}>Sign into Deni</Text>
          <Text style = {styles.subtitle}>
            Sign in using Email/Password, or Google
          </Text>
      </View>
        <View style = {styles.form}>
          <View style = {styles.input}>
            <Text style = {styles.inputLabel}> Email Address</Text>
            <TextInput
              autoCapitalize = "none"
              autoCorrect = {false}
              keyboardType = "email-address"
              style={styles.inputControl}
              placeholder="john@example.com"
              placeholderTextColor = "#6b7280"
              value = {email}
              onChangeText={setEmail}
              />
            </View>

           <View style = {styles.input}>
            <Text style = {styles.inputLabel}> Password</Text>
            <TextInput
              secureTextEntry
              style = {styles.inputControl}
              placeholder="**********"
              placeholderTextColor = "#6b7280"
              value = {password}
              onChangeText={setPassword}
              />
            </View>
          <TouchableOpacity style = {styles.btn} onPress = {signIn}>
              <Text style = {styles.buttonText} > Sign in </Text>
          </TouchableOpacity>  
          <TouchableOpacity style = {styles.btn} onPress = {signInWithGoogle}>
            <Text style = {styles.buttonText} > Sign in with Google </Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.btn} onPress = {registrationButton}>
            <Text style = {styles.buttonText} > New user? Press here to register. </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  header: {
    marginVertical: 36,
  },
  headerImg: {
    width: 300,
    height: 120,
    alignSelf: "center",
    resizeMode: 'contain',
    marginBottom: 36,
  },
  title: {
    alignSelf: "center",
    fontSize: 27,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 6,

  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  btn: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
});

