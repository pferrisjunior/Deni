//We need to verify passwords
import React, { useEffect, useState } from "react";
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    useEffect(() => {
      setError(checkPassword(password,confirmPassword));
    }, [password,confirmPassword]);
    const isValid = !error && password && confirmPassword;
    const userRegister = () => {
    console.log("New User: ", email, password);
  };
  function checkPassword(password, confirmPassword){
    if (!password || !confirmPassword){
      return ""
    }
    if (password.length < 8){
      return "Password must have at least 8 characters"
    }
    if (!/^[A-Z]/.test(password)){
      return "Password must start with a capital letter"
    }
    if (!/[0-9]/.test(password)){
      return "Password must contain at least one number."
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)){
      return "Password must contain at least one symbol."
    }
    if (password !== confirmPassword){
      return "Passwords must match."
    }
    return ""

  }
  return (
    <SafeAreaView style ={{ flex: 1, backgroundColor: '#fbe0b3' }}>
      <View style = {styles.container}>
        <View style = {styles.header}>
        <Text style = {styles.title}>Register for Deni</Text>
          <Text style = {styles.subtitle}>
            Register for Deni using an E-mail and Password
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
          <View style = {styles.input}>
            <Text style = {styles.inputLabel}> Confirm Password</Text>
            <TextInput
              secureTextEntry
              style = {styles.inputControl}
              placeholder="**********"
              placeholderTextColor = "#6b7280"
              value = {confirmPassword}
              onChangeText={setConfirmPassword}
              />
            </View>
          {error ? <Text style = {styles.error}>{error}</Text> : null}
        <TouchableOpacity
        style={[styles.btn, !isValid && styles.btnDisabled]}
        onPress={userRegister}
        disabled={!isValid}
        >
          <Text style={styles.btnText}>Press here to register!</Text>
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
    alignItems: "center"
  },
  title: {
    alignSelf: "center",
    fontSize: 27,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 6,

  },
  subtitle: {
    alignself: "center",
    fontSize: 15,
    fontWeight: '500',
    color: '#1e1e1e',
    marginBottom: 6,

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
    color: "#222",
  },
  btnDisabled: {
  opacity: 0.5,
},
 error: {
  color: "red",
  textAlign: "center",
  marginBottom: 12,
  fontSize: 14,
}, 
});