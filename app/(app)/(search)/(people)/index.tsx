import { useGetResourceMutation } from "@/kazisrc/store/services/authApi";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import React from "react";
import { SafeAreaView, TouchableOpacity, Text, View,Image } from "react-native";
import { useSelector } from "react-redux";

export default function  PeopleScreen () {
    const dispatch = useAppDispatch();
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector((state: any) => state.modal);
    const {authError} = useSelector((state: any) => state.auth);    
    const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
   
    return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>

      
  </SafeAreaView>
  )
}


export function PeopleCard({theme,person}:any){

  return( 
  <TouchableOpacity style={{backgroundColor:theme.card}}>
      
      <View style={{
          height:60,
          width:60,
          borderRadius:30
        }}>
          
          { person?.profile_picture ?
            <Image style={{height:60, width:60,borderRadius:30}} source={{uri:person.profile_picture}}/>
            :
            <CustomUserAvatar
            name={person.full_name}
            />
          }
         
        </View>
        
        <View>
            <Text
              style={{
                fontWeight: "500",
                paddingVertical: 2,
                color: theme.text,
              }}
            >
              {person?.full_name}
            </Text>
            <Text style={{ color: "#888", fontSize: 10 }}>
              {person.username}
            </Text>
          </View>

      
  </TouchableOpacity>)
}




export function CustomUserAvatar({name}:{name:string}){
  return(
    <View style={[globalstyles.columnCenter,
      {width:30,height:30, 
      borderRadius:15,overflow:'hidden',
      backgroundColor:'rgb(255,123,23)'}]}>
        <Text style={[
        {fontFamily:'Poppins-ExtraBold',fontSize:20,color:'#fff',textAlign:'center'}]}>
        {name.slice(0,1)}
        </Text>
    </View>
  )
}
