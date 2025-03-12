import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";

export const TypeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [type, setType] = useState("Weight Loss");
  const token = route.params?.token;

  const handleNext = async () => {
    try {
      const response = await axios.put(
        "http://192.168.76.106:4000/user/type",
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Toast.show({ type: "success", text1: "Type updated successfully" });
        navigation.navigate("Gender", { token }); // Navigate to GenderScreen and pass the token
      } else {
        Toast.show({ type: "error", text1: "Failed to update Type" });
      }
    } catch (error) {
      console.error("Error updating type:", error);
      Toast.show({ type: "error", text1: "Error updating Type" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your goal?</Text>

      <View style={styles.optionsContainer}>
        {["Weight Gain", "Weight Loss", "Maintain Weight"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, type === option && styles.selectedOption]}
            onPress={() => setType(option)}
          >
            <Text
              style={[
                styles.optionText,
                type === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },

  optionsContainer: {
    width: "100%",
    alignItems: "center",
  },

  option: {
    width: "80%",
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },

  selectedOption: {
    backgroundColor: "#000",
  },

  optionText: {
    fontSize: 18,
    color: "#000",
  },

  selectedOptionText: {
    color: "#fff",
    fontWeight: "bold",
  },

  nextButton: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },

  nextText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default TypeScreen;
