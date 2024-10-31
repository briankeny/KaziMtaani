import { Stack } from 'expo-router'
import React from 'react'
import { useSelector } from 'react-redux'

const StackLayout = () => {
  const {theme} = useSelector((state:any)=>state.theme)
  return (
    <Stack screenOptions={{
      headerShown:true,

      headerStyle:{
        backgroundColor:theme.card,
      },
      headerTitleAlign:'center',
      headerTitleStyle:{
        color: theme.text,
        fontWeight:'600',
        fontSize: 21
      }
    }}>
        <Stack.Screen options={{title:'My Profile'}} name='index'/>
        <Stack.Screen options={{title:'Edit Profile'}} name='edit'/>
    </Stack>
  )
}

export default StackLayout
