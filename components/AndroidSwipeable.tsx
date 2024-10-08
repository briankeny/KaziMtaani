import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

interface AndroidSwipeableProps {
  children:any
  swipeableRowRef ?:any; 
  deleteAction ?:()=>void;
  archiveAction?:()=>void;
}

const AndroidSwipeable = ({ children,deleteAction,archiveAction,swipeableRowRef=null }:AndroidSwipeableProps) => {
  

  const renderLeftActions = (progress:any, dragX:any) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={styles.leftAction} onPress={archiveAction}>
        <AnimatedIcon
          name="archive"
          size={30}
          color="#fff"
          style={[styles.actionIcon]}
        />
      </RectButton>
    );
  };

  const renderRightActions = (progress:any, dragX:any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <RectButton style={styles.rightAction} onPress={deleteAction}>
        <AnimatedIcon
          name="delete-forever"
          size={30}
          color="#fff"
          style={[styles.actionIcon]}
        />
      </RectButton>
    );
  };

 
  const updateRef = (ref:any) => {
    swipeableRowRef.current = ref;
  };
  

  
  return (
    <Swipeable
      ref={updateRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={41}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}>
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#388e3c',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
  rightAction: {
    alignItems: 'center',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    backgroundColor: '#dd2c00',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default AndroidSwipeable;
