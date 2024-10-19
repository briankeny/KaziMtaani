import React from "react";
import { globalstyles } from "@/styles/styles";
import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { HomeMenuProps } from "@/types/types";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const HomeScreen = () => {
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData } = useSelector((state: any) => state.auth);


    function goToScreen(screen:any){
      router.replace(screen)
    }


  const Menu = ({
    Icon,
    onPress,
    iconSize = 24,
    iconColor = "#888",
    contentTextColor="#fff",
    headerTextColor='#fff',
    header = "",
    content = "",
    iconName = "",
    backColor = "",
  }: HomeMenuProps) => {
    const { theme, isNightMode } = useSelector((state: any) => state.theme);

    return (
      <TouchableOpacity
        style={[
          globalstyles.card,
          { width: "35%", margin: 4, elevation: 6 },
          { backgroundColor: backColor ? backColor : theme.card },
        ]}
        onPress={onPress}
      >
        <View style={[globalstyles.column, { paddingLeft: 5 }]}>
          <Text style={[{ color:contentTextColor,fontSize:16,fontWeight:600 }]}>
            {content}
          </Text>
          <Text style={[ { color:headerTextColor,fontSize:11,paddingVertical:5 }]}>
            {header}
          </Text>
        </View>

        <Icon
          style={[{ position: "absolute", right: 25, top:10 }]}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >

      <View style={[globalstyles.card,{elevation:2,backgroundColor:'rgb(0, 102, 51)',width:'80%'}]}>

            <Text style={[{color:theme.text}]}>
              Hi Brian
            </Text>

          <View style={[globalstyles.row,{alignSelf:'center',padding:10,gap:10}]}>
            <Text style={[{color:'#fff',fontSize:30,fontWeight:'600'}]}>300</Text>
            <Text style={[{color:'#fff',paddingTop:8}]}>Job posts</Text>
          </View>

        <View style={[globalstyles.rowEven]}>
          <View style={[globalstyles.row,{gap:20}]}>
            <Text style={[{color:'#fff'}]}>Open</Text>
            <Text style={[{color:'#fff',fontWeight:'600',fontSize:18}]}>{230}</Text>
          </View>

          <View style={[globalstyles.row,{gap:20}]}>
            <Text style={[{color:'#fff'}]}>Closed</Text>
            <Text style={[{color:'#fff',fontWeight:'600',fontSize:18}]}>{70}</Text>
          </View>
        </View>

      </View>


      <Text style={[{color:theme.text,fontWeight:'500',padding:20}]}>My Analytics</Text>
            
      <View style={[globalstyles.rowEven,{overflow:'hidden',flexWrap:'wrap',columnGap:2}]}>

       <Menu
              header="Profile visits"
              backColor='rgb(177, 137, 2)'
              content="360"
              iconColor="#fff"
              iconSize={21}
              iconName="users"
              Icon={FontAwesome}
              onPress={() => goToScreen("Transport")}
            />

            <Menu
              header="Impressions"
              backColor='rgb(255, 255, 255)'
              headerTextColor={'#444'}
              contentTextColor={'#222'}
              content="4000"
              iconColor={'red'}
              iconSize={28}
              iconName="users"
              Icon={FontAwesome}
              onPress={() => goToScreen("Transport")}
            />


            <Menu
              header="Search Appearance"
              backColor='rgb(106, 90, 205)'
              content="40"
              iconColor="#fff"
              iconSize={21}
              iconName="search"
              Icon={MaterialIcons}
              onPress={() => goToScreen("Transport")}
            />

            <Menu
              header="Reviews"
              backColor='rgb(198, 131, 2)'
              content="4"
              iconColor="#fff"
              iconSize={28}
              iconName="emoji-transportation"
              Icon={MaterialIcons}
              onPress={() => goToScreen("Transport")}
            />
          </View>


    </SafeAreaView>
  );
};

export default HomeScreen;


export function JobList (){
  return( 
  <View>

  </View>
  )
}