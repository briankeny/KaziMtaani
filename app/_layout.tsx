import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Slot, Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import { SignupHeader } from "@/kazisrc/components/Headers";
import { colorslight } from "@/kazisrc/store/slices/themeSlice";
import { store } from "@/kazisrc/store/store";
import { Provider } from "react-redux";


SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  
  const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
      'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
      'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
      'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
      'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
      // path to your font file
    });
    setFontsLoaded(true);
    SplashScreen.hideAsync();
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if(!fontsLoaded){
    return null
  }

  return (
    <GestureHandlerRootView>
    <Provider store={store}>
      <ThemeProvider
        value={{
          dark: false,
          colors: colorslight,
        }}
      >
         <Stack screenOptions={{
        headerShown:true,
        }}>
           <Stack.Screen options={{headerShown:false}} name="index" />
            <Stack.Screen options={{headerShown:false}} name="signin" />
            <Stack.Screen 
            options={{title:'Password Reset'}}
            name="password-reset" />
            <Stack.Screen 
            options={{ header:()=> <SignupHeader/>}}
            name="signup-phone-auth" />
            <Stack.Screen 
            options={{ header:()=> <SignupHeader/>}}
            name="signup-otp-verify" />
            <Stack.Screen
            options={{ header:()=> <SignupHeader/>}}
            name="signup-account-setup" />
             <Stack.Screen options={{headerShown:false}} name="(app)" />

          </Stack>
      </ThemeProvider>
    </Provider>
    </GestureHandlerRootView>
  );
}


