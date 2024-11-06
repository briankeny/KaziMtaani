import React, { useEffect } from 'react'
import { Redirect, Stack } from 'expo-router'
import { useSelector } from '@/kazisrc/store/store';

const SearchStackLayout = () => {
  const {authentication}  = useSelector((state:any)=>state.auth)
  const {theme} = useSelector((state:any)=>state.theme)
  useEffect(()=>{
    !authentication && <Redirect href="/"/>
  },[authentication])

  return (
    <Stack  screenOptions={{
      headerShown:false,
      headerStyle:{
        backgroundColor:theme.card,
      },
      headerTintColor :theme.text,
      headerTitleStyle:{
        color: theme.text,
        fontSize: 18,
        fontFamily:'Poppins-Bold'
      },
      headerTitleAlign: 'center'
  
      
     }}>
        <Stack.Screen 
        options={{
          headerShown:true,
          headerTitleStyle:{color:theme.text, fontFamily:'Poppins-Bold'},
          title:'What Are You Looking For ?'
        }}
        name='index' />
        <Stack.Screen name='(jobs)' />
        <Stack.Screen name='(people)' />
    </Stack>
  )
}

export default SearchStackLayout
