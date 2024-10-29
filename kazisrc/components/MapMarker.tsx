import React from 'react';
import { Callout, Marker } from 'react-native-maps';
import { View, Text, StyleSheet, Image } from 'react-native';
import { globalstyles } from '../styles/styles';
import { logo } from '../images/images';

type MarkerProps ={
    location : {latitude:number , longitude :number} ;
    // name :string;
    title : string;
    description ?: string;
    theme:any;
    imageSource : any ;
    // titleStyle : StyleProp<TextStyle>;
    onPress : ()=>void;
}

const MapMarker = ({ location,theme,title,description,imageSource, onPress }:MarkerProps) => {
  return (
    <Marker
      coordinate={{ latitude: location.latitude, longitude: location.longitude }}
      onPress={onPress}
    >
      <Callout>
        <View style={[{ width:80,backgroundColor:theme.card,}]}>
           
            <Text 
            numberOfLines={1}
            ellipsizeMode='tail'
            style={{color:'orange',
              fontSize:10,
              textAlign:'center',
              fontFamily:'Poppins-Bold'}}>
                 {title}
            </Text>


          <Text 
           numberOfLines={2}
           ellipsizeMode='tail'
            style={{ 
              padding:2,
              fontSize:9,
            color: 'green',
            fontWeight: 'bold'}}>
                {description}
            </Text>
          
            <Text style={{alignSelf:'center'}}>
            <Image
            style={{ 
              height:40,
              flex: 1,
              borderRadius:20,
              top:-80,
              width: 40,
              objectFit:'contain',
              resizeMode:'contain'
            }}
             source = {imageSource}
            />
            </Text>
       

        </View>
      </Callout>
    </Marker>
  );
};

export default MapMarker;

