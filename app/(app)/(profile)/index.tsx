import { logo } from '@/kazisrc/images/images';
import { globalstyles } from '@/kazisrc/styles/styles';
import React from 'react'
import { SafeAreaView, View,Image,Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function UserProfileScreen () {
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { userData } = useSelector((state: any) => state.auth);

  return (
    <SafeAreaView
    style={[globalstyles.safeArea, { backgroundColor: theme.background}]}
  >
    <View style={{
    width:200,
    height:200,
    marginVertical:10,
    overflow:'hidden',
    borderRadius:100,
    backgroundColor:'orange',
      alignSelf:'center'
    }}>
        <Image 
        style={{width:200,height:200,borderRadius:100,objectFit:'contain'}}
         source={logo}
        />
    </View>

    <View>
      <Text 
      style={{
        color:theme.text,
        fontFamily:'Poppins-Bold',
        fontSize:23,
        textAlign:'center'
      }}
      >
          {userData.full_name}
      </Text>
      <Text 
      style={{
        color:'#999',
        fontFamily:'Poppins-Regular',
        fontSize:12,
        textAlign:'center'
      }}
      >
        @{userData.username}
      </Text>
    </View>

    <View style={[globalstyles.card,{backgroundColor:theme.card,elevation:2}]}>
        <Text style={{
          color:theme.text,
          fontFamily:'Poppins-Bold',
          fontSize:17
        }}>
          Bio
        </Text>

        <Text>
          {userData.bio}
        </Text>
    </View>

    </SafeAreaView>
  )
}

