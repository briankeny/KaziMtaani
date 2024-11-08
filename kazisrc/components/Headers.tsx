import React, { useEffect } from "react";
import { logo } from "../images/images";
import { globalstyles } from "../styles/styles";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
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
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import {
  useGetResourceMutation,
  usePostResourceMutation,
} from "../store/services/authApi";
import { useAppDispatch } from "../store/store";
import { setTheme } from "../store/slices/themeSlice";
import { setAuth } from "../store/slices/authSlice";
import { Checkmark } from "./Checkmark";
import { removeSpace } from "../utils/utils";

export function SignupHeader() {
  const steps = [{ title: `Step 1` }, { title: `Step 2` }, { title: `Final` }];
  const { authscreen_index } = useSelector((state: any) => state.auth);
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  return (
    <SafeAreaView
      style={[
        {
          paddingTop: StatusBar.currentHeight,
  
          backgroundColor: theme.background,
        },
      ]}
    >
      <View
        style={{
          width: "100%",
          height: 200,
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
                color: i + 1 <= authscreen_index ? "#448EE4" : theme.text,
                fontWeight: "500",
              }}
            >
              {step.title}
            </Text>
            <AntDesign
              name={i + 1 <= authscreen_index ? "rightcircle" : "rightcircleo"}
              size={20}
              color={i + 1 <= authscreen_index ? "#448EE4" : theme.text}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

export function HomeHeader(props: any) {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData } = useSelector((state: any) => state.auth);
  const { notific_count } = useSelector((state: any) => state.notifications);

  function goToScreen(screen: any) {
    router.push(screen);
  }

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: theme.card,
          paddingTop: StatusBar.currentHeight,
          height: 80,
          overflow: "hidden",
        },
      ]}
    >
      <View style={[globalstyles.rowWide,{padding:10}]}>
        <Pressable
          onPress={() => props?.navigation?.openDrawer()}
          style={{
            backgroundColor: "orange",
            height: 30,
            width: 30,
            overflow: "hidden",
            borderRadius: 15,
          }}
        >
          {userData?.profile_picture ? (
            <Image
              style={{
                resizeMode: "center",
                height: 30,
                width: 30,
                borderRadius: 15,
              }}
              source={{ uri: userData.profile_picture }}
            />
          ) : (
            <CustomUserAvatar name={userData.full_name} />
          )}
        </Pressable>

          
          <Text
            style={{
              color: "orange",
              textAlign:'center',
              fontFamily: "Poppins-Bold",
              fontSize: 20,
            }}
          ><Text
          style={{
            color: "green",

          }}
        >
          Kazi
        </Text>
            Mtaani
          </Text>

        <TouchableOpacity
          onPress={() => goToScreen("/(app)/(home)/notifications")}
          style={[
            {
              height: 40,
              paddingTop: 5,
            },
          ]}
        >
          <Ionicons
            name={
                "notifications-outline"
            }
            size={28}
            color={theme.text}
          />
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
      </View>
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
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
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

    useEffect(()=>{
      searchQuery && searchQuery.trim().replace(' ','').length > 0 &&  searchFunction()
    },[searchQuery])

  return (
    <SafeAreaView
      style={{
        paddingTop: StatusBar.currentHeight,
        // height: 100,
        backgroundColor: theme.card,
        overflow: "hidden",
      }}
    >
      <View
        style={[
          globalstyles.row,
          {
            width: "80%",
            height: 40,
            alignSelf: "center",
            marginVertical: 20,
            backgroundColor: isNightMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
            borderRadius: 30,
            paddingHorizontal: 20,
          },
        ]}
      >
        <TextInput
          style={[
            {
              width: "90%",
              color:theme.text,
              height: 40,
            },
            focused == "srch" && {
              borderWidth: 0.1,
              borderBottomColor: "green",
            },
          ]}
          value={searchQuery}
          onFocus={() => setFocus("srch")}
          onBlur={() => setFocus("")}
          placeholder={"Search here..."}
          placeholderTextColor={"#888"}
          onChangeText={setSearchQuery}
        />

        <TouchableOpacity
          onPress={searchFunction}
          style={[{ width: 40, height: 40, paddingTop: 10, paddingLeft: 5 }]}
        >
          <Ionicons name="search" size={21} color={theme.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface DrawerButtonRowProps {
  text?: string;
  theme: any;
  Icon?: any;
  action: () => void;
  icon_name?: string;
  icon_color?: string;
  icon_size?: number;
  destination: string;
  nightmode: boolean;
}

export function DrawerButtonRow({
  text,
  theme,
  Icon,
  icon_name,
  icon_size = 24,
  destination,
  icon_color,
  nightmode,
  action,
}: DrawerButtonRowProps) {
  return (
    <TouchableOpacity
      style={[
        globalstyles.row,
        { gap: 15, marginHorizontal: 30, marginVertical: 18 },
      ]}
      onPress={action}
    >
      {Icon && (
        <Icon
          name={icon_name}
          size={icon_size}
          color={icon_color && !nightmode ? icon_color : theme.text}
        />
      )}

      <Text
        style={[{ color: theme.text, fontSize: 15, fontFamily: "Nunito-Bold" }]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export function MyDrawer(props: any) {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { userData, refreshToken,authentication } = useSelector((state: any) => state.auth);
  const [logoutUser, { isLoading }] = usePostResourceMutation();

  const changeMode = async () => {
    isNightMode
      ? dispatch(setTheme({ selected: "light" }))
      : dispatch(setTheme({ selected: "dark" }));
  };

  const handleLogout = async () => {
    if (!isLoading) {
      try {
        const data = { refresh: refreshToken };
        const resp = await logoutUser({ data: data, endpoint: "/logout/" }).unwrap()
        dispatch(setAuth(false));
        props?.navigation?.closeDrawer()
        return  router.replace('/(auth)')
      } catch (error) {       
        dispatch(setAuth(false));
        return router.replace('/(auth)')
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        { backgroundColor: theme.background, flex: 1, paddingTop: StatusBar.currentHeight, },
      ]}
    >
      <View
        style={[
          {
            borderBottomColor: "#888",
            borderBottomWidth: 0.3,
            paddingLeft: 40,
          },
        ]}
      >
        {userData.profile_picture ? (
          <Image
            source={{ uri: userData.profile_picture }}
            style={[
              {
                width: 100,
                height: 100,
                backgroundColor: "orange",
                borderRadius: 50,
                resizeMode: "cover",
              },
            ]}
          />
        ) : (
          <View
            style={[
              globalstyles.columnCenter,
              {
                width: 100,
                height: 100,
                borderRadius: 50,
                overflow: "hidden",
                backgroundColor: "rgb(255,123,23)",
              },
            ]}
          >
            <Text
              style={[
                {
                  fontFamily: "Poppins-ExtraBold",
                  fontSize: 40,
                  color: "#fff",
                  textAlign: "center",
                },
              ]}
            >
              {userData?.full_name?.slice(0, 1)}
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={()=>router.replace('/(app)/(profile)')}
        >
          <View style={[globalstyles.row, { paddingTop: 20 }]}>
            <Text
            numberOfLines={2}
            ellipsizeMode="tail"
              style={[
                { color: theme.text, fontSize: 19, fontFamily: "Poppins-Bold" },
              ]}
            >
              {userData?.full_name?.slice(0,20)}
            </Text>
            <Checkmark
              checkStyles={{ paddingHorizontal: 8, marginTop: 3 }}
              size={24}
              tier={userData.tier}
              issuperuser={userData.is_superuser}
            />
          </View>

          <View
            style={[
              {
                borderRadius: 20,
                borderWidth: 0.4,
                width: "35%",
                marginBottom: 10,
                borderColor: "#777",
              },
            ]}
          >
            <Text
              style={[{ color: "#888", fontSize: 12, alignSelf: "center" }]}
            >
              View Profile
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {DrawerButtonRow({
        theme: theme,
        nightmode: isNightMode,
        text: "Home",
        destination: "Home",
        Icon: MaterialIcons,
        icon_name: "home-filled",
        action: ()=>router.replace('/(app)/(home)'),
        icon_color: "brown",
      })}
      {DrawerButtonRow({
        theme: theme,
        nightmode: isNightMode,
        text: "Edit Profile",
        destination: "Edit My Profile",
        Icon: FontAwesome5,
        icon_name: "user-edit",
        action: ()=>router.replace('/(app)/(profile)/edit'),
        icon_color: "orange",
        icon_size: 21,
      })}

      {/* {DrawerButtonRow({
        theme: theme,
        nightmode: isNightMode,
        text: "Settings",
        destination: "Settings Home",
        Icon: Ionicons,
        icon_name: "settings",
        action: ()=>router.replace('/(app)/(home)'),
        icon_color: "green",
      })} */}

      <View style={[{ position: "absolute", bottom: 50, width: "80%" }]}>
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            {
              borderColor: "red",
               width:100,
               alignSelf:'center',
              borderRadius: 25,
              paddingVertical: 10,
              paddingHorizontal:20,
              borderWidth: 1,
              backgroundColor: isNightMode ? theme.background : "#fff",
            },
          ]}
        >
          <Text style={[{ color: "red" }]}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalstyles.columnCenter,
            { marginVertical: 20, paddingVertical: 20 },
          ]}
          onPress={changeMode}
        >
          {isNightMode ? (
            <Entypo name="light-down" color={theme.text} size={72} />
          ) : (
            <MaterialIcons
              name="nightlight-round"
              size={70}
              color={theme.text}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


export function ConversationHeader(props:any){
  const {currentReceiver} =  useSelector((state:any)=>state.messages)
  const {theme} = useSelector((state:any)=>state.theme)
   
  return(
    <SafeAreaView
    style={[
      { backgroundColor: theme.card, 
        paddingTop: StatusBar.currentHeight, },
    ]}
  >
    <View style={[globalstyles.rowWide,{padding:20}]}>

          <TouchableOpacity
           
          onPress={()=> router.push('/(app)/(messages)')}
           >
               <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <Text style={{color:theme.text, fontFamily:'Poppins-Regular', fontSize:20}}>
              {currentReceiver.full_name.split(0,15)}
          </Text>

          <View
          style={{
            backgroundColor: "gray",
            height: 30,
            width: 30,
            overflow: "hidden",
            borderRadius: 15,
          }}
        >
          {currentReceiver?.profile_picture ? (
            <Image
              style={{
                resizeMode: "center",
                height: 30,
                width: 30,
                borderRadius: 15,
              }}
              source={{ uri: currentReceiver.profile_picture }}
            />
          ) : (
            <CustomUserAvatar name={currentReceiver.full_name} />
          )}
        </View>

    </View>
 </SafeAreaView>
  )
} 