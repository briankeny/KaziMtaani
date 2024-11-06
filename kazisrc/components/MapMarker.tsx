import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { globalstyles } from '../styles/styles';
import { logo } from '../images/images';

type MarkerProps ={
    latitude?:any | number  ;
    longitude ?: any |number ;
    // name :string;
    mapIcon ?: any;
    title : string;
    goToProfile ?: any;
    industry ?: string;
    description ?: string;
    theme:any;
    imageSource : any ;
    // titleStyle : StyleProp<TextStyle>;
    onPress ?:any;
}

const MapMarker = ({ latitude=1,
  goToProfile=undefined,
  longitude=1,theme,title,description,industry,imageSource,mapIcon, onPress=undefined }:MarkerProps) => {
  return (
    <Marker
      coordinate={{ latitude: latitude, longitude:longitude }}
      onPress={onPress}
      // icon={mapIcon}
      style={{flexShrink:3}}
    >
      <Callout>
      <TouchableOpacity 
       onPress={goToProfile}
      style={[globalstyles.column,{ backgroundColor:'#fff',overflow:'hidden', width:100}]}>

            <View style={[globalstyles.rowEven]}>
            <View style={{height:20,width:20,
             alignSelf:'center',
              borderRadius:10,
              backgroundColor:'#0566c7'}}>
            </View>
            <Text 
            numberOfLines={2}
            ellipsizeMode='tail'
            style={{color:'#444',
              fontSize:9,
              padding:5,
              textAlign:'center',
              fontFamily:'Poppins-Bold'}}>
                 {title}
            </Text>
            </View>
          
          {industry &&
          <Text style={{color:'#222', fontWeight:'600', paddingVertical:5, fontSize:8}}>
              {industry}
          </Text>
          }
          <Text 
           numberOfLines={2}
           ellipsizeMode='tail'
            style={{ 
              fontSize:8,
              padding:2,
            color: 'gray',
            fontWeight: 'bold'}}>
                {description}
            </Text>         
        </TouchableOpacity>
      </Callout>
      
    </Marker>
  );
};

export default MapMarker;

