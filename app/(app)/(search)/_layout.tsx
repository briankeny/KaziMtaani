import React from 'react'
import { Stack } from 'expo-router'

const SearchStackLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='jobs' />
        <Stack.Screen name='jobs' />
        <Stack.Screen name='people' />
        <Stack.Screen name='[userid]' />
    </Stack>
  )
}

export default SearchStackLayout
