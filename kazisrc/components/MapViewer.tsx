import React from 'react';
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

interface MapViewerProps {
  children?:any;
  initialRegion ?: {
    latitude: any,
    longitude:  any,
    latitudeDelta: any,
    longitudeDelta: any,
  };
  handleMapPress?:(e:any)=>void;
}

export default function MapViewer({children,
  initialRegion,handleMapPress
  }:MapViewerProps) {
  return (
    <View style={styles.container}>
      <MapView 
       onPress={handleMapPress}
       initialRegion={initialRegion}
        // provider= {PROVIDER_GOOGLE }
      style={styles.map} >
          {children}
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
