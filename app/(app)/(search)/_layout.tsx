import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { useAppDispatch } from '@/kazisrc/store/store';
import { SearchHeader } from '@/kazisrc/components/Headers';

const SearchStackLayout = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState<string>('')
 
  // async function  searchUsers(params:type) {
    
  // }

  return (
    <Stack screenOptions={{headerShown:true}}>
        <Stack.Screen name='index' />
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
        name='(jobs)' />
        <Stack.Screen 
        options={{
          header: ()=> 
          <SearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cacheKey ={'people_search'}
          searchEndpoint = {'people'}
          />
       
        }}
        name='(people)' />
    </Stack>
  )
}

export default SearchStackLayout
