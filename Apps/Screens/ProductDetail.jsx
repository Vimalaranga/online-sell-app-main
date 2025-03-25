import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

export default function ProductDetail({ navigation }) {
  const { params } = useRoute();
  const [product, setProduct] = useState({});
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (params) {
      setProduct(params.product);
      fetchUserName(params.product.userId);
    }
    shareButton();
  }, [params, navigation]);

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Entypo
          name="share"
          size={24}
          onPress={() => shareProduct()}
          color="white"
          style={{ marginRight: 15 }}
        />
      ),
    });
  };

  const shareProduct = () => {
    const content = {
      message: product?.title + "\n" + product?.desc,
    };
    Share.share(content).then(
      (resp) => {
        console.log(resp);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const fetchUserName = async (userId) => {
    if (userId) {
      const userRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.username);
        setPhoneNumber(userData.phoneNumber);
      } else {
        console.log("No such user!");
      }
    }
  };
  const handleCallPress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.log("Phone number not available");
    }
  };

  return (
    <ScrollView>
      <Image source={{ uri: product.image }} className="h-[320px] w-full" />

      <View className="p-3">
        <Text className="text-[20px] font-bold">{product?.title}</Text>
        <View className="flex-row">
          <Text
            style=""
            className="text-[17px] m-1
        text-customOrange-600 font-extrabold text-orange-600"
          >
            Rs {product?.price}
          </Text>
        </View>

        <View className="items-baseline">
          <Text className="mt-1 p-1 px-2 text-orange-600 bg-orange-200 rounded-full">
            {product?.category}
          </Text>
        </View>

        <View className="items-baseline flex-row">
          <Text className="mt-2 text-[15px] text-gray-500">Posted by: </Text>
          <TouchableOpacity>
            <Text className="mt-2 text-[17px] text-orange-600 font-semibold">
              {userName}
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-3 font-semibold text-[18px]">Description</Text>
        <Text className="text-[17px] text-gray-500">{product?.desc}</Text>
      </View>

      <View className="flex-row mt-3 mb-3">
        <TouchableOpacity
          className="p-[15px] z-40 bg-orange-500 w-[320px] rounded-md ml-2 "
          onPress={handleCallPress}
        >
          <Text className="text-center text-white text-[17px] font-semibold ">
            Call Now
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-[15px] z-40 bg-orange-600 w-[55px] rounded-md ml-2">
          <Ionicons name="chatbubble" size={24} color="orange" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
