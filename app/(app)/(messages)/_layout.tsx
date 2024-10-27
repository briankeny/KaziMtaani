import { useSelector } from '@/kazisrc/store/store';
import { Stack } from 'expo-router'
import React from 'react'

const StackLayout = () => {
  const { theme } = useSelector((state: any) => state.theme);
  return (
   <Stack screenOptions={{
    headerShown:true,
    headerStyle:{
      backgroundColor:theme.card
    },
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
