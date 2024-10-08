import { Stack } from 'expo-router'
import React from 'react'

const  NotificationStackLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='allnots'/>
        <Stack.Screen name='[notid]'/>
    </Stack>
  )
}

export default NotificationStackLayout
