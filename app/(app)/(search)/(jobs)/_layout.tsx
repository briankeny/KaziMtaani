import React from 'react'
import { Stack } from 'expo-router'

const SearchStackLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='[jobid]' />
    </Stack>
  )
}

export default SearchStackLayout
