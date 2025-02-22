import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { TaskContext } from "../TaskContext";

export default function BookReviewScreen({ navigation }) {
  const { tasks, setTasks } = useContext(TaskContext);
  const [review, setReview] = useState(tasks.task4 || "");

  const handleSubmit = () => {
    setTasks((prevTasks) => ({ ...prevTasks, task4: review })); // Save review in context
    navigation.navigate("Home"); // Navigate back to home or relevant screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write Your Book Review</Text>
      <TextInput
        style={styles.input}
        placeholder="Share your thoughts on the book..."
        placeholderTextColor="#999"
        value={review}
        onChangeText={setReview}
        multiline
      />
      <Button title="Submit Review" onPress={handleSubmit} color="#4CAF50" />
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
});
