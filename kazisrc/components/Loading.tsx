import React from 'react';
import { View, ActivityIndicator} from 'react-native';
import { useSelector } from 'react-redux';
import { globalstyles } from '../styles/styles';

interface LoadingProps {
  containerstyles?: object;
  indicator_color?: string;
}

export const Loading: React.FC<LoadingProps> = ({ containerstyles = {},indicator_color='green' }) => {
  const {theme} = useSelector((state:any)=> state.theme)
  return (
    <View style={[globalstyles.columnCenter, { backgroundColor:theme.background }, containerstyles]}>
      <ActivityIndicator size="large" color={indicator_color} />
    </View>
  );
};













