import React from 'react'
import { Stack } from 'expo-router'

const SearchStackLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='jobs' />
        <Stack.Screen name='people' />
    </Stack>
  )
}

export default SearchStackLayout
