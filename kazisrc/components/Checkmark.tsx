import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface CheckmarkProps {
  tier ?: string;
  size ?: number;
  issuperuser?:boolean;
  color ?: string;
  checkStyles?: StyleProp<ViewStyle>;
}

export function Checkmark ({
    size=24,tier='',color='gray',issuperuser=false,
    checkStyles}:CheckmarkProps){

    const showverified = tier ? true :false

    if(!showverified){
      return null
    }

    return(
     <MaterialIcons name="verified"
       style={[
        issuperuser && {color:'gray'},
        tier == 'tier_one' && {color:'orange'},
        tier == 'tier_two' && {color:'#448EE4'},
        tier == 'tier_three' && {color:'rgba(0,105,0.1)'},
        checkStyles
       ]}
     color={color} 
     size={size} />
    )
  
}