import { SignupHeader } from '@/kazisrc/components/Headers'
import { Redirect, Stack } from 'expo-router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Authlayout = () => {
  const { theme } = useSelector((state: any) => state.theme);
  // const {authentication}  = useSelector((state:any)=>state.auth)
   
  // useEffect(()=>{
  //   authentication && <Redirect href="/(app)"/>
  // },[authentication])
  
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
    <Stack.Screen
     name='index'
     options={{headerShown:false}}
    />
    <Stack.Screen 
    options={{title:'Password Reset'}}
    name="password-reset" />
    <Stack.Screen 
    options={{title:'OTP Verification'}}
    name="password-reset-otp" />
    <Stack.Screen 
    options={{title:'Reset Password'}}
    name="password-reset-verify" />
    
    <Stack.Screen 
    options={{ header:()=> <SignupHeader/>}}
    name="signup-phone-auth" />
    <Stack.Screen 
    options={{ header:()=> <SignupHeader/>}}
    name="signup-otp-verify" />
    <Stack.Screen
    options={{ header:()=> <SignupHeader/>}}
    name="signup-account-setup" />

    
  
    </Stack>
  )
}

export default Authlayout
