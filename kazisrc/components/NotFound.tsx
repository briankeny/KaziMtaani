import React from 'react';
import { globalstyles } from '../styles/styles';
import {View,Text,Image } from 'react-native';
import { useSelector } from 'react-redux';
interface notFoundProps {
    containerstyles ?: object;
    body?:string;
    bodystyles?:object;

}
const NotFound:React.FC <notFoundProps> = ({body="No Internet connection",containerstyles,bodystyles}) => {
  const {theme} = useSelector((state:any)=> state.theme)
  return (
    <View style={[globalstyles.columnCenter,{height:'100%'},containerstyles]}>
        <View style={globalstyles.column}>  
          
            <View style={[{width:300, height:200, alignSelf:'center',borderRadius:8,overflow:'hidden',marginVertical:20}]}>
               <Image style={[{width:400, height:200, alignSelf:'center',borderRadius:8}]} 
               source={require('../../assets/images/notfound.png')}/>
            </View>
          
           <View style={[globalstyles.column,{paddingHorizontal:60}]}>
                   <Text style={[{color:theme.text}, bodystyles]}>{body}</Text>
           </View>
            
        </View>
    </View>
  )
}

export default NotFound



