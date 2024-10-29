import { HomeHeader } from '@/kazisrc/components/Headers';
import { useGetResourceMutation } from '@/kazisrc/store/services/authApi';
import { setNewNotifications } from '@/kazisrc/store/slices/notificationSlice';
import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import { Stack } from 'expo-router'
import React, { useEffect } from 'react'

const HomeStacklayout = () => {
  const dispatch = useAppDispatch()
  const { theme } = useSelector((state: any) => state.theme);
  const [getData, { isLoading,isError,error,isSuccess}] = useGetResourceMutation();
  // const { userData,authentication } = useSelector((state: any) => state.auth);

  async function fetchNewNotifications(){
    try{
      const resp =  await getData({endpoint:`/notifications/?search=False&searchTerm=read_status`}).unwrap()
      const data = resp?.count ? resp.count : 0
      dispatch(setNewNotifications(data))
    }
    catch(error){
    }
  } 


  useEffect(()=>{
    fetchNewNotifications()
  },[])

  return (
   <Stack screenOptions={{
    headerShown:true,

    headerStyle:{
      backgroundColor:theme.card
    },
    headerTitleStyle:{
      color: theme.text,
      fontSize: 12
    }
  
   }}>
        <Stack.Screen 
        options={{
          header: () => <HomeHeader />,
        }}
        name='index'/>
        <Stack.Screen name='notifications'/>
        <Stack.Screen name='job-applications'/>
   </Stack>
  )
}

export default HomeStacklayout
