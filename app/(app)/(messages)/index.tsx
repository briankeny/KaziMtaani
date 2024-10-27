import React, { useEffect, useRef } from 'react'
import { router } from 'expo-router';
import { SafeAreaView, ScrollView, View,Text,TouchableOpacity,Image } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetResourceMutation } from '@/kazisrc/store/services/authApi';
import { setConvo, setConvos } from '@/kazisrc/store/slices/messageSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { dateFormater} from '@/kazisrc/utils/utils';


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
         await getUserData({endpoint:'/chats/'})
      }
      catch(error:any){
      }
    }


    function deleteConvo(id:any){

    }

    function archiveConvo(id:any){

    }

    function goToScreen(item:any){
      dispatch(setConvo(item))
      router.push('/(app)/(messages)/conversation')
    }

    useEffect(()=>{
      fetchMessages()
    },[])
  
    useEffect(()=>{
      isSuccess && dispatch(setConvos(data.results)) 
    },[isSuccess])

    function ConversationRow({ item,handleRowPress,participant,time,date}:any){
     return(   
       <TouchableOpacity style={[
        globalstyles.rowEven,
        { paddingVertical:20,
          backgroundColor:theme.card,
          elevation:2,
          margin:1
       }]} onPress={handleRowPress}>
           
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
        <ScrollView>
          {
            conversations.length > 0? 

            conversations.map((convo:any,index:number)=>{
              const  {dat,time} = dateFormater(convo.timestamp)
              const users = convo?.participants?.length > 0 ? convo.participants : []
              const participant:{} = users.find((item:any)=>item.user_id != userData.user_id )

                return(
                <ConversationRow 
                  key={index}
                  item ={convo} 
                  date = {dat}
                  handleRowPress = {()=>goToScreen(convo)} 
                  theme = {theme}
                  participant = {participant} 
                  time = {time} 
                />
         
            )})
          
            :
            <View style={[globalstyles.columnCenter,{height:'100%'}]}>
                <Text style={{color:theme.text}}>You have 0 messages</Text>
            </View>
            

          }
        </ScrollView>
    </SafeAreaView>
  )
}

export default ConversationsScreen


