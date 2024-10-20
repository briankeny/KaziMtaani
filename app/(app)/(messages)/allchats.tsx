import AndroidSwipeable from '@/components/AndroidSwipeable';
import ConversationRow from '@/components/Conversations';
import { IosSwipeable } from '@/components/IosSwipeable';
import { useGetResourceMutation } from '@/store/services/authApi';
import { setConvos } from '@/store/slices/messageSlice';
import { useAppDispatch } from '@/store/store';
import { globalstyles } from '@/styles/styles';
import { dateFormater } from '@/utils/utils';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react'
import { SafeAreaView, ScrollView, View,Text, Platform } from 'react-native';
import { useSelector } from 'react-redux';


const ConversationsScreen = () => {
    const dispatch = useAppDispatch();
    const swipeableRowRef = useRef<any>(null)
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const {userData}  = useSelector((state:any)=> state.auth)
    // const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    //   (state: any) => state.modal
    // ); 
    const {conversations} = useSelector((state:any)=>state.messages) 
    const [getUserData, { data, isLoading, isError, error, isSuccess }] = useGetResourceMutation();
  
    async function fetchMessages() {
      try{
         await getUserData({endpoint:'/conversations/'})
      }
      catch(error:any){
      }
    }

    function MessageParent(){
      if (Platform.OS.startsWith('a')){
        return AndroidSwipeable
      }
      else{
        return IosSwipeable
      }
    }

    function deleteConvo(id:any){

    }

    function archiveConvo(id:any){

    }

    function goToScreen(screen:any){
      router.push(screen)
    }

    useEffect(()=>{
      fetchMessages()
    },[])
  
    useEffect(()=>{
      data? dispatch(setConvos(data.results)) : null
    },[data])

    return (
    <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        <ScrollView>
          {
            conversations ? 

            conversations.map((convo:any,index:number)=>{
              const  {dat,time} = dateFormater(convo.timestamp)
              const users = convo.participant
              const participant = users.find((item:any)=>item.user_id != userData.user_id )

                return(
              <AndroidSwipeable
               key = {index}
            deleteAction ={()=>deleteConvo(convo.id)}
            archiveAction = {()=>deleteConvo(convo.id)}
            swipeableRowRef= {swipeableRowRef}
            >
                <ConversationRow 
                  item ={convo} 
                  handleRowPress = {()=>goToScreen({params:{chatid:convo.chatid} , screen:"[chatid]"})} 
                  theme = {theme}
                  participant = {participant} 
                  time = {time} 
                />
            </AndroidSwipeable>
            )})
          
            :
            <View style={[globalstyles.columnCenter]}>
                <Text>You have 0 messages</Text>
            </View>

          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default ConversationsScreen
