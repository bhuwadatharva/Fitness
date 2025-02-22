import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (name, value) =>
    setCredentials((prev) => ({ ...prev, [name]: value }));

  const handleLogin = async () => {
    const { email, password } = credentials;

    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }

    try {
      console.log(email, password);
      const response = await axios.post(
        `http://192.168.76.106:4000/user/login`,
        {
          email,
          password,
        }
      );
      console.log(email, password);

      if (response.data.success || response.data.token) {
        Toast.show({ type: "success", text1: "Login Successful" });

        // Save login state or token to AsyncStorage
        await AsyncStorage.setItem(
          "userToken",
          response.data.token || "loggedIn"
        );

        // Navigate to Home screen
        navigation.replace("Home", { loginSuccess: true });
      } else {
        Toast.show({ type: "error", text1: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Toast.show({
        type: "error",
        text1: "Login failed. Please try again.",
        text2: error.response?.data?.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flexContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image source={require("../assets/gym.jpg")} style={styles.image} />
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={credentials.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={credentials.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.signupText}>New User? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  image: {
    width: 250,
    height: 200,
    marginTop: 80,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 20,
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
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    marginTop: 10,
  },
  signupText: {
    color: "#007BFF",
    fontSize: 12,
    fontWeight: "500",
  },
});
