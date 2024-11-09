import { MessageInput } from '@/kazisrc/components/Inputs';
import Toast from '@/kazisrc/components/Toast';
import { useGetResourceMutation, usePostFormDataMutation } from '@/kazisrc/store/services/authApi';
import { clearModal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { dateFormater, imageAndBodyConstructor, pickImage, randomKeyGenerator, removeSpace } from '@/kazisrc/utils/utils';
import { validationBuilder } from '@/kazisrc/utils/validator';
import { Entypo } from '@expo/vector-icons';
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { SafeAreaView,TouchableOpacity,Text, Image, View, FlatList, RefreshControl, Pressable, Dimensions } from 'react-native'
import { useSelector } from 'react-redux';


export default function ChatScreen () {
  const dispatch = useAppDispatch();
  const {conversation} = useSelector((state:any)=>state.messages)
  const {userData} = useSelector((state:any)=>state.auth)
  const params:any =  useGlobalSearchParams()
  const {chat_id} = params
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const [getData, { isLoading:getLoading,isError:existsGetError, error:getError}] = useGetResourceMutation();
  const [postData ,{isLoading,isSuccess,error,isError}] = usePostFormDataMutation();

  const [content, setContent] = useState<string|any>('')
  const [receiver , setReceiver] = useState<number|any>(null) 
  const [errors,setError] = useState<any>({})
  const [chatMessages,setChatMessages] = useState<any>([])
  const  [focused, setFocus] = useState<string>('')
 
  const [image,setImage] = useState<string | null>(null)
  const [imageSelected, setImageSelected] =useState<boolean>(false)
  const [imageType,setImageType] = useState<string|any>('png')

  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  ); 

  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  function clearMessage(){
    setContent('')
    setImage(null)
    setImageSelected(false)
    setImageType('')
    setError({})
  }

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      chat_id && fetchMessages(chat_id)
    }, 2000);
  }, []);

  function findReceiver(){
    const to = conversation.participants.filter((item:any)=> item.user_id != userData.user_id)
    to.length > 0 ? setReceiver(to[0]) : null
  }

  async function sendMessage(){
    if(!isLoading){  
      try{
        const rules =[
          {
            sender:userData.user_id,
            type:'number',
            minLenght:0
          },
          {
            receiver:receiver.user_id,
            type:'number',
            minLength:0
          },
          {
            content:content,
            type:'string',
            minLength:0
          }
        ]
        const validated:any = validationBuilder(rules)
        chat_id ? validated['conversation'] = chat_id : null
        const images = []
        if (imageSelected){
          const img = {
            uri: image,
            name: `${removeSpace(userData.full_name)}${randomKeyGenerator()}.${imageType}`,
            type: `image/${imageType}`
           }
          images.push(img)
        }
        console.log(images)
        const dataToSubmit =imageAndBodyConstructor({content:validated,images:images,uploadname:["media"]});
        const resp = await postData({data:dataToSubmit,endpoint:'/new-message/'}).unwrap()
        if(resp){
          const id = resp.conversation
          fetchMessages(id)
        }
        clearMessage()
      }
      catch(err:any){
        setError(err)
      }
    }
  }

  async function openImagePicker(){
    try {
      const result:any = await pickImage();
        if (!result.canceled) {
          const img = result?.assets[0]?.uri ? result.assets[0].uri : ''
          const imgtype =  img.split('ImagePicker/')[1].split('.')[1]
          setImageSelected(true);
          setImage(img);
          setImageType(imgtype)
        }
    } catch (err) {
    }
  } 


  function resetMediaSelection(){
    setImage(null)
    setImageSelected(false)
  }


  async function fetchMessages(chat_id:number|any) {
    try{
      const resp:any = await getData({endpoint:`/chat/${chat_id}/messages/`}).unwrap()
      if(resp) 
        setChatMessages(resp.results)
      
    }
    catch(error:any){
    }
  }


  useEffect(()=>{
    if(chat_id){
      fetchMessages(chat_id)
    }
  },[chat_id])

  useEffect(()=>{
    findReceiver()
  },[])

  function MessageComponent({message ,time,owner}:{message:any,time:string,owner:boolean}){
    return(
      <TouchableOpacity
      style={
        [ 
        {
        backgroundColor: theme.card,
        elevation:2,
        width:'45%',
        overflow:'hidden',
        padding:10,
        marginVertical:5,
        borderRadius:10,
      alignSelf: owner ? 'flex-end' : 'flex-start'},
      owner ? {marginRight:10}: {marginLeft:10}
    ]}
      >
        {message.media &&
        <TouchableOpacity
        style={{
          width:'100%',
          overflow:'hidden',
          maxHeight:300,
          borderRadius:20
        }}
        >
          <Image
          style={{
            width:'100%',
            resizeMode:'contain',
            aspectRatio:4/3
          }}
          source={{uri:message.media}}
          />
        </TouchableOpacity>
        }

        <View style={{padding:5}}>
            <Text
               selectable={true}
              style={{color:theme.text}}
              >
              {message.content} </Text>
        </View>
        

           <Text
          style={{
            fontFamily:'Poppins-Regular',
            color:'gray',
            fontSize:9,
            alignSelf:'flex-end'}}
          >
           {time} </Text>

      </TouchableOpacity>
    )
  }
  
  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        {chatMessages && chatMessages.length > 0 ?
          <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={()=>
            <View style={[{marginTop:80}]}>
               <Text style={{color:theme.text}}></Text>
            </View>}
          data={chatMessages}
          renderItem={
            ({item,index})=>{
              const {dat, time} = dateFormater(item.timestamp)
              const is_owner =  item.sender == userData.user_id ? true :false
              return(
                <MessageComponent
                owner={is_owner}
                key={index}
                message={item}
                time={time}
                />
              )
            }
          }
          />:
            <View style={[globalstyles.columnCenter,{height:'100%'}]}>
              <Text style={{color:theme.text}}>
                0 messages found
              </Text>
            </View>
          }
          
       
          <MessageInput
            onFocus ={()=>setFocus('msg')}
            onBlur={()=>setFocus('')} 
            InputViewStyles={{borderColor: focused == 'msg'? 'green' : theme.color
            ,position:'absolute', bottom:10
            }}
            onChangeText = {(val)=>setContent(val)} 
            onSubmit = {sendMessage} 
            onAttachImage = {openImagePicker} 
            value={content}
            placeholder ={'Type something ...'}
            editable = {true} 
            placeholderTextColor = '#999'
            maxLength={200} 
            theme={theme}
          >
            {
              imageSelected && image && 
               <View style={[{borderRadius:20,
               maxHeight:200 , maxWidth:Dimensions.get('window').width-150,
               overflow:'hidden'}]}>
                    <Image
                    source={{uri:image}}
                    style={{
                      width:'100%',
                      height:'100%',
                      resizeMode:'cover'
                    }}
                    />
                    <Pressable 
            onPress={()=>resetMediaSelection()}
            style={{position:'absolute',top:10,right:10}}>
                      <Entypo name="cross" size={24} color="red" />
            </Pressable>
               </View>
            }
          
          </MessageInput>
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
