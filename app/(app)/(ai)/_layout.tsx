import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import React, { useEffect } from 'react'
import { Redirect, router, Stack  } from 'expo-router';

export default function AIStackLayout (){
  const { theme } = useSelector((state: any) => state.theme);
  const { userData,authentication } = useSelector((state: any) => state.auth);
    
  useEffect(()=>{
    !authentication && router.push('/(auth)')
  },[authentication])
   
  return (
   <Stack 
   screenOptions={{
    headerShown:true,
    headerStyle:{
      backgroundColor:theme.card
    },
    headerTitleStyle:{
      color: theme.text,
      fontSize: 21
    },
    headerTintColor:theme.text,
    headerTitleAlign:'center'
   }}
   
   >
        <Stack.Screen options={{title:'Kazi AI'}} name='index'/>
   </Stack>
  )
}
