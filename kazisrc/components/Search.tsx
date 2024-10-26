import { globalstyles } from '../styles/styles';
import React from 'react'
import { SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';

const SearchPeople = () => {
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { userData } = useSelector((state: any) => state.auth);
  return (
    <SafeAreaView
    style={[globalstyles.safeArea, { backgroundColor: theme.background}]}
  >
    </SafeAreaView>
  )
}

export default SearchPeople
