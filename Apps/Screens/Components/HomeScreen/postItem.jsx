import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function PostItem({ item }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="flex-1 m-2 p-2 rounded-lg border-[1px]
          border-slate-200 bg-gray-50"
      onPress={() =>
        navigation.push("productdetail", {
          product: item,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        className="w-full 
            h-[140px] rounded-lg"
      />
      <View className="mt-1">
        <Text className="text-gray-400 mt-1 p-[1px] ">{item.category}</Text>
        <Text className="text-[15px] font-semibold mt-1 p-[1px]">
          {item.title}
        </Text>
        <Text className="text-[15px] font-bold text-red-500">
          Rs {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
