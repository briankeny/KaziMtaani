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
            header: ()=> 
            <SearchHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cacheKey ={'people_search'}
            searchEndpoint = {'people'}
            />
         
          }}
        
        name='index' />
        <Stack.Screen name='[userid]' />
    </Stack>
  )
}

export default SearchStackLayout
