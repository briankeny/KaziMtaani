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
  useDeleteResourceMutation,
  usePatchResourceMutation,
} from "@/kazisrc/store/services/authApi";
import { logo } from "@/kazisrc/images/images";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
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
  const [patchData, { isLoading, isError, error }] = usePatchResourceMutation();
  const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
  const snapPoints = useMemo(() => [ "10%", "25%", "50%"], []);
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

  async function markNotification(id:any){
    try{
        const data = {read_status:true}
        const resp = await patchData({data:data,endpoint:`/notification/${id}/`}).unwrap()
        if(resp)
          fetchNotifications()
      }
    catch(error){

    }
  }

  async function notificationAction(notification:any){
    try{
   
      //  const resp = await getData({'endpoint':notification.action}).unwrap()
      //  if(resp){
        switch(notification?.notification_category){
          case 'general':
          break;
          case 'user':
            break;
          case 'job':
            break;
          default:
            break;
        }
        markNotification(notification?.notification_id)
      //  }
    }
    catch(error){

    }
  }

  
  function opendialogue(item:any) {
    setNotification(item)
    setOpenBottomSheetDrawer(true)
  }

  async function deleteNotification(id: any) {
    if (!delLoading) {
      try {
        setOpenBottomSheetDrawer(false)
        await deleteData({
          endpoint: `/notification/${id}/`,
        })

          rendermodal({
            dispatch: dispatch,
            header: "Success!",
            status: "success",
            content: "Notification has been removed!",
          });
          fetchNotifications()
        
      } catch (error: any) {
        rendermodal({
          dispatch: dispatch,
          header: "Error!",
          status: "error",
          content: 'Notification could not be deleted. Please try again later',
        });
      }
    }
  }

  async function fetchNotifications(){
    try{
      const resp =  await getData({endpoint:`/notifications/`}).unwrap()
      if(resp){
        const data = resp?.results ? resp.results : []
       
        dispatch(setNotifications(data))
      }
    }
    catch(error){
    }
  } 


  useEffect(()=>{
    fetchNotifications()
  },[])


  function RenderBottomContent() {
    return ( 
    <View style={[globalstyles.card,{backgroundColor:theme.card}]}>
      <RenderButtonRow 
      Icon={AntDesign}
      icon_color={theme.text}
      icon_name={ notification.read_status? 'star':'staro'}
      action={()=>markNotification(notification.notification_id)}
      buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
      button_text={notification.read_status ? 'UnMark as Read': 'Mark as Read'}
      buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
      
      <RenderButtonRow 
      Icon={MaterialIcons}
      icon_color="red"
      icon_name="delete"
      icon_size={24}
      action={()=>deleteNotification(notification.notification_id)}
      buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
      button_text="Delete notification"
      buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
     
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
            const { dat, time } = dateFormater(item.timestamp);
          return(
            < RenderNotification
            key = {index}  
            item = {item}
            dat={dat}
            time={time}
            goToNotification = {()=>notificationAction(item)}
            openDialogue ={ ()=>opendialogue(item)}
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
            
              body={"Oops! We could not fetch your notifications at the moment"}
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
  dat,time,
  index,
  goToNotification,
  openDialogue,
  theme,
}: any) {
 
  
  return (
    <TouchableOpacity
      onPress={goToNotification}
      style={[
        globalstyles.column,
        { 
          paddingHorizontal:20,
          borderColor:'#999',
          borderWidth:0.3,
          marginVertical: 1,
          paddingVertical:5
        },
        item?.read_status == false && {backgroundColor:theme.postBackground}
      ]}
      key={index}
    >
        <View style={[globalstyles.rowWide]}>
      <Text style={[{ fontSize: 11 ,color:'#999'}]}>
          {dat}
        </Text>
        <Text style={[{ fontSize: 11, textAlign: "right", color: "green" }]}>
          {time}
        </Text>
      </View>
      <View style={globalstyles.row}>            
      
                <View style={[{width:'90%',paddingHorizontal:10}]}>
                    <View style={[globalstyles.row,{gap:4,alignContent:'center',alignItems:'center'}]}>
                    <View style={[{width:30,height:30,borderRadius:20,marginTop:10,
                      backgroundColor:'orange'
                    }]}>
                    {item?.user?.profile_picture ? (
                            <Image
                              style={{alignSelf:'center',width:30,height:30, 
                                borderRadius:15, resizeMode:'cover'}}
                              source={{uri:item.user.profile_picture}}
                            />
                          ) : <Entypo name="user" 
                          size={21} style={[{alignSelf:'center',paddingTop:20},
                            {color:'#888'}]} />              
                          }
                    </View>
                    <Text style={{color:theme.text,
                      paddingTop:5,
                      fontFamily:'Poppins-Bold' }}>
                        {item.subject}
                    </Text>
                    </View>

                    <Text         
                    style={[
                    {color:theme.text}]}>
                        {item.message}
                    </Text>
                </View>
      
                <TouchableOpacity onPress={openDialogue} style={[
                  globalstyles.columnCenter,
                  {width:'10%'}]} >
                      <Entypo name="dots-three-vertical"
                       size={20} style={[theme && {color:theme.text}]} />
                </TouchableOpacity>
            </View>
    </TouchableOpacity>
  );
}
