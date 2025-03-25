import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AntDesign } from "@expo/vector-icons";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setProfilePic(userDoc.data().profilePic || null);
        }
      }
    });
    return unsubscribe;
  }, []);

  const pickImage = async () => {
    // Request permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePic(downloadURL);
      await updateDoc(doc(db, "users", user.uid), { profilePic: downloadURL });
    }
  };

  return (
    <View className="p-5">
      <View className="items-center mt-14">
        {profilePic ? (
          <Image
            source={{ uri: profilePic }}
            className="w-[100px] h-[100px] rounded-full"
          />
        ) : (
          <View />
        )}
        <TouchableOpacity
          className="absolute bottom-0 right-[140px] bg-gray-300 p-1.5 rounded-full"
          onPress={pickImage}
        >
          <AntDesign name="edit" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <Text
        className="text-black text-[25px] font-bold text-center
      mt-3"
      >
        {username}
      </Text>
    </View>
  );
};

export default EditProfile;
