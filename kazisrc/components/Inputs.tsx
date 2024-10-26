import { globalstyles } from '../styles/styles';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TextInput, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RenderButtonRow } from './Buttons';

interface TaggedInputProps {
  onBlur?: () => void;
  onFocus?: () => void;
  onChangeText: (text: string,...args:any) => void;
  value: string ;
  placeholder?: string;
  placeholderTextColor?: string;
  maxLength?: number;
  keyboardType ?: any;
  secureTextEntry ?: boolean;
  taggedInputStyles?: StyleProp<TextStyle>;
  taggedInputContainerStyles?: StyleProp<ViewStyle>;
  editable ?: boolean;
  errorMessage?: string | any;
  caption?:string;
  captionStyles?: StyleProp<TextStyle>;
  captionContainerStyles?: StyleProp<ViewStyle>;
}

export function TaggedInput({
  onBlur,
  onChangeText,
  onFocus,
  value,
  placeholder="",
  editable=true,
  placeholderTextColor="#888",
  maxLength=30,
  secureTextEntry=false,
  keyboardType="default",
  taggedInputStyles = { textAlign: 'center' },
  errorMessage = '',
  taggedInputContainerStyles = {},
  caption = "",
  captionStyles = {},
  captionContainerStyles = {}
}:TaggedInputProps){
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
  return (
    <View>
    <View style={[{borderWidth:1,borderColor:'#888',borderRadius:5,width:'80%',minHeight:50
    ,alignSelf:'center',marginVertical:10
    },taggedInputContainerStyles]}>
      
      {caption.length >0 &&
    <View style={[{position:'absolute',top:-10,left:20,paddingHorizontal:5 ,
    backgroundColor:theme.card},captionContainerStyles]}>
        <Text style={[{fontSize:12,color: theme.text,fontFamily:'Poppins-Bold'},captionStyles]}>{caption}</Text>
    </View>
    }
    
      <TextInput
       multiline
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={placeholderTextColor}
        style={[{fontSize:14,color:theme.text,paddingHorizontal:5},taggedInputStyles]}
        placeholder={placeholder}
        maxLength={maxLength}
        editable={editable}
        value={ value} 
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => onChangeText(text)}
      />
     
    </View>
    {errorMessage.length>0 && (
        <Text style={[{color:'red',textAlign:'center'}]}>
          {errorMessage}
        </Text>
      )}
    </View>
  
  );
};


export const RenderTaggedInput = ({
  onBlur,
  onChangeText,
  onFocus,
  value,
  placeholder="",
  editable=true,
  placeholderTextColor="#888",
  maxLength=30,
  secureTextEntry=false,
  keyboardType="default",
  taggedInputStyles = { textAlign: 'center' },
  errorMessage = '',
  taggedInputContainerStyles = {},
  caption = "",
  captionStyles = {},
  captionContainerStyles = {}
}:TaggedInputProps)=>{
  
  return(
    <TaggedInput
     onFocus={onFocus}
     onBlur={onBlur}
     placeholderTextColor={placeholderTextColor}
     taggedInputStyles ={taggedInputStyles}
     errorMessage = {errorMessage}
     taggedInputContainerStyles = {taggedInputContainerStyles}
     caption = {caption}
     captionStyles = {captionStyles}
     captionContainerStyles = {captionContainerStyles}
     placeholder={placeholder}
     maxLength={maxLength}
     editable={editable}
     value={value} 
     keyboardType={keyboardType}
     secureTextEntry={secureTextEntry}
     onChangeText={(text) => onChangeText(text)}
   />
  )   
}




interface InputProps{
  theme:any;
  setFocus:any;
  focus:string;
  current:string;
  Icon:any;
  icon_name:string;
  onChangeText:(val:any)=>void;
  value:any;
  focusColor?:string;
  inputStyles?:StyleProp<ViewStyle>;
  secureEntry?:boolean;
  placeholder:string;
  maxLength?:number;
  showVisibility?:any;
  errorMessage:string;
  keyboardType?:any;
  showVisButton?:boolean;
}


