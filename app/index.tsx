import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Redirect, router } from 'expo-router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useColorScheme } from 'react-native'
import { useAppDispatch } from '@/kazisrc/store/store'
import { setTheme } from '@/kazisrc/store/slices/themeSlice'
import { requestUserLocation } from '@/kazisrc/utils/utils'
import { setMyLocation } from '@/kazisrc/store/slices/authSlice'

const Index = () => {
  const dispatch = useAppDispatch()
  const appearance = useColorScheme()
  const {authentication} = useSelector((state:any)=>state.auth)
  const { current_theme} =  useSelector((state:any) => state.theme)
  
  async function getUserLocation(){
    try{
      const location:any = await requestUserLocation();
      const {latitude,longitude} = location
      dispatch(setMyLocation({latitude:latitude,longitude:longitude}))
    }
    catch(error){
    }
  }
  

  // Inherit Theme if System Default is Enabled
  function prepareTheme(){
    if (current_theme == 'default'){
     dispatch(setTheme({selected:'default',appearance:appearance}))
    }
 }
  
 useEffect(()=>{
  prepareTheme()
  },[])

  useEffect(()=>{
    getUserLocation()
  },[])
 

  if (!authentication) {
  return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/(app)"/> 
}

export default Index