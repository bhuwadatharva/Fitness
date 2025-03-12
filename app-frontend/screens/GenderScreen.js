import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
const { width, height } = Dimensions.get("window");

const GenderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const token = route.params?.token;
  const [selectedGender, setSelectedGender] = useState(null);
  

  const handleGenderSelection = async (gender) => {
    setSelectedGender(gender);

    try {
      const response = await axios.put(
        "http://192.168.76.106:4000/user/gender",
        { gender },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Toast.show({ type: "success", text1: "Gender updated successfully" });
        navigation.navigate("Login"); // Navigate to Login Screen
      } else {
        Toast.show({ type: "error", text1: "Failed to update gender" });
      }
    } catch (error) {
      console.error("Error updating gender:", error);
      Toast.show({ type: "error", text1: "Error updating gender" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Gender</Text>

      <View style={styles.genderContainer}>
        {/* Male Selection */}
        <TouchableOpacity
          style={[
            styles.genderOption,
            selectedGender === "male" && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelection("male")}
        >
          <Image
            source={require("../assets/male.png")} // Add Male Image in assets
            style={styles.genderImage}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === "male" && styles.selectedGenderText,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        {/* Female Selection */}
        <TouchableOpacity
          style={[
            styles.genderOption,
            selectedGender === "female" && styles.selectedGender,
          ]}
          onPress={() => handleGenderSelection("female")}
        >
          <Image
            source={require("../assets/female.png")} // Add Female Image in assets
            style={styles.genderImage}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === "female" && styles.selectedGenderText,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
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

  genderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    gap: 20
  },

  genderOption: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },

  selectedGender: {
    borderColor: "#000",
    backgroundColor: "#000",
  },

  genderImage: {
    width: width * 0.35, // Less width
    height: height * 0.5, // More height
    resizeMode: "contain",
  },

  genderText: {
    fontSize: 18,
    color: "#000",
    marginTop: 10,
  },

  selectedGenderText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GenderScreen;
