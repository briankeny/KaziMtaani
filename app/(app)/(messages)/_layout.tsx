import { useSelector } from '@/kazisrc/store/store';
import { Redirect, Stack } from 'expo-router'
import React, { useEffect } from 'react'

const StackLayout = () => {
  const { theme } = useSelector((state: any) => state.theme);
 
  const {authentication}  = useSelector((state:any)=>state.auth)
   
  useEffect(()=>{
    !authentication && <Redirect href="/"/>
  },[authentication])
   

  return (
   <Stack screenOptions={{
    headerShown:true,
    headerStyle:{
      backgroundColor:theme.card
    },
    headerTintColor :theme.text,
    headerTitleStyle:{
      color: theme.text,
      fontSize: 18,
      fontFamily:'Poppins-Regular'
    },
    headerTitleAlign: 'center'

    
   }}>
        <Stack.Screen 
        options={{
          title:'Messages',

        }}
        name='index'/>
        <Stack.Screen name='conversation'/>
   </Stack>
  )
}

export default StackLayout
