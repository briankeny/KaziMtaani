import { Stack } from 'expo-router'
import React from 'react'

export default function StackLayout  () {
  return (
    <Stack
      screenOptions={{
        headerShown:false
      }}
    >
        
       <Stack.Screen
        name="signin"
      
      />
      <Stack.Screen
        name="signup"
       
      />
    </Stack>
  )
}

