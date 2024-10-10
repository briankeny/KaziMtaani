import { Stack } from 'expo-router'
import React from 'react'

const JobStacklayout = () => {
  return (
   <Stack>
        <Stack.Screen name='jobs'/>
        <Stack.Screen name='[jobid]'/>
   </Stack>
  )
}

export default JobStacklayout