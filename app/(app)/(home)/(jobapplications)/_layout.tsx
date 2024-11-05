import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import React, { useEffect } from 'react'
import { Redirect, Stack  } from 'expo-router';

const ApplicationStacklayout = () => {
  const dispatch = useAppDispatch()
  const { theme } = useSelector((state: any) => state.theme);
  const { userData,authentication } = useSelector((state: any) => state.auth);
    
  useEffect(()=>{
    !authentication && <Redirect href="/"/>
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
        <Stack.Screen options={{title:'My Job Applications'}} name='index'/>
        <Stack.Screen options={{title:'Create Review'}} name='create-review'/>
        <Stack.Screen options={{title:'My Reviews'}} name='my-reviews'/>
        <Stack.Screen options={{title:'Job Tracker'}} name='tracker'/>
   </Stack>
  )
}

export default ApplicationStacklayout
