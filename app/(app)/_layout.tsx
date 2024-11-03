import React, { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect,Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { TabBarIcon } from "@/kazisrc/components/navigation/TabBarIcon";

export default function TabLayout() {
  const { theme } = useSelector((state: any) => state.theme);
  const { authentication } = useSelector((state: any) => state.auth);
  
  useEffect(()=>{
    !authentication && <Redirect href="/(auth)"/>
  },[authentication])
   
  return (
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.card, // Tab bar background
            borderTopColor: "transparent", // Remove top border
            height: 60, // Height of tab bar
          },
          tabBarActiveTintColor: "orange", // Active tab icon color
          tabBarInactiveTintColor: theme.text, // Inactive tab icon color
          tabBarLabelStyle: {
            color: theme.text,
            fontSize: 12, // Font size of tab label
            paddingBottom: 5, // Space between label and bottom of tab bar
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={focused ? "orange" : theme.text}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(search)"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "search-sharp" : "search-outline"}
                color={focused ? "orange" : theme.text}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(messages)"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "mail" : "mail-outline"}
                color={focused ? "orange" : theme.text}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome
                name={focused ? "user" : "user-o"}
                size={24}
                color={focused ? "orange" : theme.text}
              />
            ),
          }}
        />
      </Tabs>
  );
}