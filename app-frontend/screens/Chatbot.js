import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const API_KEY = ""; // Store securely in .env
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Chatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const result = await model.generateContent({ contents: [{ parts: [{ text: inputText }] }] });
      const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";

      setMessages((prevMessages) => [...prevMessages, { text: responseText, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Sorry, an error occurred.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.chatContainer}>
      <Text style={styles.header}>Diet & Fitness Chatbot</Text>

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isLoading}>
          <Text style={styles.sendText}>{isLoading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: { backgroundColor: "white", borderRadius: 10, padding: 15, height: 400, justifyContent: "space-between" },
  header: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  message: { padding: 10, marginVertical: 5, borderRadius: 5, maxWidth: "80%" },
  userMessage: { backgroundColor: "#007bff", alignSelf: "flex-end" },
  botMessage: { backgroundColor: "#e9ecef", alignSelf: "flex-start" },
  messageText: { color: "black" },
  inputContainer: { flexDirection: "row", borderTopWidth: 1, borderColor: "#ddd", paddingTop: 5 },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginRight: 5 },
  sendButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5 },
  sendText: { color: "white" },
});

export default Chatbot;