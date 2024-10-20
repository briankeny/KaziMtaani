import { globalstyles } from "@/styles/styles";
import { AntDesign, Entypo } from "@expo/vector-icons";
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

interface ToastProps {
  status?: string;
  color?: string;
  onPress: () => void;
  visible?: boolean;
  children?: any;
  modalHeader?: string;
  modalContent?: string;
}

const Toast: React.FC<ToastProps> = ({
  status = "info",
  color = "#888",
  onPress,
  visible,
  modalHeader,
  children,
  modalContent,
}) => {
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const iconSelector = (status: string) => {
    switch (status) {
      case "success":
        color = "green";
        break;
      case "error":
        color = "red";
        break;
      case "warning":
        color = "#cc3300";
        break;
      case "info":
        color = "orange";
        break;
      default:
        break;
    }
  };
  iconSelector(status);
  return (
    <Modal
      visible={visible}
      onRequestClose={onPress}
      animationType="fade"
      transparent={true}
    >
      <View
        style={[
          globalstyles.card,
          {
            minHeight:100,
            display:'flex',
            padding:10,
            marginTop:5,
            top:0,
            zIndex:1,
            backgroundColor:isNightMode ? 'rgb(205,200,200)' : '#fff',
            left:0,
            elevation:3,
            width:'99%',
            alignSelf:'center'
          }
        ]}
      >

        <View style={[globalstyles.row,{}]}>
          <AntDesign
            style={[
              { padding:10}]}
            name="questioncircleo"
            size={24}
            color={color}
          />

        <View
          style={[globalstyles.column, { alignSelf: "center",width:'75%' }]}
        >
          <Text
            style={[
              { textAlign: "center",
                fontWeight:'500',
                paddingVertical:5,
                fontSize:17,
                color:color
               },
            ]}
          >
            {modalHeader}
          </Text>
          <View style={{alignSelf: "center" }}>
            <Text
              style={[
                {
                  fontWeight:'500',
                  fontSize:14,
                  paddingTop:5,
                  color:'#333',
                  textAlign: "center",
                  lineHeight: 19
                }
              ]}
            >
              {modalContent}
            </Text>
        </View>
        </View>

        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            padding:10
          }}
          onPress={onPress}
        >
          <Entypo
        
            name="cross"
            size={28}
            color={color}
          />
        </TouchableOpacity>
        </View>

  
        {children}
      </View>
    </Modal>
  );
};

export default Toast;
