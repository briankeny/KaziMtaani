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
}

export default function MapViewer({children,initialRegion={
  latitude: -1.5256749,
  longitude: 36.9396504,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}}:MapViewerProps) {
  return (
    <View style={styles.container}>
      <MapView 
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
