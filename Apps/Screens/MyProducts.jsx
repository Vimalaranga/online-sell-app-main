import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth from firebase/auth
import { firestore, auth } from "./../../firebaseConfig"; // Ensure the correct import
import LatestItemList from "./Components/HomeScreen/LatestItemList";

export default function MyProducts() {
  const [userPosts, setUserPosts] = useState([]);

  const getUserPost = async () => {
    setUserPosts([]);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user is currently logged in.");
        return;
      }

      const q = query(
        collection(firestore, "userPost"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => doc.data());

      console.log("User Posts:", posts); // Log posts for debugging
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    getUserPost();
  }, []);

  return (
    <View className=" px-6 bg-white flex-1">
      <LatestItemList latestItemList={userPosts} />
    </View>
  );
}
