import React from 'react';
import {  Text, View, I18nManager, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { globalstyles } from '../styles/styles';
import { Entypo } from '@expo/vector-icons';


//  To toggle LTR/RTL uncomment the next line
I18nManager.allowRTL(true);

const ConversationRow = ({ item,handleRowPress,theme,participant,time}:any) => {
  return(
  <RectButton style={[globalstyles.row,{ flex: 1,height: 80,backgroundColor: theme.card}]}
   onPress={handleRowPress}>
    
    <View style={[{width:40,height:40, borderRadius:20, backgroundColor:theme.card}]}>
     {participant.profile_picture?
     <Image
           style={[{width:40,height:40, borderRadius:20,marginHorizontal:4}]}
          source={{uri:participant.profile_picture}}
          />
          :
          <Entypo  name='user' size={34} color={theme.text} />
      }
    </View>
    
    <View style={[globalstyles.column,{width:'80%'}]}>   
    <Text style={{color:theme.text,textAlign:'center'}}>
      {participant.first_name}
    </Text>
    <Text 
     numberOfLines={1}
     ellipsizeMode='tail'
    style={[{fontSize:11,color:'transparent',padding:4}]}>
      {item.message} 
    </Text> 
    </View>

    <View style={[globalstyles.columnEnd,{position:'absolute',bottom:5,right:10}]}>
       <Text style={[{color:theme.text,fontSize:12}]}>{time}</Text>
    </View>

  </RectButton>
)};

export default ConversationRow