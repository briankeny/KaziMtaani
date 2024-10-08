import { Stack } from 'expo-router'
import React from 'react'

const PeopleStackLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='allusers'/>
        <Stack.Screen name='[userid]'/>
    </Stack>
  )
}

export default PeopleStackLayout
