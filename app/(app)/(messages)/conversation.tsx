import { MessageInput } from '@/kazisrc/components/Inputs';
import { useGetResourceMutation, usePostFormDataMutation } from '@/kazisrc/store/services/authApi';
import { setMessages } from '@/kazisrc/store/slices/messageSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { dateFormater, imageAndBodyConstructor, pickImage, randomKeyGenerator, removeSpace } from '@/kazisrc/utils/utils';
import { validationBuilder } from '@/kazisrc/utils/validator';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity,Text, Image, View } from 'react-native'
import { useSelector } from 'react-redux';


export default function ChatScreen () {
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
  const  [focused, setFocus] = useState<string>('')
 
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
            name: `${removeSpace(userData.full_name)}${randomKeyGenerator()}.${imageType}`,
            type: `image/${imageType}`
           }
          images.push(img)
        }
        const dataToSubmit =imageAndBodyConstructor({content:validated,images:images,uploadname:["media"]});
        const resp = await postData({data:dataToSubmit,endpoint:'/messages/'}).unwrap()
        if(resp){
          const uploaded = resp?.data ? resp.data : validated 
          const latest = [...messages,resp.data]
          dispatch(setMessages([...messages,validated]))
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
        dispatch(setMessages( [...new Set(arr)]))
      }
    }
    catch(error:any){
    }
  }



  useEffect(()=>{
    if(chat_id){
      fetchMessages(chat_id)
      filterMessages(chat_id)
    }
  },[chat_id])

  useEffect(()=>{
    findReceiver()
  },[])

  function MessageComponent({message ,time}:{message:any,time:string}){
    return(
      <TouchableOpacity
      style={
        [message?.sender?.user_id ===  userData.user_id &&{alignSelf:'flex-end'},
        {
        backgroundColor: theme.card,
        elevation:2,
        width:'45%',
        padding:10,
        margin:1,
        borderRadius:10
      }]}
      >
        {message.image &&
        <TouchableOpacity
        style={{
          width:'100%',
          height:'100%'
        }}
        >
          <Image
          style={{
            width:'100%',
            aspectRatio:2/3
          }}
          source={{uri:message.image}}
          />
        </TouchableOpacity>
        }

        <View style={{padding:5}}>
            <Text
              style={{color:theme.text}}
              >
              {message.content} </Text>
        </View>
        

           <Text
          style={{
            fontFamily:'Poppins-Regular',
            color:theme.text,
            alignSelf:'flex-end'}}
          >
           {time} </Text>

      </TouchableOpacity>
    )
  }
  

  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        <ScrollView>
          
          { messages &&
            messages.length > 0 ? 
            messages.map((item:any,index:number)=>{
              const {dat, time} = dateFormater(item.timestamp)
              return(
                <MessageComponent
                key={index}
                message={item}
                time=''
                />
              )
            }
            )
            :
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
          />
        </ScrollView>
      </SafeAreaView>
  )
}
