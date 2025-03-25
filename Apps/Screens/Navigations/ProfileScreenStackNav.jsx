import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../ProfileScreen";
import MyProducts from "../MyProducts";
import ProductDetail from "../ProductDetail";
import EditProfile from "../EditProfile";

const Stack = createStackNavigator();
export default function ProfileScreenStackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile-tab"
        options={{
          headerShown: false,
        }}
        component={ProfileScreen}
      />
      <Stack.Screen
        name="my-products"
        component={MyProducts}
        options={{
          headerStyle: {
            backgroundColor: "#ff4500",
          },
          headerTintColor: "#fff",
          headerTitle: "My Ads",
        }}
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
      <Stack.Screen
        name="editprofile"
        component={EditProfile}
        options={{
          headerStyle: {
            backgroundColor: "#ff4500",
          },
          headerTintColor: "#fff",
          headerTitle: "Edit Profile",
        }}
      />
    </Stack.Navigator>
  );
}
