import { Redirect, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const StackLayout = () => {
  const {theme} = useSelector((state:any)=>state.theme)
  const {authentication}  = useSelector((state:any)=>state.auth)
  
  useEffect(()=>{
    !authentication && <Redirect href="/signin"/>
  },[authentication])

  return (
    <Stack screenOptions={{
      headerShown:true,
      headerStyle:{
        backgroundColor:theme.card,
      },
      headerTitleAlign:'center',
      headerTintColor:theme.text,
      headerTitleStyle:{
        color: theme.text,
        fontWeight:'600',
        fontSize: 21
      }
    }}>
        <Stack.Screen options={{title:'My Profile'}} name='index'/>
        <Stack.Screen options={{title:'Edit Profile'}} name='edit'/>
        <Stack.Screen options={{title:'Add Info'}} name='add-section'/>
        <Stack.Screen options={{title:'Edit Info'}} name='edit-section'/>
        <Stack.Screen options={{title:'My Skills'}} name='edit-skill'/>
    </Stack>
  )
}

export default StackLayout
