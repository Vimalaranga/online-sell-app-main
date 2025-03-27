import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MaterialIcons, Feather, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [pdescription, setPdescription] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setProfilePic(userDoc.data().profilePic);
          setPdescription(userDoc.data().pdescription);
        }
      }
    });
    return unsubscribe;
  }, []);

  const menuItems = [
    { id: 1, name: "My Ads", icon: "campaign", path: "my-products" },
    { id: 2, name: "Favorites", icon: "favorite", path: "favorites" },
    { id: 3, name: "Settings", icon: "settings", path: "settings" },
    { id: 4, name: "Edit Profile", icon: "edit", path: "editprofile" },
    { id: 5, name: "Contact Us", icon: "support-agent", path: "contact" },
    { id: 6, name: "About", icon: "info", path: "about" },
  ];

  const handleMenuPress = (item) => {
    item?.path && navigation.navigate(item.path);
  };

  const handleLogout = () => {
    // Implement logout logic
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Feather name="settings" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.profileSection}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Feather name="user" size={32} color="#fff" />
            </View>
          )}
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.bio}>{pdescription || "No description provided"}</Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="whatsapp" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="instagram" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="facebook-square" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>89</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      {/* Menu Items */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.menuItem}
            // onPress={() => handleMenuPress(item)}
          >
            <MaterialIcons name={item.icon} size={24} color="#FF6B6B" />
            <Text style={styles.menuText}>{item.name}</Text>
            <Feather name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#FF6B6B",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ff8c8c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 15,
  },
  bio: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    opacity: 0.9,
  },
  socialContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  socialButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 30,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;