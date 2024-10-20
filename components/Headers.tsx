import index from "@/app";
import { logo } from "@/images/images";
import { globalstyles } from "@/styles/styles";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView, View, Image, Text } from "react-native";
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
