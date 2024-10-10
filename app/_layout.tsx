import { colorslight } from "@/store/slices/themeSlice";
import { store } from "@/store/store";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider value={{
        dark: false,
        colors: colorslight
      }}>
        <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="signup" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
