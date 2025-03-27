import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("./../../../../assets/images/profilepic.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.userName}>Guest User</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          onChangeText={(value) => console.log(value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  welcomeText: {
    flexDirection: 'column',
  },
  welcomeTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
});