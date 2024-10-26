import React from 'react';
import { View,StyleProp, ViewStyle, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { globalstyles } from '../styles/styles';


interface BottomSheetDrawerProps{
    children?:any;
    bottomSheetRef ?: any;
    index ?: number;
    snapPoints ?: any;
    handleSheetChanges ?: ()=> void;
    bottomsheetcontainerstyles ?: StyleProp<ViewStyle>;
    handleClose ?: any;
}

const BottomSheetDrawer:React.FC <BottomSheetDrawerProps> = ({children,bottomSheetRef=null,index=-1,snapPoints=["25%","50%","75%", "100%"],handleSheetChanges,handleClose})=> {
    const { theme, isNightMode } = useSelector((state:any)=>state.theme)
    return (
          <BottomSheet
            ref={bottomSheetRef} 
            index={index}
            // center={true}
            handleComponent={()=><View style={[globalstyles.line,theme&&{borderColor:theme.text,borderRadius:20,width:34,borderWidth:5}]}></View>}   
            handleStyle={{backgroundColor:theme.text,height:5,padding:0,width:34}}
            snapPoints={snapPoints}
            backgroundStyle={{backgroundColor:theme.card}}
            enablePanDownToClose={true}
            enableContentPanningGesture={true}
            onChange={handleSheetChanges}
            onClose={handleClose}
            animateOnMount={true}
          >
            {children}
            
          </BottomSheet>
      );
  }

export default BottomSheetDrawer
