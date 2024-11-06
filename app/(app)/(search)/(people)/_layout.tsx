import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { SearchHeader } from '@/kazisrc/components/Headers';
import { useAppDispatch } from '@/kazisrc/store/store';
import { useSelector } from 'react-redux';
import { setPeopleSQuery, setPeopleSTerm } from '@/kazisrc/store/slices/peopleSlice';

const SearchStackLayout = () => {
  const dispatch = useAppDispatch();
  const {searchPeopleSQuery,searchPeopleSTerm} = useSelector((state:any)=>state.people)
  
  useEffect(()=>{
    dispatch(setPeopleSTerm('full_name'))
  },[])

  return (
    <Stack screenOptions={{headerShown:true}}>
        <Stack.Screen
          options={{
            header: ()=> 
            <SearchHeader
            searchQuery={searchPeopleSQuery}
            setSearchQuery={(val:any)=>dispatch(setPeopleSQuery(val))}
            cacheKey ={'people_search'}
            searchEndpoint = {`/users/?searchTerm=${searchPeopleSTerm}&search=${searchPeopleSQuery}`}
            />
         
          }}
        
        name='index' />
        <Stack.Screen
         options={{headerShown:false}} 
        name='user-profile' />
    </Stack>
  )
}

export default SearchStackLayout
