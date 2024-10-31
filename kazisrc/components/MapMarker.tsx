import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { View, Text, StyleSheet, Image } from 'react-native';
import { globalstyles } from '../styles/styles';
import { logo } from '../images/images';

type MarkerProps ={
    location : {latitude:number , longitude :number} ;
    // name :string;
    mapIcon ?: any;
    title : string;
    description ?: string;
    theme:any;
    imageSource : any ;
    // titleStyle : StyleProp<TextStyle>;
    onPress : ()=>void;
}

const MapMarker = ({ location,theme,title,description,imageSource,mapIcon, onPress }:MarkerProps) => {
  return (
    <Marker
      coordinate={{ latitude: location.latitude, longitude: location.longitude }}
      onPress={onPress}
      // icon={mapIcon}
      style={{flexShrink:3}}
    >
      <Callout>
      <View style={[{ width:80,backgroundColor:theme.card,height:80,borderRadius:40,overflow:'hidden'}]}>
            <Text 
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{color:'orange',
              fontSize:9,
              padding:5,
              textAlign:'center',
              fontFamily:'Poppins-Bold'}}>
                 {title}
            </Text>

            <Text style={{alignSelf:'center',position:'absolute',width:40,height:40}}>
            <Image
            style={{ 
              height:40,
              flex: 1,
              borderRadius:30,
              top:-54,
              width: 40,
              objectFit:'contain',
              resizeMode:'contain'
            }}
             source = {imageSource}
            />
            </Text>
         
          <View style={[{position:'absolute',bottom:10,padding:10}]}>
          <Text 
           numberOfLines={2}
           ellipsizeMode='tail'
            style={{ 
              fontSize:8,
            color: 'green',
            fontWeight: 'bold'}}>
                {description}
            </Text>  

          </View>
       
        </View>
      </Callout>
      
    </Marker>
  );
};

export default MapMarker;

