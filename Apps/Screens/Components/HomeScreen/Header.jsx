import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View>
      <View className="flex flex-row items-center gap-2">
        <Image
          source={require("./../../../../assets/images/profilepic.jpg")}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text className="font-bold text-[13px]">Welcome !</Text>
          {/* <Text>user name</Text> */}
        </View>
      </View>
      <View
        className="p-[10px] px-5 flex flex-row 
      items-center bg-gray-100 mt-5 rounded-full
      border-[1px] border-blue-400"
      >
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          placeholder="Search"
          className="ml-2 text-[18px]"
          onChangeText={(value) => console.log(value)}
        />
      </View>
    </View>
  );
}
