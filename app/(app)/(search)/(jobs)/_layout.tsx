import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { SearchHeader } from '@/kazisrc/components/Headers';
import { useAppDispatch } from '@/kazisrc/store/store';

const SearchStackLayout = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState<string>('')
 
  return (
    <Stack screenOptions={{headerShown:true}}>
        <Stack.Screen
        options={{
          header : ()=> 
          <SearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} 
          cacheKey ={'jobs_search'}
          searchEndpoint = {'test'}
          />
        }}
        name='index' />
        <Stack.Screen name='job-profile' options={{
          headerShown:false
,          title:'Job Profile'
        }} />
    </Stack>
  )
}

export default SearchStackLayout
