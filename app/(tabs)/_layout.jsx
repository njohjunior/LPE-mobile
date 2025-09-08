import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import "../../global.css";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5B2333",
        tabBarStyle: {
            backgroundColor: "#F7F4F3",
            height: 90,
            paddingTop: 10,
        },
        tabBarLabelStyle: {
            fontSize: 14,
            fontFamily: 'poppins',
            fontWeight: 700,
        }
      }}
      
    >
      <Tabs.Screen
        name="course"
        options={{
          title: "Course",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Suivi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: "#5B2333",
            color: "#fff"
          }
        }}
      />
    </Tabs>
  );
}
