import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const WeightScreen = () => {
  const [unit, setUnit] = useState("kg");
  const [weight, setWeight] = useState(75);
  const navigation = useNavigation();

  // Generate weight data (50kg - 150kg or 110lbs - 330lbs)
  const weightKgData = Array.from({ length: 101 }, (_, i) => 50 + i);
  const weightLbsData = Array.from({ length: 221 }, (_, i) => 110 + i);
  const weightData = unit === "kg" ? weightKgData : weightLbsData;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>What's your current weight?</Text>

      {/* Unit Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, unit === "kg" && styles.selectedToggle]}
          onPress={() => setUnit("kg")}
        >
          <Text style={[styles.toggleText, unit === "kg" && styles.selectedToggleText]}>kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, unit === "lbs" && styles.selectedToggle]}
          onPress={() => setUnit("lbs")}
        >
          <Text style={[styles.toggleText, unit === "lbs" && styles.selectedToggleText]}>lbs</Text>
        </TouchableOpacity>
      </View>

      {/* Weight Picker Box */}
      <View style={styles.weightBox}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weightPicker}
        >
          {weightData.map((w) => (
            <TouchableOpacity key={w} onPress={() => setWeight(w)}>
              <Text style={[styles.weightText, w === weight && styles.selectedWeightText]}>
                {w}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Weight */}
      <Text style={styles.selectedWeight}>{weight} {unit}</Text>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("Login")}>
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
    justifyContent: "center" 
  },

  title: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "#000", 
    marginBottom: 20 
  },

  toggleContainer: { 
    flexDirection: "row", 
    backgroundColor: "#000", 
    borderRadius: 25, 
    padding: 5 
  },

  toggleButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 40, 
    borderRadius: 25 
  },

  selectedToggle: { 
    backgroundColor: "#fff", 
    borderRadius: 25 
  },

  toggleText: { 
    fontSize: 18, 
    color: "#fff" 
  },

  selectedToggleText: { 
    fontSize: 18, 
    color: "#000", 
    fontWeight: "bold" 
  },

  weightBox: { 
    width: width * 0.8, 
    height: 80, 
    backgroundColor: "#000", 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 30,
    overflow: "hidden"
  },

  weightPicker: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 10, 
    paddingVertical: 5 
  },

  weightText: { 
    fontSize: 20, 
    marginHorizontal: 15, 
    color: "#888" 
  },

  selectedWeightText: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#fff",
    backgroundColor: "#333",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10
  },

  selectedWeight: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#000", 
    marginTop: 20 
  },

  nextButton: { 
    marginTop: 40, 
    backgroundColor: "#000", 
    paddingVertical: 15, 
    paddingHorizontal: 80, 
    borderRadius: 10 
  },

  nextText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#fff" 
  }
});

export default WeightScreen;
