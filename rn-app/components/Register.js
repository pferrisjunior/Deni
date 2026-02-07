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
export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const userRegister = () => {
    console.log("New User: ", email, password);
  };
  return (
    <SafeAreaView style ={{ flex: 1, backgroundColor: '#fbe0b3' }}>
      <View style = {styles.container}>
        <View style = {styles.header}>
          <Image
            source={require('../assets/logo.png')}
            style = {styles.headerImg}
            />
        <Text style = {styles.title}>Register for Deni</Text>
          <Text style = {styles.subtitle}>
            Register for deni using an email and Password
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
          <TouchableOpacity style = {styles.btn} onPress = {userRegister}>
              <Text style = {styles.buttonText} > Press here to register! </Text>
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