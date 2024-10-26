import React from 'react';
import { StyleSheet, Image } from 'react-native';

interface ImageViewerProps  {
  placeholderImageSource?:any;
  selectedImage?:string;
}

export default function ImageViewer({ placeholderImageSource,selectedImage }:ImageViewerProps) {
  
  return (
    <Image 
    source={ selectedImage? {uri: selectedImage} :placeholderImageSource} 
    style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
