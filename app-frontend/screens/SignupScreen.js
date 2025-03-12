import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios"; // Import axios

import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = ({ route, navigation }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignup = async () => {
    const { firstname, lastname, email, password } = formData;
  
    if (!firstname || !lastname || !email || !password) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }
  
    try {
      const response = await axios.post(
        "http://192.168.76.106:4000/user/register",
        {
          fullname: { firstname, lastname },
          email,
          password,
        }
      );
  
      console.log("Signup Response:", response.data); // Debug API response
  
      if (response.data.token) {
        Toast.show({ type: "success", text1: "Signup Successful" });
  
        await AsyncStorage.setItem("registerToken", response.data.token);
        navigation.navigate("Height", { token: response.data.token });
      } else {
        Toast.show({ type: "error", text1: "Signup failed. No token received." });
      }
    } catch (error) {
      console.error("Error during signup:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Signup failed",
        text2: error.response?.data?.message || "Please try again.",
      });
    }
  };
  
  const { firstname, lastname, email, password } = formData;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstname}
          onChangeText={(value) => handleInputChange("firstname", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastname}
          onChangeText={(value) => handleInputChange("lastname", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Create Password"
          value={password}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "rgb(0,0,0)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignupScreen;
