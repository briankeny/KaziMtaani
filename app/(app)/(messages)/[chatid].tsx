import { useGetResourceMutation, usePostFormDataMutation } from '@/kazisrc/store/services/authApi';
import { setMessages } from '@/kazisrc/store/slices/messageSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { pickImage, randomKeyGenerator } from '@/kazisrc/utils/utils';
import { validationBuilder } from '@/kazisrc/utils/validator';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity,Text } from 'react-native'
import { useSelector } from 'react-redux';


export function ChatScreen () {
  const dispatch = useAppDispatch();
  const {conversation,messages} = useSelector((state:any)=>state.messages)
  const {userData} = useSelector((state:any)=>state.auth)
  const {chat_id} = conversation
  const { theme, isNightMode } = useSelector((state: any) => state.theme);
  const [getData, { isLoading:getLoading,isError:existsGetError, error:getError}] = useGetResourceMutation();
  const [postData ,{isLoading,isSuccess,error,isError}] = usePostFormDataMutation();

  const [content, setContent] = useState<string|any>('')
  const [receiver , setReceiver] = useState<number|any>(null)
  const [errors,setError] = useState<any>({})
 
  const [image,setImage] = useState<string | null>(null)
  const [imageSelected, setImageSelected] =useState<boolean>(false)
  const [imageType,setImageType] = useState<string|any>('png')

  function findReceiver(){
    const to =  conversation?.participants ? conversation.participants.find((item:any)=>item != userData.user_id) : {}
    setReceiver(to)
  }


  function filterMessages(id:number |any){
    const data = messages.filter((item:any)=> item.chat_id == id)
    return data
  }

  async function sendMessage(){
    if(isLoading){  
      try{
        const rules =[
          {
            sender:userData.user_id,
            type:'number',
            minLenght:0
          },
          {
            conversation:chat_id,
            type :'number',
            minLength:0
          },
          {
            receiver:receiver,
            type:'number',
            minLength:0
          },
          {
            content:content,
            type:'string',
            minLength:0
          }
        ]
        const validated = validationBuilder(rules)
        const images = []
        if (imageSelected){
          const img = {
            uri: image,
            name: `${userData.first_name}${userData.last_name}${randomKeyGenerator()}.${imageType}`,
            type: `image/${imageType}`
           }
          images.push(img)
        }
  
        const resp = await postData({data:validated,endpoint:'/messages/'}).unwrap()
        if(resp){
          setMessages([...messages,])
        }
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
          const img = result[0].results
          const typeimg = img.split('.')[1]

          setImageType(typeimg)
          setImage(img)
          setImageSelected(true)

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
      const resp:any = await getData({endpoint:`/chat/${chat_id}/messages/`})
      if(resp) {
        const arr =  [...messages, ...resp.results];
        setMessages( [...new Set(arr)])
      }
    }
    catch(error:any){
    }
  }

  useEffect(()=>{
    chat_id && fetchMessages(chat_id)
  },[chat_id])

  useEffect(()=>{
    chat_id &&  filterMessages(chat_id)
  },[chat_id])

  useEffect(()=>{
    findReceiver()
  },[])

  function MessageComponent(message:any){
    return(
      <TouchableOpacity
      style={
        [message?.sender?.user_id ===  userData.user_id &&{alignSelf:'flex-end'},
        {
        backgroundColor: theme.card,
        elevation:2,
        width:'45%',
        padding:23,
        margin:1,
        borderRadius:10
      }]}
      >
          <Text
          style={{color:theme.text}}
          >
           {message.content} </Text>
      </TouchableOpacity>
    )
  }
  

  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        <ScrollView>

          {messages.map((item:any,index:number)=>

            <TouchableOpacity
            key={index}
            style={
              [ item.from === 'Brian'&&{alignSelf:'flex-end'},
              {
              backgroundColor: 'red',
              width:'45%',
              padding:23,
              margin:1,
              borderRadius:10
            }]}
            >
                <Text
                style={{color:theme.text}}
                >
                  Hello Iam sender</Text>
            </TouchableOpacity>
        )
          
          }
        </ScrollView>
      </SafeAreaView>
  )
}
