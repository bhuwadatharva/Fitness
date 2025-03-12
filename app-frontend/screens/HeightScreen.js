import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";

const HeightScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const token = route.params?.token; // Get token from navigation params

  const [unit, setUnit] = useState("cm");
  const [heightCm, setHeightCm] = useState(175);
  const [heightFt, setHeightFt] = useState("5'9\"");

  const heightCmData = Array.from({ length: 101 }, (_, i) => 100 + i);
  const heightFtData = [];
  for (let ft = 3; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      heightFtData.push({
        label: `${ft}'${inch}"`,
        value: `${ft}'${inch}"`,
      });
    }
  }

  const handleNext = async () => {
    const height = unit === "cm" ? `${heightCm} cm` : heightFt;

    try {
      const response = await axios.put(
        `http://192.168.76.106:4000/user/height`,
        { height },
        {
          headers: { Authorization: `Bearer ${token}` }, // Send token
        }
      );

      if (response.status === 200) {
        Toast.show({ type: "success", text1: "Height updated successfully" });

        // Navigate to Weight Screen
        navigation.navigate("Weight", { token });
      } else {
        Toast.show({ type: "error", text1: "Failed to update height" });
      }
    } catch (error) {
      console.error("Error updating height:", error);
      Toast.show({ type: "error", text1: "Error updating height" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your height?</Text>

      {/* Unit Switch */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setUnit("cm")}
          style={[styles.switchButton, unit === "cm" && styles.selected]}
        >
          <Text style={unit === "cm" ? styles.switchTextSelected : styles.switchText}>
            cm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUnit("ft")}
          style={[styles.switchButton, unit === "ft" && styles.selected]}
        >
          <Text style={unit === "ft" ? styles.switchTextSelected : styles.switchText}>
            ft
          </Text>
        </TouchableOpacity>
      </View>

      {/* Height Picker */}
      <View style={styles.pickerContainer}>
        {unit === "cm" ? (
          <WheelPickerExpo
            items={heightCmData.map((h) => ({ label: `${h} cm`, value: h }))}
            selectedValue={heightCm}
            onChange={({ value }) => setHeightCm(value)}
            height={150}
          />
        ) : (
          <WheelPickerExpo
            items={heightFtData}
            selectedValue={heightFt}
            onChange={({ value }) => setHeightFt(value)}
            height={150}
          />
        )}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 80, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", color: "#000", marginBottom: 20 },
  switchContainer: { flexDirection: "row", backgroundColor: "#000", borderRadius: 25, marginTop: 20, padding: 5 },
  switchButton: { paddingVertical: 10, paddingHorizontal: 40, borderRadius: 25 },
  switchText: { fontSize: 22, color: "#fff" },
  selected: { backgroundColor: "#fff", borderRadius: 25 },
  switchTextSelected: { fontSize: 18, color: "#000", fontWeight: "bold" },
  pickerContainer: { height: 150, justifyContent: "center", alignSelf: "center", backgroundColor: "#000", borderRadius: 20, marginTop: 30, padding: 15 },
  nextButton: { marginTop: 40, backgroundColor: "#000", paddingVertical: 15, paddingHorizontal: 80, borderRadius: 10 },
  nextButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default HeightScreen;
