import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Tabs } from "expo-router";

export default function TabLayout() {

    return (
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
    
      </Tabs>
    );
  }