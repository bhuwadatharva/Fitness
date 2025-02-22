import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { TaskContext } from "../TaskContext";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import axios from "axios";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { useFocusEffect } from "@react-navigation/native";


export default function HomeScreen({ navigation }) {
  const { setTasks, totalDays, tasks } = useContext(TaskContext);
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);
  const progress = streak / totalDays;

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
        setStreak(data.streak);
        
      } else {
        Alert.alert("Error", data.message || "Failed to fetch user profile");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch user profile.");
    }
  };


  useEffect(() => {
    requestNotificationPermission();
    scheduleNotifications();
    registerBackgroundTask();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "You need to allow notifications.");
    }
  };
  
  const scheduleNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear old schedules
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hydration Reminder 💧",
        body: "It's time to drink water!",
        sound: true,
      },
      trigger: {
        hour: new Date().getHours(),
        minute: (new Date().getMinutes() + 1) % 60, // Run every hour
        repeats: true,
      },
    });
  };

  const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hydration Reminder 💧",
      body: "Drink water to stay healthy!",
      sound: true,
    },
    trigger: null, // Immediate notification
  });

  return BackgroundFetch.Result.NewData;
});

const registerBackgroundTask = async () => {
  const { status } = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.Status.Restricted || status === BackgroundFetch.Status.Denied) {
    Alert.alert("Error", "Background execution is disabled!");
    return;
  }

  await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
    minimumInterval: 4 * 60 * 60, // Every 4 hours
    stopOnTerminate: false,
    startOnBoot: true,
  });
};


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(() => {
      setTasks((prevTasks) => ({
        ...prevTasks,
        task1: prevTasks.task1 || 0, // Ensure task1 keeps its value
      }));
    });
  
    return () => subscription.remove();
  }, []);
  

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Your task data will be deleted if you log out. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userToken"); // Remove token
              await AsyncStorage.removeItem("tasks"); // Remove task data
              await AsyncStorage.removeItem("lastUpdatedDate"); // Clear last updated date
               // Reset state tasks
              navigation.replace("Login"); // Navigate to login screen
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", "Something went wrong while logging out.");
            }
          },
        },
      ]
    );
  };
  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Camera roll permission is needed.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        task5: { photoFile: result.assets[0].uri, uploaded: true },
      }));
    }
  };


  const handleTaskCompletion = (taskKey) => {
    let updatedTasks = { ...tasks };
  
    if (taskKey === "task1") {
      if (!updatedTasks.task1) {
        updatedTasks.task1 = 1;
      } else if (updatedTasks.task1 < 6) {
        updatedTasks.task1 += 1;
      }
    } else if (taskKey === "task2") {
      navigation.navigate("Workout");
    } else if (taskKey === "task3") {
      updatedTasks.task3 = !tasks.task3;
    } else if (taskKey === "task4") {
      navigation.navigate("BookReview");
    } else if (taskKey === "task5") {
      pickImage();
      return;
    }
  
    setTasks(updatedTasks);
  };
  


  const submitProgress = async () => {  // Add 'async' here
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "No token found. Please log in again.");
      return;
    }
    console.log("Using Token:", token);
  
    const formData = new FormData();
      
    // Append each task
    Object.entries(tasks).forEach(([key, value]) => {
      if (key === "task5" && value.photoFile) {
        // Append the image file
        formData.append("photoFile", {
          uri: value.photoFile,
          name: "progress_photo.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await axios.put(
        "http://192.168.76.106:4000/user/tasks",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Alert.alert("Success", "Tasks submitted successfully!");
    } catch (error) {
      console.error("Error submitting tasks:", error);
      Alert.alert("Error", "Failed to submit tasks.");
    }
  };


  const taskList = [
    { taskName: "Drink a water", taskKey: "task1" },
    { taskName: "workout", taskKey: "task2" },
    { taskName: "Follow a diet with no cheat meals or alcohol", taskKey: "task3" },
    { taskName: "Read 10 pages of a non-fiction book", taskKey: "task4" },
    { taskName: "Pick up a progress photo", taskKey: "task5" },
  ];

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Animatable.Text style={styles.greeting} animation="fadeIn" duration={1500}>
        {user ? `Hey ${user.fullname.firstname} ${user.fullname.lastname}` : "Hey User"}
      </Animatable.Text>
      <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={40} color="#FF6347" />
      </TouchableOpacity>
    </View>

    <ScrollView contentContainerStyle={styles.scrollableContent}>
      <TouchableOpacity style={styles.progressContainer}>
        <Animatable.View style={styles.progressBox} animation="bounceIn" duration={1000}>
          <Progress.Bar progress={progress} width={350} height={30} color="#000000" borderWidth={1} borderRadius={8} />
        </Animatable.View>
        <Text style={styles.progressDetails}>{streak}/{totalDays} Streak Days</Text>
      </TouchableOpacity>

      <View style={styles.tasksContainer}>
        <Text style={styles.taskTitle}>Today's Tasks:</Text>
        {taskList.map((task, index) => (
          <Animatable.View key={index} style={styles.taskBox} animation="fadeInUp" delay={index * 200} duration={500}>
            <Text style={styles.taskText}>{index + 1}. {task.taskName}</Text>

            {task.taskKey === "task1" ? (
  tasks.task1 >= 6 ? (
    <Text style={styles.completedText}>✅ Completed</Text>
  ) : (
    <TouchableOpacity style={styles.completeButton} onPress={() => handleTaskCompletion(task.taskKey)}>
      <Text style={styles.completeButtonText}>Drink Water ({tasks.task1 || 0}/6)</Text>
    </TouchableOpacity>
  )
) : task.taskKey === "task5" ? (
  tasks.task5?.photoFile ? (
    <Text style={styles.completedText}>✅ Completed</Text>
  ) : (
    <TouchableOpacity style={styles.completeButton} onPress={() => handleTaskCompletion(task.taskKey)}>
      <Text style={styles.completeButtonText}>Mark as Complete</Text>
    </TouchableOpacity>
  )
) : (
  !tasks[task.taskKey] || tasks[task.taskKey] === "false" ? (
    <TouchableOpacity style={styles.completeButton} onPress={() => handleTaskCompletion(task.taskKey)}>
      <Text style={styles.completeButtonText}>Mark as Complete</Text>
    </TouchableOpacity>
  ) : (
    <Text style={styles.completedText}>✅ Completed</Text>
  )
)}

          </Animatable.View>
        ))}
      </View>

      <TouchableOpacity style={styles.endOfDayButton} onPress={submitProgress}>
        <Text style={styles.endOfDayButtonText}>Submit Tasks ✅</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#f5f5f5" },
header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ddd", paddingTop: 45 },
greeting: { fontSize: 20, fontWeight: "bold", color: "#000" },
logoutIcon: { padding: 5 },
progressContainer: { alignItems: "center", marginTop: 20 },
progressBox: { backgroundColor: "#ffffff", justifyContent: "center" },
progressDetails: { fontSize: 14, color: "#555", marginTop: 10 },
tasksContainer: { paddingLeft: 20, marginTop: 20, width: "90%", alignItems: "flex-start" },
taskTitle: { paddingTop: 10, fontSize: 30, fontWeight: "700", color: "#000", marginBottom: 15 },
taskBox: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd", width: "100%" },
taskText: { fontSize: 18, color: "#000" },
completeButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, marginTop: 10, alignItems: "center" },
completeButtonText: { color: "#fff", fontSize: 16 },
completedText: { color: "#4CAF50", fontSize: 16, fontWeight: "bold", marginTop: 10 },
scrollableContent: { paddingBottom: 60 },
endOfDayButton: { backgroundColor: "#FF6347", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
endOfDayButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
