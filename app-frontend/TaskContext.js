import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const totalDays = 75;

  const defaultTasks = {
    task1: 0,
    task2: 0,
    task3: false,
    task4: "",
    task5: { photoFile: null, uploaded: false },
  };

  const [tasks, setTasks] = useState(defaultTasks);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  useEffect(() => {
    console.log("Updated Tasks:", tasks);
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const lastUpdatedDate = await AsyncStorage.getItem("lastUpdatedDate");

      const currentDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD

      if (storedTasks && lastUpdatedDate) {
        if (lastUpdatedDate !== currentDate) {
          await resetTasks(); // Reset only if a new day has started
        } else {
          setTasks(JSON.parse(storedTasks));
        }
      } else {
        await resetTasks();
      }
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      const currentDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD
      await AsyncStorage.setItem("lastUpdatedDate", currentDate);
    } catch (error) {
      console.error("Error saving tasks", error);
    }
  };

  const resetTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(defaultTasks));
      const currentDate = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem("lastUpdatedDate", currentDate);
      setTasks(defaultTasks);
    } catch (error) {
      console.error("Error resetting tasks", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, totalDays }}>
      {children}
    </TaskContext.Provider>
  );
};
