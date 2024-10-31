import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { useAppDispatch } from '@/kazisrc/store/store';
import { SearchHeader } from '@/kazisrc/components/Headers';

const SearchStackLayout = () => {
  
  // async function  searchUsers(params:type) {
    
  // }

  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(jobs)' />
        <Stack.Screen name='(people)' />
    </Stack>
  )
}

export default SearchStackLayout
