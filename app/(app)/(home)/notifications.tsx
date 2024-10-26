import React, { useMemo, useRef, useState } from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import BottomSheetDrawer from '@/kazisrc/components/BottomSheetDrawer';
import { Loading } from '@/kazisrc/components/Loading';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { dateFormater } from '@/kazisrc/utils/utils';
import { router } from 'expo-router';
import { SafeAreaView, FlatList, RefreshControl, ScrollView, View ,TouchableOpacity,Text} from 'react-native';
import { useSelector } from 'react-redux';
import NotFound from '@/kazisrc/components/NotFound'
import { useGetResourceMutation, usePostResourceMutation, useDeleteResourceMutation } from '@/kazisrc/store/services/authApi';

const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const [getUserData, { isLoading:getLoading, isError:getAllError, error:getError, isSuccess:getSuccess }] = useGetResourceMutation();
  const [postData,{ isLoading, isError, error}] = usePostResourceMutation();
  const [deleteData,{isLoading:delLoading}] = useDeleteResourceMutation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer,setOpenBottomSheetDrawer]= useState(false);
  const snapPoints = useMemo(() => ['25%', '50%','75%'], []);

  const {notifications} =  useSelector((state:any)=>state.notifications)

  const [refreshing, setRefreshing] = React.useState(false); 
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    router.replace('/notifications');
    }, 2000);
  }, [router]);

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  function goToNotification(notification:any){
    switch(notification){
        case 'message':
            break;
        default:
            break;
    }
  }

  function opendialogue(){
    
  }

    async function deleteNotification (id:any){
        if(!delLoading){
         try{
            const resp = await deleteData({endpoint:`/notification/${id}/`}).unwrap()
            if (resp){
                rendermodal({
                    dispatch: dispatch,
                    header: "Success!",
                    status: "success",
                    content: "Notification has been removed!",
                  });
            }
        }
         catch(error:any){
            rendermodal({
                dispatch: dispatch,
                header: "Error!",
                status: "error",
                content: error.message,
              });
         }         
     }
      }

    //   useEffect(()=>{
    //     if(isError){
    //         rendermodal({
    //             dispatch: dispatch,
    //             header: "Error!",
    //             status: "error",
    //             content: "Incorrect Credentials Provided!",
    //           })
    //     }
    //     },[isError])
    
    return (
        <SafeAreaView
        style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
              { getLoading ? 
   <Loading/> :
     notifications.length >0 ?
      <FlatList
    //   onScroll={handleYscroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
      data={notifications}
      keyExtractor={(item,index)=> index.toString()}
      renderItem={ ({item,index})=>
      RenderNotication({item:item,index:index,goToNotification:goToNotification,openDialogue:opendialogue,theme:theme})}
      />: 
      <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
     { getAllError ?
      <NotFound
      body={'An Error Occurred While Trying to fetch Notifications'}
      />
      :
      <View style={[globalstyles.columnCenter,{height:'100%',paddingVertical:'50%'}]}>
          <Text style={[{color:theme.text}]}>
            0 Notifications Found</Text>
      </View>
      }
      </ScrollView>
      }

{openBottomSheetDrawer &&
      <BottomSheetDrawer
      index={openBottomSheetDrawer?1:-1}
      snapPoints={snapPoints}
      handleClose={()=>setOpenBottomSheetDrawer(false)}
      bottomSheetRef={bottomSheetRef}
      >
       {/* {RenderBottomDrawer({
        theme:theme,
        favouriteNotification: ()=> changeNotification(notification.notification_id,{ 'is_favourite': !(notification.is_favourite)},`${notification.is_favourite ?  'Removed From':'Added To'} Favourites`),
       markNotifAsRead: ()=> changeNotification(notification.notification_id,{'read_status': !(notification.read_status)},`${notification.read_status?'Unmarked':'Marked'} As Read`), 
       deleteNotification: ()=> deleteNotification(notification.notification_id),
       notification:notification})} */}
       </BottomSheetDrawer>
}



        </SafeAreaView>
  )
}

export default NotificationsScreen

export function RenderBottomContent(){
  return(
<View>
  
</View>
  )
}


export function RenderNotication({item,index,goToNotification,openDialogue,theme}:any){
    const {dat, time} = dateFormater(item.timestamp)
    return(
        <TouchableOpacity  
        onPress={()=>goToNotification(item)}
        style={[globalstyles.column,globalstyles.card,
          {paddingHorizontal:20,marginVertical:1,paddingTop:10,paddingBottom:5,elevation:5}
        ,{backgroundColor:theme.card}]}  key={index}>
           
        <View style={[globalstyles.rowWide]}>
                <Text style={[{fontSize:11, textAlign:'right', color:'green'}]}>{time}</Text>
            </View>
      
            {/* <View style={globalstyles.rowWide}>
                <View style={[{width:60,height:60,borderRadius:30,marginTop:10,backgroundColor:chosenColor}]}>
                {item.notification_image ? (
                        <Image
                          style={{alignSelf:'center',width:60,height:60, 
                            borderRadius:30, resizeMode:'cover'}}
                          source={{ uri: item.notification_image}}
                        />
                      ) : <Entypo name="user" size={24} style={[{alignSelf:'center',paddingTop:20},theme && {color:theme.text}]} />              
      
                      }
                </View>
      
                <View style={[{width:'78%'}]}>
                    <Text style={[
                    globalstyles.card_Header,theme&&{color:theme.text},globalstyles.spaceHorizontal,{textAlign:'center'}]}>
                        {item.title}
                    </Text>
                    <Text  
                
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={[
                    globalstyles.card_Content,{lineHeight:18},
                    theme&&{color:theme.text},globalstyles.spaceHorizontal]}>
                        {item.message}
                    </Text>
                </View>
      
                <TouchableOpacity onPress={()=>openDialogue(item)} style={[{width:'10%'}]} >
                      <Entypo name="dots-three-vertical" size={20} style={[theme && {color:theme.text}]} />
                </TouchableOpacity>
      
            </View> */}
            <View style={globalstyles.columnEnd}>
            <Text style={[{fontSize:11},theme && {color:theme.text}]}>{dat}</Text>
            </View>
        </TouchableOpacity>
    )
}