import AndroidSwipeable from '@/components/AndroidSwipeable';
import ConversationRow from '@/components/Conversations';
import { IosSwipeable } from '@/components/IosSwipeable';
import { useGetResourceMutation } from '@/store/services/authApi';
import { setConvos } from '@/store/slices/messageSlice';
import { useAppDispatch } from '@/store/store';
import { globalstyles } from '@/styles/styles';
import React, { useEffect, useRef } from 'react'
import { SafeAreaView, ScrollView, View,Text, Platform } from 'react-native';
import { useSelector } from 'react-redux';


const ConversationsScreen = () => {
    const dispatch = useAppDispatch();
    const swipeableRowRef = useRef<any>(null)
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
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
        console.log(error.message)
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

            conversations.map((convo:any,index:number)=>
              <MessageParent
               key = {index}
            deleteAction ={()=>deleteConvo(convo.id)}
            archiveAction = {()=>deleteConvo(convo.id)}
            swipeableRowRef= {swipeableRowRef}
            >
                <ConversationRow 
            
                />
            </MessageParent>
            )
          
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