export function Input({theme,setFocus,current,value,secureEntry=false,placeholder='',focusColor="#b35900",inputStyles,
  showVisibility,errorMessage,keyboardType='default',
  showVisButton=false,maxLength=18,
  focus,Icon,icon_name,onChangeText}:InputProps){
  return(
    <View style={[globalstyles.column]}>
    <View style={[globalstyles.row,
      globalstyles.inputBorder,{ borderColor: "#555",alignSelf:'center' },
      focus == current && { borderColor: focusColor },inputStyles]}>

  <Icon name={icon_name} 
   style={[{position:'absolute',top:10, left:15}]}
  size={20} color={ focus == current? focusColor: theme.text} />    

  <TextInput
    value={value}
    maxLength={maxLength}
    secureTextEntry = {secureEntry}
    keyboardType={keyboardType}
    placeholderTextColor={"#888"}
    style={[{marginLeft:50,width:'67%',textAlign:'center'},theme&&{color:theme.text}
    ]}
    onFocus={() => setFocus(current)}
    onBlur={() => setFocus('')}
    onChangeText={onChangeText}
    placeholder={placeholder}
  />  
  {showVisButton &&
  <TouchableOpacity onPress={()=> showVisibility(!secureEntry)} style={[{position:'absolute', right:10}]}>
     <MaterialIcons name={secureEntry? "visibility" : "visibility-off"} style={[{top:10}]}  size={24} color={theme && theme.text} />
  </TouchableOpacity>
  }

  </View>

  
  <View style={[{ alignSelf: "center", marginVertical:8 }]}>
    <Text style={[{textAlign:'center',color:'red'}]}>
      {errorMessage && errorMessage}
    </Text>
  </View>
  </View>
  )
}



interface MessageInputProps {
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmit?: () => void;
  onAttachVideo?: () => void;
  onAttachImage?: () => void;
  onAttachDocument?: () => void;
  onChangeText: (text: string,...args:any) => void;
  value: string ;
  placeholder?: string;
  placeholderTextColor?: string;
  maxLength?: number;
  keyboardType ?: any;
  secureTextEntry ?: boolean;
  InputStyles?: StyleProp<TextStyle>;
  InputViewStyles : StyleProp<ViewStyle>;
  editable ?: boolean;
  errorMessage?: string; 
  theme:any,
}


export function MessageInput({
  onBlur,
  onChangeText,
  onSubmit,
  onAttachDocument,
  onAttachImage,
  onAttachVideo,
  onFocus,
  value,
  placeholder="Write Something Here",
  editable=true, 
  placeholderTextColor="#888",
  maxLength=100,
  secureTextEntry=false,
  theme ,
  keyboardType="default",
  InputViewStyles,
  InputStyles = { textAlign: 'center' },
}:MessageInputProps){
  return (
    <View style={[globalstyles.card, globalstyles.rowWide,{width:'100%',backgroundColor:theme.card,paddingVertical:2,marginVertical:0,borderRadius:20},InputViewStyles]}>
        {RenderButtonRow({
           buttonStyles:[{marginTop:8}],
              action: onAttachImage,
              Icon: MaterialCommunityIcons,
              icon_color: 'green',
              icon_name: 'image-plus'
            })}
          {RenderButtonRow({
              buttonStyles:[{marginTop:8}],
            action:onAttachDocument,
            Icon: Ionicons,
            icon_color: '#448EE4',
            icon_name: 'attach'
          })}
  
      <TextInput
       multiline
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={placeholderTextColor}
        style={[{fontSize:14,color:theme.text,padding:5,width:'70%', borderRadius:20,textAlign:'left',
        backgroundColor:'rgba(0,0,0,0.2)'
        },InputStyles]}
        placeholder={placeholder}
        maxLength={maxLength}
        editable={editable}
        value={ value} 
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={(text) => onChangeText(text)}
      />
      
      {RenderButtonRow({
            buttonStyles:[{marginTop:8}],
            action:onSubmit,         
            Icon: MaterialCommunityIcons,
            icon_color: theme.text,
            icon_name: 'send'
          })}
    </View>
  )
}
