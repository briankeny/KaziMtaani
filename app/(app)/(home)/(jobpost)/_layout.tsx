import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import React, { useEffect } from 'react'
import { Redirect, Stack  } from 'expo-router';

export default function AdminPostStackLayout (){
  const dispatch = useAppDispatch()
  const { theme } = useSelector((state: any) => state.theme);
  const { userData,authentication } = useSelector((state: any) => state.auth);
    
  useEffect(()=>{
    !authentication && <Redirect href="/(auth)"/>
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
        <Stack.Screen options={{title:'My Jobs'}} name='index'/>
        <Stack.Screen options={{title:'Job Applicants'}} name='applicants'/>
        <Stack.Screen options={{title:'Create Job Post'}} name='create-post'/>
   </Stack>
  )
}
