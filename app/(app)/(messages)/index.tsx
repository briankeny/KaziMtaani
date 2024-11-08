import React, { useEffect, useMemo, useRef, useState } from 'react'
import { router } from 'expo-router';
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetDrawer from '@/kazisrc/components/BottomSheetDrawer';
import { SafeAreaView, ScrollView, View,Text,TouchableOpacity,Image, FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useDeleteResourceMutation, useGetResourceMutation } from '@/kazisrc/store/services/authApi';
import {  setConvo, setCurrentReceiver } from '@/kazisrc/store/slices/messageSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { dateFormater} from '@/kazisrc/utils/utils';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import Toast from '@/kazisrc/components/Toast';
import { RenderButtonRow } from '@/kazisrc/components/Buttons';
import { MaterialIcons } from '@expo/vector-icons';


const ConversationsScreen = () => {
    const dispatch = useAppDispatch();
    const { theme} = useSelector((state: any) => state.theme);
    const {userData}  = useSelector((state:any)=> state.auth)
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
         fetchMessages()
      }, 2000);
    }, []);
    
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    ); 
    
    const [getUserData, { isLoading, isError, error, isSuccess }] = useGetResourceMutation();
    const [deleteData, { isLoading: delLoading }] = useDeleteResourceMutation();

    const [convoId, setConvoId] = useState<number | any>(null)

    const bottomSheetRef = useRef<BottomSheet>(null);
    const [openBottomSheetDrawer, setOpenBottomSheetDrawer] = useState(false);
    const snapPoints = useMemo(() => [ "10%", "25%", "50%"], []);
    const [conversations ,setConvos] = useState<any>([])

    function closeModal() {
      dispatch(clearModal());
      return true;
    }

    async function deleteConversation() {
      if (!delLoading) {
        setOpenBottomSheetDrawer(false)
        try {
           await deleteData({
            endpoint: `/chat/${convoId}/`,
          })
          rendermodal({
              dispatch: dispatch,
              header: "Success!",
              status: "success",
              content: "Conversation has been removed!",
          });
        fetchMessages()
        } catch (error: any) {
          rendermodal({
            dispatch: dispatch,
            header: "Error!",
            status: "error",
            content:"We could not perform this action at the moment" ,
          });
        }
      }
    }
   
    async function fetchMessages() {
      if(!isLoading){
      try{
        const resp = await getUserData({endpoint:'/chats/'}).unwrap()
        if(resp)
          setConvos(resp.results)
      }
      catch(error:any){
      }
    }
    }


    function goToScreen(item:any,participant:any){
      dispatch(setCurrentReceiver(participant))
      dispatch(setConvo(item))
      router.push({
       pathname:'/(app)/(messages)/conversation',
       params:{chat_id:item.chat_id}
      })
    }

    useEffect(()=>{
      fetchMessages()
    },[])
  


    function ConversationRow({ item,handleRowPress,participant,time,date}:any){
     return(   
       <TouchableOpacity style={[
        globalstyles.rowEven,
        { paddingVertical:20,
          backgroundColor:theme.card,
          elevation:2,
          margin:1
       }]}
       onLongPress={()=>{setConvoId(item.chat_id) ; setOpenBottomSheetDrawer(true)}}
       onPress={handleRowPress}>
           
        <View style={[
          globalstyles.columnCenter,
          {width:50,height:50, borderRadius:25,
           backgroundColor:'#999',overflow:'hidden'}]}>
         { participant?.profile_picture ?
         <Image
               style={[{width:50,height:50, 
                borderRadius:25
                , alignSelf:'center'}]}
              source={{uri:participant?.profile_picture}}
              />
              :
              <View style={[globalstyles.columnCenter,
                {width:50,height:50, 
                borderRadius:25,overflow:'hidden',
                backgroundColor:'rgb(255,123,23)'}]}>
                  <Text style={[
                  {fontFamily:'Poppins-ExtraBold',
                  fontSize:20,
                  color:'#fff',
                  textAlign:'center'}]}>
                  {participant?.full_name?.slice(0,1)}
                  </Text>
              </View>
          }
        </View>
        
        <View style={[globalstyles.column,{width:'80%'}]}>   
        <Text style={{color:theme.text,fontFamily:'Poppins-Bold'}}>
          {participant?.full_name}
        </Text>
        <Text 
         numberOfLines={1}
         ellipsizeMode='tail'
        style={[{fontSize:14,color:theme.text}]}>
          {item?.latest_message} 
        </Text> 
        </View>
    
        <View style={[globalstyles.columnEnd,{position:'absolute',bottom:5,right:10}]}>
           <Text style={[{color:theme.text,fontSize:12}]}>{time}</Text>
        </View>

        <Text style={[{
          position:'absolute',
          color:'green',fontSize:12,
          top:5,right:10}]}>{date}</Text>

      </TouchableOpacity>)
    }

    return (
    <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
          { conversations &&  conversations.length > 0? 

            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              keyExtractor={(item,index)=>index.toString()}
              data={conversations}
              renderItem={
                ({item,index})=>{
                  const  {dat,time} = dateFormater(item.timestamp)
                  const users = item.participants
                  const participant:{} = users.filter((i:any)=> i.user_id != userData.user_id )[0]
               
                  return(

                <ConversationRow 
                key={index}
                item ={item} 
                date = {dat}
                handleRowPress = {()=>goToScreen(item,participant)} 
                theme = {theme}
                participant = {participant} 
                time = {time} 
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
            showsVerticalScrollIndicator={false}>
            <View style={[globalstyles.columnCenter,{height:'100%',paddingTop:'50%'}]}>
                <Text style={{color:theme.text}}>You have 0 chats</Text>
            </View>
            </ScrollView>
      
            
          }

{openBottomSheetDrawer &&
      <BottomSheetDrawer
      index={openBottomSheetDrawer?1:-1}
      snapPoints={snapPoints}
      handleClose={()=>setOpenBottomSheetDrawer(false)}
      bottomSheetRef={bottomSheetRef}
      >
        <View style={{padding:20}}>
        <RenderButtonRow 
      Icon={MaterialIcons}
      icon_color="red"
      icon_name="delete"
      icon_size={24}
      action={deleteConversation}
      buttonTextStyles={{color:theme.text,fontWeight:'400',fontSize:18}}
      button_text="Delete conversation"
      buttonStyles={[globalstyles.row,{padding:20,gap:10}]}/>
        </View>
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
  )
}

export default ConversationsScreen


