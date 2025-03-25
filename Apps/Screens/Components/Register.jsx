import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { auth, firestore } from "../../../firebaseConfig"; // Adjust path as needed
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!email || !username || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Registration Failed", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Registration Failed", "Passwords do not match.");
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;

        // Store additional user information in Firestore
        const usersCollectionRef = doc(firestore, "users", userId);

        setDoc(usersCollectionRef, {
          userId: userId,
          username: username,
          email: email,
          phoneNumber: phoneNumber,
          createdAt: new Date(),
        })
          .then(() => {
            Alert.alert("Registered!", `Welcome, ${user.email}!`);
            setLoading(false);
            navigation.navigate("Login");
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
            Alert.alert("Registration failed", error.message);
            setLoading(false);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Registration failed", errorMessage);
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Register</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCompleteType="email"
          />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            autoCompleteType="username"
          />
          <TextInput
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            keyboardType="phone-pad"
            autoCompleteType="tel"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            autoCompleteType="password"
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            autoCompleteType="password"
          />
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loading ? "#ccc" : "#ff4500" },
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkTextClickable}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    justifyContent: "center",
  },
  titleContainer: {
    position: "absolute",
    top: 40, // Adjust as needed
    left: 0,
    right: 280,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 17,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 17,
    textAlignVertical: "top",
  },
  button: {
    padding: 15,
    backgroundColor: "#ff4500",
    borderRadius: 999,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: "gray",
  },
  linkTextClickable: {
    fontSize: 16,
    color: "#ff4500",
  },
});

export default Register;
