import React, { useState } from 'react'
import { Stack } from 'expo-router'
import { SearchHeader } from '@/kazisrc/components/Headers';
import { useAppDispatch } from '@/kazisrc/store/store';
import { setSearchJSQuery } from '@/kazisrc/store/slices/jobsSlice';
import { useSelector } from 'react-redux';

const SearchStackLayout = () => {
  const dispatch = useAppDispatch();
  const {searchJSQuery,searchJSTerm} = useSelector((state:any)=>state.jobs)

  return (
    <Stack screenOptions={{headerShown:true}}>
        <Stack.Screen
        options={{
          header : ()=> 
          <SearchHeader
          searchQuery={searchJSQuery}
          setSearchQuery={(val:any)=>dispatch(setSearchJSQuery(val))} 
          cacheKey ={'jobs_search'}
          searchEndpoint = {`/job-posts/?searchTerm=${searchJSTerm}&search=${searchJSQuery}`}
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
