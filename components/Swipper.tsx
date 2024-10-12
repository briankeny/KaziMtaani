import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import PagerView from 'react-native-pager-view';



interface SwiperProps{
  children:any;
  swipperStyles?:StyleProp<ViewStyle>;
  initialPage?:number;
  scrollEnabled ?:boolean;
  onPageScroll?: () => void;
  onPageSelected?: () => void;
  keyboardDismissMode?: any;
  overdrag?: boolean;
  viewPagerStyle?: StyleProp<ViewStyle>;
  setPage: (index:number)=>void;
   orientation?:any;
}

const Swipper:React.FC<SwiperProps> =  ({children,swipperStyles,initialPage=0,scrollEnabled=true,setPage,
  onPageSelected,
  viewPagerStyle,
  orientation='horizontal',
  onPageScroll,
  keyboardDismissMode='on-drag',
  overdrag=false}) =>{
    return (
      <View style={swipperStyles} >
      <PagerView
       style={viewPagerStyle}
      initialPage={initialPage}
      scrollEnabled={scrollEnabled}
      onPageScroll = {onPageScroll}
      // setPageWithoutAnimation ={}
      orientation={orientation}
      onPageSelected={onPageSelected}
      // setPage={setPage}
      keyboardDismissMode={keyboardDismissMode}
      overdrag={ overdrag}
      >
          {children}
      </PagerView>
      </View>
    )
  }

export default Swipper;






