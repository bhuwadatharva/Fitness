import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useNavigation } from "@react-navigation/native";

const HeightScreen = () => {
  const navigation = useNavigation();
  const [unit, setUnit] = useState("cm");
  const [heightCm, setHeightCm] = useState(175);
  const [heightFt, setHeightFt] = useState("5'9\""); // Store as string

  // Generate height data
  const heightCmData = Array.from({ length: 101 }, (_, i) => 100 + i);
  const heightFtData = [];
  for (let ft = 3; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      heightFtData.push({
        label: `${ft}'${inch}"`,
        value: `${ft}'${inch}"`, // Convert to string
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your height?</Text>

      {/* Unit Switch */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          onPress={() => setUnit("cm")}
          style={[styles.switchButton, unit === "cm" && styles.selected]}
        >
          <Text
            style={unit === "cm" ? styles.switchTextSelected : styles.switchText}
          >
            cm
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setUnit("ft")}
          style={[styles.switchButton, unit === "ft" && styles.selected]}
        >
          <Text
            style={unit === "ft" ? styles.switchTextSelected : styles.switchText}
          >
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

      {/* Height Display */}
     

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Weight")}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    backgroundColor: "#ffffff", // White background
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000", // Black text
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderRadius: 25,
    marginTop: 20,
    padding: 5,
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  switchText: {
    fontSize: 22,
    color: "#fff", // White text on black background
  },
  selected: {
    backgroundColor: "#fff", // White selected background
    borderRadius: 25,
  },
  switchTextSelected: {
    fontSize: 18,
    color: "#000", // Black text for selected option
    fontWeight: "bold",
  },
  pickerContainer: {
    height: 150,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#000", // Black picker container
    borderRadius: 20,
    marginTop: 30,
    padding: 15,
  },
  heightDisplay: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000", // Black text
    marginTop: 20,
  },
  nextButton: {
    marginTop: 40,
    backgroundColor: "#000", // Black button
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text on black button
  },
});

export default HeightScreen;
