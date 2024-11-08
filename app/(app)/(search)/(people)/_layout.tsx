import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { SearchHeader } from '@/kazisrc/components/Headers';
import { useAppDispatch } from '@/kazisrc/store/store';
import { useSelector } from 'react-redux';
import { setPeopleSQuery, setPeopleSTerm } from '@/kazisrc/store/slices/peopleSlice';

const SearchStackLayout = () => {
  const dispatch = useAppDispatch();
  const {searchPeopleSQuery,searchPeopleSTerm} = useSelector((state:any)=>state.people)
  const {theme} = useSelector((state:any)=>state.theme)
  useEffect(()=>{
    dispatch(setPeopleSTerm('full_name'))
  },[])

  return (
    <Stack screenOptions={{headerShown:true,
      headerStyle:{
        backgroundColor:theme.card
      },
      headerTitleStyle:{
        color: theme.text,
        fontSize: 21
      },
      headerTintColor:theme.text,
      headerTitleAlign:'center'
    }}>
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
         options={{headerShown:true , title:'User Account'}} 
        name='user-profile' />
    </Stack>
  )
}

export default SearchStackLayout
