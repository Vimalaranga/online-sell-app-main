import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import ShoppingIcon from "./../../../assets/images/shopping-online.png";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Logged in!", `Welcome back, ${user.email}!`);
        setLoading(false);
        navigation.navigate("TabNavigation");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Login failed", errorMessage);
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
          <Text style={styles.title}>Login</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={ShoppingIcon} style={styles.icon} />
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            autoCompleteType="password"
          />
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loading ? "#ccc" : "#ff4500" },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkTextClickable}>Register</Text>
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
    marginTop: 40,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    width: 180,
    height: 180,
    marginTop: 70,
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

export default Login;
