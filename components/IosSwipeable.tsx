import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';

import { RectButton, Swipeable } from 'react-native-gesture-handler';


interface IosSwipeableProps {
  children:any
  swipeableRowRef ?:any; 
  deleteAction ?:()=>void;
  archiveAction?:()=>void;
}

export function  IosSwipeable ({ children,deleteAction,archiveAction,swipeableRowRef=null }:IosSwipeableProps){
  

  const renderLeftActions = (progress:any, dragX:any) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={{flex: 1,backgroundColor: '#497AFC',justifyContent: 'center'}} onPress={archiveAction}>
        <Animated.Text style={[{    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
}]}>Archive</Animated.Text>
      </RectButton>
    );
  };

  const renderRightAction = (text:string, progress:any=64) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [92, 0],
    });
  
    return (
      <Animated.View style={[{ flex: 1, transform: [{ translateX: 0 }] }]}>
        <RectButton
          style={[{ backgroundColor: 'red',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }]}
          onPress={deleteAction}>
          <Text style={{    color: 'white',
          fontSize: 16,
          backgroundColor: 'transparent',
          padding: 10,
      }}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress:any ) => {
    return(
      <View style={{ width: 192, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
        {renderRightAction('Delete',  progress)}
      </View>
    );
  }
  
  

  return (
    <Swipeable
      ref={swipeableRowRef}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};

