import { Stack } from 'expo-router'
import React from 'react'

const HomeStacklayout = () => {
  return (
   <Stack screenOptions={{
    headerShown:false
   }}>
        <Stack.Screen name='index'/>
        <Stack.Screen name='notifications'/>
        <Stack.Screen name='jobs'/>
        <Stack.Screen name='[jobid]'/>
   </Stack>
  )
}

export default HomeStacklayout
