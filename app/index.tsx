import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Redirect } from 'expo-router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useColorScheme } from 'react-native'
import { useAppDispatch } from '@/kazisrc/store/store'
import { setTheme } from '@/kazisrc/store/slices/themeSlice'

const Index = () => {
  const dispatch = useAppDispatch()
  const appearance = useColorScheme()
  const {authentication} = useSelector((state:any)=>state.auth)
  const { current_theme} =  useSelector((state:any) => state.theme)

  // Inherit Theme if System Default is Enabled
  function prepareTheme(){
    if (current_theme == 'default'){
     dispatch(setTheme({selected:'default',appearance:appearance}))
    }
 }

 useEffect(()=>{
 prepareTheme()
 },[])
  

  return authentication? <Redirect href="/(app)"/> :  <Redirect href="/signin"/> 
}

export default Index