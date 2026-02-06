import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = () => {
    console.log("Sign in:", email, password);
  };
  const googleSignInButton = () => {
    console.log("Google OAuth button is pressed go to Google OAuth");
  };
  const registrationButton = () => {
    console.log("Registration button is pressed go to registration page");
  };
  return (
    <SafeAreaView style ={{ flex: 1, backgroundColor: '#fbe0b3' }}>
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
            <Text style = {styles.inputLabel}> Email Adress</Text>
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
          <TouchableOpacity style = {styles.btn} onPress = {googleSignInButton}>
            <Text style = {styles.buttonText} > Sign in with Google </Text>
          </TouchableOpacity>
          <TouchableOpacity style = {styles.btn} onPress = {registrationButton}>
            <Text style = {styles.buttonText} > New user? Press here to register. </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>


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
    fontWeight: '500',
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
  btnText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

