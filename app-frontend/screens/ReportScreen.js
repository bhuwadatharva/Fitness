import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Image, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable"; // ✅ Import Animatable
import { Svg, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ReportScreen = () => {
  const [streak, setStreak] = useState(0);
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [user, setUser] = useState(null);
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (streak / 75) * 360,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [streak]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please log in again.");
        return;
      }
      const response = await fetch("http://192.168.76.106:4000/user/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setStreak(data.streak);
        setType(data.type);
        setGender(data.gender);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user profile");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch user profile.");
    }
  };

  const progress = progressAnim.interpolate({
    inputRange: [0, 360],
    outputRange: [565, 0],
  });

  const milestones = [15, 30, 45, 60, 75];

  // Medal images
  const medalImages = [
    require("../assets/1st.jpg"),
    require("../assets/2nd.jpg"),
    require("../assets/3rd.jpg"),
    require("../assets/4th.jpg"),
    require("../assets/5th.jpg"),
  ];

  return (
    <View style={styles.container}>
      {/* Progress Circle */}
      <Svg width={220} height={220} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FF8C00" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle cx="100" cy="100" r="90" stroke="#ddd" strokeWidth="12" fill="none" />
        <AnimatedCircle
          cx="100"
          cy="100"
          r="90"
          stroke="url(#grad)"
          strokeWidth="12"
          strokeDasharray="565"
          strokeDashoffset={progress}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Text style={styles.streakText}>{streak} / 75 Day Streak</Text>

      {/* User Info */}
      <View style={styles.infoContainer}>
        {user && user.fullname && (
          <Animatable.Text style={styles.greeting} animation="fadeIn" duration={1500}>
            {`${user.fullname.firstname} ${user.fullname.lastname}`}
          </Animatable.Text>
        )}
        <Text style={styles.infoText}>Gender: {gender}</Text>
        <Text style={styles.infoText}>Goal: {type}</Text>
      </View>

      {/* Medals */}
      <View style={styles.medalContainer}>
        {milestones.map((milestone, index) => (
          <View key={index} style={styles.medalBox}>
            {streak >= milestone ? (
              <Image source={medalImages[index]} style={styles.medal} />
            ) : (
              <View style={styles.greyMedal} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2C", // Dark gradient background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  streakText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: "#292940",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    width: "90%",
  },
  greeting: {
    fontSize: 22,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "500",
  },
  medalContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  medalBox: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 12,
    borderRadius: 15,
    backgroundColor: "#292940",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  medal: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  greyMedal: {
    width: 80,
    height: 80,
    backgroundColor: "#555",
    borderRadius: 40,
    opacity: 0.4,
  },
});

