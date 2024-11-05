import React, { useEffect } from 'react'
import { Redirect, Stack } from 'expo-router'
import { useSelector } from '@/kazisrc/store/store';

const SearchStackLayout = () => {
  const {authentication}  = useSelector((state:any)=>state.auth)
  useEffect(()=>{
    !authentication && <Redirect href="/"/>
  },[authentication])

  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(jobs)' />
        <Stack.Screen name='(people)' />
    </Stack>
  )
}

export default SearchStackLayout
