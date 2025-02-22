import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, Image } from "react-native";
import { TaskContext } from "../TaskContext"; // ✅ Import TaskContext

const workouts = [
  { name: "Push-Ups", details: "Target: Chest, shoulders, triceps, and core.\nReps: 15–25 per set (3–5 sets)", image: require("../assets/pushups.jpg") },
  { name: "Squats", details: "Target: Quads, hamstrings, glutes, and core.\nReps: 20–30 per set (3–5 sets)", image: require("../assets/squats.jpg") },
  { name: "Plank", details: "Target: Abs, lower back, shoulders, and endurance.\nHold: 30 sec – 1 min (3 sets)", image: require("../assets/plank.jpg") },
  { name: "Burpees", details: "Target: Cardio, legs, core, and arms.\nReps: 10–20 per set (3–5 sets)", image: require("../assets/burpees.jpg") },
  { name: "Mountain Climbers", details: "Target: Core, shoulders, arms, and stamina.\nReps: 30–40 (3–4 sets)", image: require("../assets/mountain-climber.jpg") },
  { name: "Jump Rope", details: "Target: Cardio, calves, coordination, and endurance.\nTime: 1–2 min per round (3–5 rounds)", image: require("../assets/rope.jpg") }
];

export default function WorkoutScreen({ navigation }) {
  const { tasks, setTasks } = useContext(TaskContext); // ✅ Get tasks and setTasks from TaskContext
  const [currentWorkout, setCurrentWorkout] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cycle > 3) {
      // ✅ Update task2 (workouts completed) in TaskContext before navigating
      setTasks((prevTasks) => ({
        ...prevTasks,
        task2: 3, // Setting workouts completed to 3 when cycle completes
      }));

      navigation.navigate("Home");
    }
  }, [cycle]);

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

          // ✅ Increment task2 (workout count) in TaskContext
          setTasks((prevTasks) => ({
            ...prevTasks,
            task2: (prevTasks.task2 || 0) + 1, 
          }));
        } else {
          // ✅ Final update to task2 before navigating back
          setTasks((prevTasks) => ({
            ...prevTasks,
            task2: 3, 
          }));
          navigation.navigate("Home");
        }
      }
    }, 10000); // 10-second loader
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Relax take a Break...</Text>
        </View>
      ) : (
        <View style={styles.workoutContainer}>
          <Image source={workouts[currentWorkout].image} style={styles.workoutImage} />
          <Text style={styles.workoutTitle}>{workouts[currentWorkout].name}</Text>
          <Text style={styles.workoutDetails}>{workouts[currentWorkout].details}</Text>
          <Text style={styles.cycleText}>Cycle: {cycle}/3</Text>
          <Button title="Next Workout" onPress={handleNextWorkout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  workoutContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
  },
  workoutImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
    borderRadius: 10,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  workoutDetails: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  cycleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  loaderContainer: {
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
    color: "#333",
  },
});
