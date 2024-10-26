import React from "react";
import { logo } from "../images/images";
import { globalstyles } from "../styles/styles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView, View, Image, Text, TouchableOpacity, StatusBar } from "react-native";
import { useSelector } from "react-redux";

export function SignupHeader() {
  const steps = [
    { title: `Step 1` },
    { title: `Step 2` },
    { title: `Step 3` },
    { title: `Final` },
  ];
  const [index, setIndex] = useState(1);
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  return (
    <SafeAreaView style={[{ backgroundColor:theme.background,borderWidth:0.2,
      borderBottomLeftRadius:10,
      borderBottomEndRadius:10,
    borderColor:'#999'}]}>
      <View
        style={{
          width: "100%",
          height: 300,
          overflow: "hidden",
        }}
      >
        <Image
          style={{ width: "100%", resizeMode: "center", height: "100%" }}
          source={logo}
        />
      </View>

      <View style={[globalstyles.rowEven, { marginVertical: 8 }]}>
        {steps.map((step: any, i: number) => (
          <View key={i} style={[globalstyles.column]}>
            <Text
              style={{
                color: i + 1 <= index ? "#0080ff" : theme.text,
                fontWeight: "500",
              }}
            >
              {step.title}
            </Text>
            <AntDesign
              name={i + 1 <= index ? "rightcircle" : "rightcircleo"}
              size={20}
              color={i + 1 <= index ? "#0080ff" : theme.text}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}


export function HomeHeader(){
  const {theme} = useSelector((state:any)=>state.theme)  
  const {userData}= useSelector((state:any)=>state.auth)
  const {notific_count} = useSelector((state:any)=>state.notifications)        

  function goToScreen(screen:any){
    router.push(screen)
  }
  
  return(
      <SafeAreaView 
      style={[{
        marginTop:StatusBar.currentHeight, 
        height:45,
        paddingHorizontal:22,
        paddingVertical:10,
        borderBottomWidth:0.2,
        borderBottomColor:'#888'
        }]}>
        <View style={[globalstyles.rowWide]}>
        <View style={{
          height:60,
          width:60,
          borderRadius:30
        }}>
          
          { userData?.profile_picture ?
            <Image style={{height:60, width:60,borderRadius:30}} source={logo}/>
            :
            <CustomUserAvatar
            name={userData.full_name}
            />
          }
         
        </View>
        
            <TouchableOpacity  onPress={()=>goToScreen('/(app)/(home)/notifications')} 
            style={[{ height: 40}]}>
              <MaterialIcons name="notifications" size={28} color={'green'}/>
              {notific_count >0 &&
               <View style={[{width:14,height:14,backgroundColor:'red',
               borderRadius:7,top:0,position:'absolute'}]}>
                    <Text style={[{color:'#fff',fontSize:8,textAlign:'center'}]}>{notific_count}</Text>
               </View>
               }
            </TouchableOpacity>

        </View>
      </SafeAreaView>
  )
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