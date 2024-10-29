import React from "react";
import { logo } from "../images/images";
import { globalstyles } from "../styles/styles";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { useGetResourceMutation } from "../store/services/authApi";
import { HelloWave } from "./HelloWave";

export function SignupHeader() {
  const steps = [
    { title: `Step 1` },
    { title: `Step 2` },
    { title: `Step 3` },
    { title: `Final` },
  ];
  const {authscreen_index} = useSelector((state:any)=>state.auth)
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: theme.background,
          borderWidth: 0.2,
          borderBottomLeftRadius: 10,
          borderBottomEndRadius: 10,
          borderColor: "#999",
        },
      ]}
    >
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
                color: i + 1 <= authscreen_index? "#0080ff" : theme.text,
                fontWeight: "500",
              }}
            >
              {step.title}
            </Text>
            <AntDesign
              name={i + 1 <= authscreen_index ? "rightcircle" : "rightcircleo"}
              size={20}
              color={i + 1 <= authscreen_index ? "#0080ff" : theme.text}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

export function HomeHeader() {
  const { theme } = useSelector((state: any) => state.theme);
  const { userData } = useSelector((state: any) => state.auth);
  const { notific_count } = useSelector((state: any) => state.notifications);

  function goToScreen(screen: any) {
    router.push(screen);
  }

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor:theme.card,
          paddingTop: StatusBar.currentHeight,
          height: 100,
          overflow:'hidden',
        },
      ]}
    >
           
      <View style={[globalstyles.row,{
        gap:10,
           position:'absolute',
           left:10, 
           bottom:25
        }]}>
            <Text  style={[{
              color:'#777',
              fontSize:18,
              fontFamily:'Poppins-Bold',
          
            }]}>
            Hi  
            </Text>    
            <HelloWave
               helloStyle = {{paddingHorizontal:1}}
               helloStyleText = { {
                fontSize: 15,
                lineHeight:18,
              }}
            />     
        </View>


     

        <View style={[globalstyles.row,{
          alignSelf:'center',
          gap:5,
          paddingTop:20}]}>
            <Text style={{color:'green',
              alignSelf:'flex-start',
              fontFamily:'Poppins-Bold',fontSize:20}}>
              Kazi
            </Text>
            <Text style={{color:'orange',
              alignSelf:'flex-end',
              fontFamily:'Poppins-Bold',fontSize:20}} >
              Mtaani
            </Text>
        </View>

        <View
          style={{
            backgroundColor:'red',
            height: 30,
            position:'absolute',
            right:10, 
            marginBottom:8,
            bottom:15,
            width: 30,
            overflow:'hidden',
            borderRadius: 15,
          }}
        >
          {userData?.profile_picture ? (
            <Image
              style={{ 
                resizeMode:'center',
                height: 30, width: 30, borderRadius: 15 }}
              source={{uri:userData.profile_picture}}
            />
          ) : (
            <CustomUserAvatar name={userData.full_name} />
          )}
        </View>


        <TouchableOpacity
          onPress={() => goToScreen("/(app)/(home)/notifications")}
          style={[{ 
            position:'absolute',
            right:60, bottom:15,
            height:40,paddingTop:5}]}
        >
          <Ionicons name={notific_count > 0  ? 'notifications-sharp': 'notifications-outline'} size={28} color={theme.text} />
          {notific_count > 0 && (
            <View
              style={[
                {
                  width: 14,
                  height: 14,
                  backgroundColor: "red",
                  borderRadius: 7,
                  top: 0,
                  position: "absolute",
                },
              ]}
            >
              <Text
                style={[{ color: "#fff", fontSize: 8, textAlign: "center" }]}
              >
                {notific_count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      
    </SafeAreaView>
  );
}

export function CustomUserAvatar({ name }: { name: string }) {
  return (
    <View
      style={[
        globalstyles.columnCenter,
        {
          width: 30,
          height: 30,
          borderRadius: 15,
          overflow: "hidden",
          backgroundColor: "rgb(255,123,23)",
        },
      ]}
    >
      <Text
        style={[
          {
            fontFamily: "Poppins-ExtraBold",
            fontSize: 20,
            color: "#fff",
            textAlign: "center",
          },
        ]}
      >
        {name.slice(0, 1)}
      </Text>
    </View>
  );
}

export function SearchHeader({
  cacheKey,
  searchEndpoint,
  searchQuery,
  setSearchQuery,
}: any) {
  const { theme } = useSelector((state: any) => state.theme);
  const [focused, setFocus] = useState<string>("");

  const [getData, { isLoading }] = useGetResourceMutation({
    fixedCacheKey: cacheKey,
  });

  async function searchFunction() {
    if (!isLoading) {
      try {
        await getData({ endpoint: searchEndpoint });
      } catch (err: any) {}
    }
  }

  return (
    <View
      style={[
        globalstyles.row,
        {
          width: "80%",
          height: 40,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 30,
          paddingHorizontal: 20,
        },
      ]}
    >
      <TextInput
        style={[
          {
            width: "80%",
            paddingLeft: 20,
            height: 33,
          },
          focused == "srch" && { borderWidth: 0.1, borderBottomColor: "green" },
        ]}
        value={searchQuery}
        onFocus={() => setFocus("srch")}
        onBlur={() => setFocus("")}
        placeholder={"Search here..."}
        placeholderTextColor={"#888"}
        onChangeText={(val) => setSearchQuery(val)}
      />

      <TouchableOpacity
        onPress={searchFunction}
        style={[{ width: 30, height: 40, padding: 5 }]}
      >
        <Ionicons name="search" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
}