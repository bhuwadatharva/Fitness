import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, Button, ActivityIndicator, StyleSheet, Image, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TaskContext } from "../TaskContext";

const workoutsData = {
  male: {
    "Weight Loss": [
      { name: "Burpees", details: "Cardio, legs, core, and arms.\n10–20 reps (3–5 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
      { name: "Jump Rope", details: "Cardio, calves, endurance.\n1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg"), duration: 120 },
      { name: "Mountain Climbers", details: "Core, shoulders, arms, stamina.\n30–40 reps (3–4 sets)", image: require("../assets/mountain-climber.jpg"), duration: 120 },
      { name: "Squats", details: "Legs, glutes, core.\n20–30 reps (3–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
      { name: "Push-Ups", details: "Chest, shoulders, triceps.\n15–25 reps (3–5 sets)", image: require("../assets/pushups.jpg"), duration: 120 },
    ],
    "Maintain Weight": [
      { name: "Plank", details: "Abs, back, shoulders.\nHold 30s–1 min (3 sets)", image: require("../assets/plank.jpg"), duration: 60 },
      { name: "Push-Ups", details: "Upper body.\n15–25 reps (3–5 sets)", image: require("../assets/pushups.jpg"), duration: 120 },
      { name: "Jump Rope", details: "Cardio.\n1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg"), duration: 120 },
      { name: "Squats", details: "Legs, glutes.\n20–30 reps (3–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
      { name: "Burpees", details: "Full body workout.\n10–20 reps (3–5 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
    ],
    "Weight Gain": [
      { name: "Push-Ups", details: "Chest, shoulders, arms.\n20–30 reps (3–5 sets)", image: require("../assets/pushups.jpg"), duration: 120 },
      { name: "Squats", details: "Legs, glutes.\n25–35 reps (4–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
      { name: "Plank", details: "Core, back, endurance.\nHold 1 min (3–4 sets)", image: require("../assets/plank.jpg"), duration: 60 },
      { name: "Mountain Climbers", details: "Cardio, core.\n40–50 reps (4–5 sets)", image: require("../assets/mountain-climber.jpg"), duration: 120 },
      { name: "Burpees", details: "Full body.\n15–25 reps (3–4 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
    ],
  },
  female: {
    "Weight Loss": [
      { name: "Jump Rope", details: "Cardio, endurance.\n1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg"), duration: 120 },
      { name: "Burpees", details: "Full body workout.\n10–20 reps (3–5 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
      { name: "Plank", details: "Core strength.\nHold 30s–1 min (3 sets)", image: require("../assets/plank.jpg"), duration: 60 },
      { name: "Mountain Climbers", details: "Cardio, core.\n30–40 reps (3–4 sets)", image: require("../assets/mountain-climber.jpg"), duration: 120 },
      { name: "Squats", details: "Legs, glutes.\n20–30 reps (3–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
    ],
    "Maintain Weight": [
      { name: "Squats", details: "Legs, glutes.\n20–30 reps (3–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
      { name: "Plank", details: "Core, shoulders.\nHold 30s–1 min (3 sets)", image: require("../assets/plank.jpg"), duration: 60 },
      { name: "Jump Rope", details: "Cardio, endurance.\n1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg"), duration: 120 },
      { name: "Burpees", details: "Full body.\n10–20 reps (3–5 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
      { name: "Mountain Climbers", details: "Cardio, stamina.\n30–40 reps (3–4 sets)", image: require("../assets/mountain-climber.jpg"), duration: 120 },
    ],
    "Weight Gain": [
      { name: "Squats", details: "Legs, glutes.\n25–35 reps (4–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
      { name: "Push-Ups", details: "Upper body.\n15–25 reps (3–5 sets)", image: require("../assets/pushups.jpg"), duration: 120 },
      { name: "Plank", details: "Core strength.\nHold 1 min (3–4 sets)", image: require("../assets/plank.jpg"), duration: 60 },
      { name: "Jump Rope", details: "Cardio, endurance.\n1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg"), duration: 120 },
      { name: "Burpees", details: "Full body.\n10–20 reps (3–5 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
    ],
  },
};
export default function WorkoutScreen({ navigation }) {
  const { tasks, setTasks } = useContext(TaskContext);
  const [cycle, setCycle] = useState(1);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");
  const [type, setType] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

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
        setGender(data.gender);
        setType(data.type);
        setWorkouts(workoutsData[data.gender]?.[data.type] || []);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user profile");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch user profile.");
    }
  };

  useEffect(() => {
    if (cycle > 3) {
      setTasks((prevTasks) => ({ ...prevTasks, task2: 3 }));
      navigation.navigate("Home");
    }
  }, [cycle]);

  useEffect(() => {
    if (started && workouts.length > 0) {
      setTimeLeft(workouts[currentWorkout].duration);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleNextWorkout();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentWorkout, cycle, started]);

  const handleNextWorkout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (currentWorkout < workouts.length - 1) {
        setCurrentWorkout((prev) => prev + 1);
      } else {
        if (cycle < 3) {
          setCurrentWorkout(0);
          setCycle((prev) => prev + 1);
          setTasks((prevTasks) => ({ ...prevTasks, task2: (prevTasks.task2 || 0) + 1 }));
        } else {
          setTasks((prevTasks) => ({ ...prevTasks, task2: 3 }));
          navigation.navigate("Home");
        }
      }
    }, 2000);
  };

  if (!started) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ready for your workout?</Text>
        <Button title="Start Workout" onPress={() => setStarted(true)} />
      </View>
    );
  }

  if (cycle > 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Workout Completed! 🎉</Text>
        <Text style={styles.subtitle}>Great job on finishing all cycles!</Text>
        <Button title="Go Home" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Relax, take a break...</Text>
        </View>
      ) : (
        <View style={styles.workoutContainer}>
          <Image source={workouts[currentWorkout].image} style={styles.workoutImage} />
          <Text style={styles.workoutTitle}>{workouts[currentWorkout].name}</Text>
          <Text style={styles.workoutDetails}>{workouts[currentWorkout].details}</Text>
          <Text style={styles.timerText}>⏳ Time Left: {timeLeft}s</Text>
          <Text style={styles.cycleText}>🔄 Cycle: {cycle}/3</Text>
          <Button title="Next Workout" onPress={handleNextWorkout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5", padding: 20 },
  workoutContainer: { alignItems: "center", backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 5, width: "90%" },
  workoutImage: { width: 200, height: 200, resizeMode: "contain", marginBottom: 15, borderRadius: 10 },
  workoutTitle: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
  workoutDetails: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 10 },
  timerText: { fontSize: 18, fontWeight: "bold", color: "#FF5722", marginBottom: 10 },
  cycleText: { fontSize: 16, fontWeight: "bold", color: "#4CAF50", marginBottom: 10 },
  loaderContainer: { alignItems: "center" },
  loadingText: { fontSize: 18, marginTop: 10, color: "#333" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, color: "#666", marginBottom: 20 }
});
