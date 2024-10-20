import { colorslight } from "@/store/slices/themeSlice";
import { store } from "@/store/store";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import * as Font from 'expo-font'; // import expo-font for loading fonts
import { SignupHeader } from "@/components/Headers";

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Poppins-Bold': require('../assets/fonts/SpaceMono-Regular.ttf'), // path to your font file
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null // Optionally show a loading screen while fonts are being loaded
  }

  
  return (
    <Provider store={store}>
      <ThemeProvider value={{
        dark: false,
        colors: colorslight
      }}>
        <Stack screenOptions={{headerShown:true,
          header:()=> <SignupHeader/>
        }}>
          <Stack.Screen options={{headerShown:false}} name="signin" />
          <Stack.Screen name="signup-phone-auth" />
          <Stack.Screen name="signup-otp-verify" />
          <Stack.Screen name="signup-account-setup" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}


