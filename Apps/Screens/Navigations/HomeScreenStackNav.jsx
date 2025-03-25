import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../HomeScreen";

import ItemList from "../ItemList";
import ProductDetail from "../ProductDetail";

const Stack = createStackNavigator();

export default function HomeScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="itemlist"
        component={ItemList}
        options={({ route }) => ({
          title: route.params.category,
          headerStyle: {
            backgroundColor: "#ff4500",
          },
          headerTintColor: "#fff",
        })}
      />

      <Stack.Screen
        name="productdetail"
        component={ProductDetail}
        options={{
          headerStyle: {
            backgroundColor: "#ff4500",
          },
          headerTintColor: "#fff",
          headerTitle: "Detail",
        }}
      />
    </Stack.Navigator>
  );
}
