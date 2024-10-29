import React, { useEffect, useMemo, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetDrawer from '@/kazisrc/components/BottomSheetDrawer';
import { Loading } from "@/kazisrc/components/Loading";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { dateFormater } from "@/kazisrc/utils/utils";
import { router } from "expo-router";
import {
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import NotFound from "@/kazisrc/components/NotFound";
import {
  useGetResourceMutation,
  usePostResourceMutation,
  useDeleteResourceMutation,
} from "@/kazisrc/store/services/authApi";
import { logo } from "@/kazisrc/images/images";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { setNotifications } from "@/kazisrc/store/slices/notificationSlice";
import { RenderButtonRow } from "@/kazisrc/components/Buttons";
import Toast from "@/kazisrc/components/Toast";

const NotificationsScreen = () => {
  const dispatch = useAppDispatch();
  const { theme} = useSelector((state: any) => state.theme);
  const { notifications} = useSelector((state: any) => state.notifications);
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );
  const [getData,
    {
      data:data,
      isLoading: getLoading,
      isError: getAllError,
      error: getError,
      isSuccess: getSuccess,
    },
  ] = useGetResourceMutation();
  const [postData, { isLoading, isError, error }] = usePostResourceMutation();
  const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(true);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const [notification ,setNotification] = useState<any | object>({})
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      router.replace("/(app)/(home)/notifications");
    }, 2000);
  }, [router]);

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  function goToNotification(notification: any) {
    switch (notification) {
      case "message":
        break;
      default:
        break;
    }
  }

  function opendialogue(item:any) {
    setNotification(item)
    setOpenBottomSheetDrawer(true)
  }

  async function deleteNotification(id: any) {
    if (!delLoading) {
      try {
        const resp = await deleteData({
          endpoint: `/notification/${id}/`,
        }).unwrap();
        if (resp) {
          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Notification has been removed!",
          });
        }
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Error!",
          status: "error",
          content: error.message,
        });
      }
    }
  }

  async function fetchNotifications(){
    try{
      const resp =  await getData({endpoint:`/notifications/`}).unwrap()
      if(resp){

        const data = resp?.results ? resp.results : []
        console.log('THis is resp',resp)
        dispatch(setNotifications(data))
      }
    }
    catch(error){
    }
  } 


  // useEffect(()=>{
  //   fetchNotifications()
  // },[])

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

  function RenderBottomContent() {
    return ( 
    <View style={[globalstyles.card,{backgroundColor:theme.card}]}>
      <RenderButtonRow 
      action={()=>deleteNotification(notification.notification_id)}
      buttonTextStyles={{color:theme.text}}
      button_text="Mark notification as read"
      buttonStyles={[globalstyles.row,{padding:20}]}/>
      
      <RenderButtonRow 
      Icon={MaterialIcons}
      icon_color="red"
      icon_name="delete"
      icon_size={24}
      action={()=>deleteNotification(notification.notification_id)}
      buttonTextStyles={{color:theme.text}}
      button_text="Delete notification"
      buttonStyles={{}}/>
     
    </View>
    )
  }
  

  return (
    <SafeAreaView
      style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
    >
      {getLoading && <Loading />}

      { notifications && notifications.length> 0 ? 
        <FlatList
            // onScroll={handleYscroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>{
          return(
            < RenderNotification
            key = {index}  
            item = {item}
            // goToNotification: goToNotification,
            // openDialogue: opendialogue,
            theme= {theme}
            />
          )
        }
          }
        />
       : 
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {getAllError ? 
            <NotFound
              body={"Oops! could not fetch notifications at the moment"}
            />
           : 
            <View
              style={[
                globalstyles.columnCenter,
                { height: "100%", paddingVertical: "50%" },
              ]}
            >
              <Text style={[{ color: theme.text }]}>You have 0 notifications</Text>
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
       <RenderBottomContent/>
       </BottomSheetDrawer>
}
<Toast
          visible={openModal}
          status={modalStatus}
          onPress={() => closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
    </SafeAreaView>
  );
};

export default NotificationsScreen;


export function RenderNotification({
  item,
  index,
  goToNotification,
  openDialogue,
  theme,
}: any) {
  const { dat, time } = dateFormater(item.timestamp);
  return (
    <TouchableOpacity
      onPress={() => goToNotification(item)}
      style={[
        globalstyles.column,
        globalstyles.card,
        {
          paddingHorizontal: 20,
          marginVertical: 1,
          paddingTop: 10,
          paddingBottom: 5,
          elevation: 5,
          backgroundColor: theme.card },
      ]}
      key={index}
    >
      <View style={[globalstyles.rowWide]}>
        <Text style={[{ fontSize: 11, textAlign: "right", color: "green" }]}>
          {time}
        </Text>
      </View>

      <View style={globalstyles.rowWide}>
                <View style={[{width:60,height:60,borderRadius:30,marginTop:10}]}>
                {logo ? (
                        <Image
                          style={{alignSelf:'center',width:60,height:60, 
                            borderRadius:30, resizeMode:'cover'}}
                          source={logo}
                        />
                      ) : <Entypo name="user" size={24} style={[{alignSelf:'center',paddingTop:20},theme && {color:theme.text}]} />              
      
                      }
                </View>
      
                <View style={[{width:'78%'}]}>
              
                    <Text  
                
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={[
                    {color:theme.text}]}>
                        {item.message}
                    </Text>
                </View>
      
                <TouchableOpacity onPress={openDialogue} style={[{width:'10%'}]} >
                      <Entypo name="dots-three-vertical" size={20} style={[theme && {color:theme.text}]} />
                </TouchableOpacity>
      
            </View>
      <View style={globalstyles.columnEnd}>
        <Text style={[{ fontSize: 11 }, theme && { color: theme.text }]}>
          {dat}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
