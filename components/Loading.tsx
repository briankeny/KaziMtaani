import React from 'react';
import { View, ActivityIndicator} from 'react-native';
import { globalstyles } from '../styles/styles';
import { useSelector } from 'react-redux';

interface LoadingProps {
  containerstyles?: object;
  indicator_color?: string;
}

const Loading: React.FC<LoadingProps> = ({ containerstyles = {},indicator_color='green' }) => {
  const {theme} = useSelector((state:any)=> state.theme)
  return (
    <View style={[globalstyles.columnCenter, { backgroundColor:theme.background }, containerstyles]}>
      <ActivityIndicator size="large" color={indicator_color} />
    </View>
  );
};

export default Loading;












