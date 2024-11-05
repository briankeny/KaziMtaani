import { CustomUserAvatar } from '@/kazisrc/components/Headers';
import { RenderTaggedInput } from '@/kazisrc/components/Inputs';
import Toast from '@/kazisrc/components/Toast';
import { usePostFormDataMutation } from '@/kazisrc/store/services/authApi';
import { clearModal, rendermodal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useState } from 'react'
import { Pressable, SafeAreaView, TouchableOpacity, View,Image,Text } from 'react-native'
import { useSelector } from 'react-redux';

export default function CreateReviewScreen () {
    const dispatch = useAppDispatch();
    const params:any = useGlobalSearchParams()
    const {userData} = useSelector((state:any)=> state.auth)
    const {post_id} = params
    const { theme,isNightMode  } = useSelector((state: any) => state.theme);
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
    const [postData,{isLoading:postLoading} ] = usePostFormDataMutation();
 const ratingOptions= [20,40,60,80,100]

 const [rating,setRating] = useState<any>(0) 
 const [review_text,setReviewText] = useState<string>('')
 const [focused,setFocus] = useState<string>('')

 function closeModal() {
    dispatch(clearModal());
    return true;
  }

 async function submitReview() {
     if(!postLoading){
       try{  
         const submitData = 
           {
             jobpost:parseInt(post_id),
             review_text:review_text,
             rating: rating
           }
         const resp = await postData({data:submitData,endpoint:'/reviews-create/'}).unwrap()
         if(resp)
           rendermodal({
             dispatch: dispatch,
             header: "Success!",
             status: "success",
             content: "Your feedback has been received!",
           })
          router.push('/(home)/(jobapplications)/my-reviews')
       }
       catch(error){
         rendermodal({
           dispatch: dispatch,
           header: "Oops!",
           status: "warning",
           content: "We could not process your request at the moment try again later!",
         })
       }
     }
 }

  return (
    <SafeAreaView
    style={[globalstyles.safeArea, { backgroundColor: theme.background }]}
  >
           <View style={[globalstyles.card,
            {width:'90%',backgroundColor:theme.card, marginTop:10}]}>
              <View style={[globalstyles.row,{gap:10}]}>
                    { userData.profile_picture ?
                        <Image
                        style={{
                          resizeMode: "center",
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                        }}
                        source={{ uri: userData.profile_picture }}
                      />
                   :
                      <CustomUserAvatar name={userData.full_name} />
                    }
                  
                  <View style={{width:'85%', overflow:'hidden'}}>
                      <Text 
                      numberOfLines={1}
                      ellipsizeMode='tail'
                      style={{color:theme.text,fontFamily:'Poppins-Bold'}}>
                              {userData.full_name}
                      </Text>
                      <Text style={{color:theme.text}}>
                      Reviews are public and can be viewed by anyone
                      </Text>
                  </View>
              </View>
    
           <View style={[globalstyles.row,{gap:10,width:'80%',
            alignSelf:'center',
            marginVertical:15}]}>
                  { ratingOptions.map((item:any,index:number)=>
                      <Pressable 
                       key={index}
                      onPress={()=>setRating(item)}>
                          <AntDesign 
                              name={ rating >= item ? "star" : "staro"} 
                              size={24} 
                              color={  rating >= item ? "orange": theme.text}
                              />
                      </Pressable>
                  )
                  }
           </View>
    
            <View style={[globalstyles.column]}>
                  <RenderTaggedInput
                  maxLength={300}
                  onBlur={()=>setFocus('')}
                  onFocus={()=>setFocus('desc')}
                  taggedInputContainerStyles={{
                      padding:5,
                      minHeight:60,
                  borderColor:focused == 'desc'?'green':'#888'
                  }}
                  taggedInputStyles={{textAlign:'left'}}
                  value={review_text}
                  onChangeText={(val:any)=>setReviewText(val)}
                  placeholder="Describe your recruitment experience so far..."
                  captionContainerStyles={{ backgroundColor: theme.card }}
                  />
            </View>
    
            <TouchableOpacity 
           style={[globalstyles.columnCenter,{paddingVertical:4,
            backgroundColor:'green',
            marginVertical:20}]} 
            onPress={submitReview}>
                  <Text style={{color:'#fff',fontSize:18,fontWeight:'600'}}>
                      Submit Feedback
                  </Text>
            </TouchableOpacity>
    
          </View>

        
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


