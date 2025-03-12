import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { ReportScreen } from "./screens/ReportScreen";
import Toast from "react-native-toast-message";
import HomeScreen from "./screens/HomeScreen";
import HeightScreen from "./screens/HeightScreen";
import WeightScreen from "./screens/WeightScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import BookreviewScreen from "./screens/BookreviewScreen";
import ProgressphotoScreen from "./screens/ProgressphotoScreen";
import * as Notifications from "expo-notifications";
import { TaskProvider } from "./TaskContext";
import TypeScreen from "./screens/TypeScreen";
import GenderScreen from "./screens/GenderScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        setIsLoggedIn(!!userToken); // Set login state based on token existence
        console.log("User token found in AsyncStorage:", userToken);
      } catch (error) {
        console.error("Failed to fetch token from AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginState();
  }, []);

  if (isLoading) {
    // Optionally show a loading spinner while checking login state
    return null;
  }


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


  return (
    <TaskProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Type"
          component={TypeScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Gender"
          component={GenderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookReview"
          component={BookreviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProgressPhoto"
          component={ProgressphotoScreen}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="Height"
          component={HeightScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Weight"
          component={WeightScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
    </TaskProvider>
  );
}
