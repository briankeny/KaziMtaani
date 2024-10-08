import { globalstyles } from "@/styles/styles";
import { StyleProp, ViewStyle, TextStyle, TouchableOpacity,Text } from "react-native";


interface ButtonRowProps {
  Icon?:any;
  icon_name?:string;
  icon_size?:number;
  icon_styles?:StyleProp<any>;
  icon_color?:string;
  action ?: ()=> void;
  button_text?:string;
  buttonStyles: StyleProp<ViewStyle>;
  buttonTextStyles ?:StyleProp<TextStyle>;
  children?:any;
}


export function RenderButtonRow ({Icon,icon_name,icon_color,children,icon_styles,
  icon_size=24,
  buttonTextStyles=[],
  action,button_text,buttonStyles=[globalstyles.row,{gap:10,width:'30%',
  }]}:ButtonRowProps){

  return (
      <TouchableOpacity style={buttonStyles} onPress={action}>
      {Icon && icon_name &&
      <Icon 
      name={icon_name}
      style={[icon_styles]}
      size={icon_size} 
      color={icon_color}
      />}
         
         {button_text &&
          <Text style={buttonTextStyles}>
                  {button_text}
          </Text>
          }
          {children}
      </TouchableOpacity>
  )
}