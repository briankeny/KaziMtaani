import { Picker } from '@react-native-picker/picker'
import React from 'react'

interface PickerProps {
    list: Array<any>;
    value ?:any;
    label?:string;
    caption?:string;
    captionStyles?:any;
    theme:any;
    selectedValue:any;
    picker_styles?:any;
    pickerAction: any;
    caretColor?:any;
}
const RenderPicker = ({value,caption='',captionStyles, list,caretColor,label='',selectedValue,pickerAction, picker_styles,theme}:PickerProps) => {
  return (
    <Picker 
    dropdownIconColor={caretColor?caretColor:theme.text}
    style={[{width:'80%',color:theme.text,alignSelf:'center'},picker_styles]}
    selectedValue={selectedValue}
    onValueChange={pickerAction}
    >
      {caption &&
     <Picker.Item style={[{color:theme.text},captionStyles]} label={ 
      selectedValue ? selectedValue[label] : caption}/>}
 {list.map((item:any,index:number)=>{
    return(
    <Picker.Item  key={index}  label={label?item[label]:item} value={ value? item[value]:item} />
    )
    })
    }
    </Picker>
  )
}

export default RenderPicker






