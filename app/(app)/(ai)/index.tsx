import React, { useEffect, useState } from "react";
import { MessageInput } from "@/kazisrc/components/Inputs";
import Toast from "@/kazisrc/components/Toast";
import { AiWoman } from "@/kazisrc/images/images";
import { usePostFormDataMutation } from "@/kazisrc/store/services/authApi";
import { clearModal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { pickImage, randomKeyGenerator, imageAndBodyConstructor, dateFormater, formatDate } from "@/kazisrc/utils/utils";
import { Entypo } from "@expo/vector-icons";

import { SafeAreaView, FlatList, View, Text,Image, RefreshControl, Dimensions, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { removeSpace, validationBuilder } from "@/kazisrc/utils/validator";


export default function AiConversationScreen(){
    const dispatch = useAppDispatch();
    const [askAI ,{isLoading, isError,isSuccess,error,data}] = usePostFormDataMutation()
    const { theme} = useSelector((state:any) => state.theme);
    const {userData } = useSelector((state:any)=>state.auth);
    const [aiConversation, setAiConversation] = useState <any | object>([]) 
    const [imageSelected,setImageSelected] = useState(false)
    const [image,setImage] = useState<any>(null);
    const [imageType, setImageType] = useState ('');
    const [prompt , setPrompt] = useState('');
    const  [focused, setFocus] = useState<string>('')

       // Clear Image
  function clearImage(){
    setImageSelected(false)
    setImage(null)
    setImageType('')
  }
    
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    ); 

    function closeModal() {
      dispatch(clearModal());
      return true;
    }
    
    const [refreshing, setRefreshing] = React.useState(false); 
    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }, []);
    
 
  async function openImagePicker() {
    try {
      const result = await pickImage();
      if (!result.canceled) {
        const img = result?.assets[0]?.uri ? result.assets[0].uri : ''
        if (img){
        const imgtype = img.split('cache/')[1].split('.')[1]
        setImageSelected(true);
        setImage(img);
        setImageType(imgtype)
      }
      }
    } catch (error: any) {}
  }

    

    async function promptAI(){
      if (!isLoading && prompt.trim().replace(' ','').length >1){
      try {
        const userTime = new Date()
        const rules = [{
          prompt:prompt,
          minlength:1, 
          type:'string',
        }
        ]
        const images = []
        if (imageSelected){
          const img = {
            uri: image,
            name: `${randomKeyGenerator()}.${imageType}`,
            type: `image/${imageType}`
           }
          images.push(img)
        }
       const submit = validationBuilder(rules)
       const data:any = imageAndBodyConstructor ({content:submit,images:images,uploadname:['image']})
       const resp = await askAI({data:data,endpoint:'/prompt-kaziMtaani-AI/'}).unwrap()
       if (resp){ 
        const respTime = new Date()
          const userRequest =  {
            sender: randomKeyGenerator(),
            content: prompt,
            image:null,
            timestamp: formatDate(userTime)
          }
         imageSelected ? userRequest['image']  = image : null
         const feedback = {
            sender:'ai',
            content: resp.content,
            image:null,
            timestamp: formatDate(respTime)
         }
        const data = [...aiConversation , userRequest,feedback] 
         setAiConversation(data)
       }

       setPrompt('')
       setImage(null)
       
      }
    catch(error:any){
      setPrompt('')
      setImage(null)
      const errorTime = new Date()
        const userRequest =  {
          sender: randomKeyGenerator(),
          content: prompt,
          image:null,
          timestamp: formatDate(errorTime)
        }
        imageSelected ? userRequest['image']  = image : null
        const resp = {
          sender:'ai',
          content: 'We could not generate response.',
          image:null,
          timestamp: formatDate(errorTime)
        }
        const feedback = [...aiConversation,userRequest,resp]
        setAiConversation(feedback)
    }
    }
   }

    function GreetingHeader(){
        return (
        <View style={[globalstyles.columnCenter, {width:'100%',borderRadius:0} ]}>
           <Image
           style={[{width:40,height:40, borderRadius:20,marginVertical:8}]}
          source={AiWoman}
          />
          <Text style={{ fontSize: 18, fontFamily: 'Poppins-Bold', marginBottom: 8 , color:theme.text}}>
            Hello {userData.full_name} 👋
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 16 ,color:theme.text}}>
            How can I help you ?
          </Text>
        </View>
      )
    }



    return (
    <SafeAreaView
    style={[
      globalstyles.safeArea,
      theme && { backgroundColor: theme.background },
    ]}
  >  
      <FlatList
       ListHeaderComponent={<GreetingHeader/>}
       ListFooterComponent={()=>
       <View style={[{marginTop:80}]}>
          <Text style={{color:theme.text}}></Text>
       </View>}
       showsVerticalScrollIndicator={false}
       refreshControl={
         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
       }
      data={aiConversation}
      
      renderItem={({ item, index }) => 
      {
        const {dat,time} = dateFormater(item.timestamp)
        return(
        
        <AIMessage 
        item={item} 
        key={index} 
        time={time}
        theme={theme}
        />        
     
        )
      }}
      keyExtractor={(item, index) => index.toString()}
    />

    

<MessageInput
            onFocus ={()=>setFocus('msg')}
            onBlur={()=>setFocus('')} 
            InputViewStyles={{borderColor: focused == 'msg'? 'green' : theme.color
            ,position:'absolute', bottom:10
            }}
            onChangeText = {(val)=>setPrompt(val)} 
            onSubmit = {promptAI} 
            onAttachImage = {openImagePicker} 
            value={prompt}
            placeholder ={'Ask Ai anything ...'}
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
            onPress={()=>clearImage()}
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

interface AIMessageProps {
  item:any;
  theme:any;
  time ?: string; 
}

function AIMessage({theme,item,time}:AIMessageProps){
  
    return (
      <View style={[{backgroundColor:theme.card,
        width:'70%',
         borderRadius:20,
         padding:10,
        marginHorizontal:10,
        marginVertical:5,
        alignSelf: item.sender == 'ai' ? 'flex-start'  : 'flex-end'}
      ]}>

    {item.image &&
        <View
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
          source={{uri:item.image}}
          />
        </View>
        }

      <View style={[{padding:5}]}>
        <Text
          selectable={true}
        style={{fontSize:18,color:theme.text}}>
           {item.content}
        </Text>
      </View>

      <View style={[globalstyles.columnEnd]}>
        <Text
        selectable={true}
        style={{fontSize:11,fontWeight:'400',color:'#888'}}>
            {time}
        </Text>
      </View>

    </View>
    )
}