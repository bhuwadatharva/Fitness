import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, Image } from "react-native";
import { TaskContext } from "../TaskContext";

const workouts = [
  { name: "Push-Ups", details: "Target: Chest, shoulders, triceps, and core.\nReps: 15–25 per set (3–5 sets)", image: require("../assets/pushups.jpg"), duration: 120 },
  { name: "Squats", details: "Target: Quads, hamstrings, glutes, and core.\nReps: 20–30 per set (3–5 sets)", image: require("../assets/squats.jpg"), duration: 120 },
  { name: "Plank", details: "Target: Abs, lower back, shoulders, and endurance.\nHold: 30 sec – 1 min (3 sets)", image: require("../assets/plank.jpg"), duration: 60 },
  { name: "Burpees", details: "Target: Cardio, legs, core, and arms.\nReps: 10–20 per set (3–5 sets)", image: require("../assets/burpees.jpg"), duration: 120 },
  { name: "Mountain Climbers", details: "Target: Core, shoulders, arms, and stamina.\nReps: 30–40 (3–4 sets)", image: require("../assets/mountain-climber.jpg"), duration: 120 },
  { name: "Jump Rope", details: "Target: Cardio, calves, coordination, and endurance.\nTime: 1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg"), duration: 120 }
];

export default function WorkoutScreen({ navigation }) {
  const { tasks, setTasks } = useContext(TaskContext);
  const [currentWorkout, setCurrentWorkout] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workouts[0].duration);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cycle > 3) {
      setTasks((prevTasks) => ({ ...prevTasks, task2: 3 }));
      navigation.navigate("Home");
    }
  }, [cycle]);

  useEffect(() => {
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
  }, [currentWorkout, cycle]);

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
          <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
          <Text style={styles.cycleText}>Cycle: {cycle}/3</Text>
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
  loadingText: { fontSize: 18, marginTop: 10, color: "#333" }
});