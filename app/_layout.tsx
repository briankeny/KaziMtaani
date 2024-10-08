import { colorsdark, colorslight, setTheme } from '@/store/slices/themeSlice';
import { store, useAppDispatch } from '@/store/store';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export function AppLayout(){

  const dispatch = useAppDispatch()
  const appearance = useColorScheme()
  const [appLoading,setApploading] = useState<boolean>(true)
  const [authLoading, setAuthLoading] = useState<boolean>(true);  // Track authentication loading status
  const { authentication } =  useSelector((state:any) => state.auth)
  const { current_theme,isNightMode} =  useSelector((state:any) => state.theme)
  
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });


  // Inherit Theme if System Default is Enabled
  function prepareTheme(){
     if (current_theme == 'default'){
      dispatch(setTheme({selected:'default',appearance:appearance}))
     }
  }


 //Queue App Preparation 
  async function prepareApp(){
    if(appLoading){
      await  prepareTheme()
      
      // await updateUserLocation()
      await SplashScreen.hideAsync()
      await setApploading(false)
    }
  }

 //Queue Tasks
  useEffect(()=>{
    prepareApp()
  },[])

  //  StartApp When Authentication has a value
  useEffect(() => {
    if (authentication !== undefined && authentication !== null) {
      setAuthLoading(false);  // Authentication status resolved
    }
    console.log(`The app auth is ${authentication}`)
  }, [authentication]);

  // Show nothing while app and authentication status are loading
  if (appLoading && authLoading) {
    return null;
  }

  return (
   
      <ThemeProvider value={ isNightMode? {dark:true,colors:colorsdark} :  {dark:false,colors:colorslight}}>
        <Stack screenOptions={{
          headerShown:false
        }}>
          
          { authentication ?
            <Stack.Screen name="kazi" />:
            <Stack.Screen name="auth" />   
          }
        </Stack>
      </ThemeProvider>
  
  );  
}


export default function RootLayout(){
return(
  <Provider store={store}>
    <AppLayout/>
  </Provider>
)
}
