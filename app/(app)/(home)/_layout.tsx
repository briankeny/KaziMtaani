import { HomeHeader, MyDrawer } from '@/kazisrc/components/Headers';
import { useGetResourceMutation } from '@/kazisrc/store/services/authApi';
import { setNewNotifications } from '@/kazisrc/store/slices/notificationSlice';
import { useAppDispatch, useSelector } from '@/kazisrc/store/store';
import { Drawer } from 'expo-router/drawer'
import React, { useEffect } from 'react'
import { Redirect  } from 'expo-router';
import { setOnlineStatus } from '@/kazisrc/store/slices/authSlice';

const HomeDrawerlayout = () => {
  const dispatch = useAppDispatch()
  const { theme } = useSelector((state: any) => state.theme);
  const {authentication}  = useSelector((state:any)=>state.auth)
  const [getData, { isLoading,isError,error,isSuccess}] = useGetResourceMutation();
  // const { userData,authentication } = useSelector((state: any) => state.auth);

  async function fetchNewNotifications(){
    try{
      const resp =  await getData({endpoint:`/notifications/?search=False&searchTerm=read_status`}).unwrap()
      if(resp){
      dispatch(setOnlineStatus(true))
        const data = resp?.count ? resp.count : 0
      dispatch(setNewNotifications(data))
      }
    }
    catch(error){
    }
  } 

    
  useEffect(()=>{
    !authentication && <Redirect href="/(auth)"/>
  },[authentication])
   


  useEffect(()=>{
    fetchNewNotifications()
  },[])

  return (
   <Drawer 
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
   
   drawerContent={(props:any)=> <MyDrawer {...props}/>}
   >
        <Drawer.Screen 
        options={{
          
          header: (props:any) => <HomeHeader {...props} />,
          
        }}
        name='index'/>
        <Drawer.Screen options={{title:'Notifications'}} name='notifications'/>
        <Drawer.Screen options={{headerShown:false}} name='(jobapplications)'/>
        <Drawer.Screen options={{headerShown:false}} name='(jobpost)'/>
   </Drawer>
  )
}

export default HomeDrawerlayout
