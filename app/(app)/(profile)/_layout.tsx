import { Stack } from 'expo-router'
import React from 'react'

const StackLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='edit'/>
    </Stack>
  )
}

export default StackLayout
