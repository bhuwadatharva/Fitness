import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function ReportsScreen() {
  // Mock data: Replace this with data from your backend or local storage
  const [completedTasks, setCompletedTasks] = useState([
    {
      date: '2025-01-22',
      tasks: ['Drink 2 liters of water', '30-minute workout', 'Eat balanced meal'],
    },
    {
      date: '2025-01-23',
      tasks: ['Yoga session', 'Read a book', 'Meditation'],
    },
    {
      date: '2025-01-24',
      tasks: ['Drink 2 liters of water', 'Run 5km', 'Avoid junk food'],
    },
  ]);

  // Render each report
  const renderReport = ({ item }) => (
    <View style={styles.reportContainer}>
      <Text style={styles.dateText}>{item.date}</Text>
      {item.tasks.map((task, index) => (
        <Text key={index} style={styles.taskText}>
          • {task}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <FlatList
        data={completedTasks}
        renderItem={renderReport}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  taskText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
});
