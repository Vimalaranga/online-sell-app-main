import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function Categories({ categoryList }) {
  const navigation = useNavigation();

  return (
    <View className="mt-4 px-4">
      <Text className="text-xl font-semibold text-gray-800 mb-3">Categories</Text>
      <FlatList
        data={categoryList}
        numColumns={3}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("itemlist", { category: item.name })}
            className="flex-1 items-center justify-center p-3 m-2 
                      bg-white rounded-xl shadow-md shadow-blue-300"
          >
            <Image source={{ uri: item.icon }} className="w-12 h-12 mb-2" />
            <Text className="text-sm text-gray-700 font-medium">{item.name}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
