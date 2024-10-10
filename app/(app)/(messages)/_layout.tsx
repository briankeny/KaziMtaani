import { Stack } from 'expo-router'
import React from 'react'

const MessageStacklayout = () => {
  return (
   <Stack>
        <Stack.Screen name='allchats'/>
        <Stack.Screen name='[chatid]'/>
   </Stack>
  )
}

export default MessageStacklayout
