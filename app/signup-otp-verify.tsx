import { TaggedInput } from '@/kazisrc/components/Inputs';
import Toast from '@/kazisrc/components/Toast';
import { usePostNoAuthMutation } from '@/kazisrc/store/services/authApi';
import { setAuthScreenIndex } from '@/kazisrc/store/slices/authSlice';
import { rendermodal, clearModal } from '@/kazisrc/store/slices/modalSlice';
import { useAppDispatch } from '@/kazisrc/store/store';
import { globalstyles } from '@/kazisrc/styles/styles';
import { validationBuilder, checkStrForPurelyNumbers } from '@/kazisrc/utils/validator';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, TouchableOpacity,Text, Pressable } from "react-native";
import { useSelector } from 'react-redux';


function OtpVerifyScreen() {
    const {theme, isNightMode} = useSelector((state:any)=>state.theme)
    type ParamsType = {
      mobile_number: string;
    };
    const params:ParamsType = useLocalSearchParams()

    const [ postData , {isError,isLoading,isSuccess,error,data}] = usePostNoAuthMutation();
    const dispatch = useAppDispatch()
    const [errors,setErrors] = useState <any>({})
    const [focused,setFocus]  = useState<string>('')

    const [otp, setOtp] = useState<string>('');

  async function verifyOTP() {
    if (!isLoading){
      try{
      const data  = [
            {
              otp:otp,
              minlength:5,
              type:"number"
             },
             params
      ]
      const validated = validationBuilder(data)
      const resp = await postData({data:validated,endpoint:'/verify-mobile-otp/'}).unwrap()
      if (resp){
        rendermodal({
          dispatch: dispatch,
          header: "Success!",
          status: "success",
          content: "OTP verification was successful!",
        })
         //  Proceed to next step
         router.push({ pathname:'/signup-account-setup', params : { otp: JSON.stringify(data[0]), mobile:params ? JSON.stringify(params):null}})
      } 
    }
    catch(error:any){

      setErrors(error)
    }}
    }

    function goBack(){
      router.back()
    }
  

  function handleNumeric(val:string,setterFunc:any){
    const clean = checkStrForPurelyNumbers(val)
      setterFunc(clean)
  }
  const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
    (state: any) => state.modal
  );

  function closeModal(){
    dispatch(clearModal())
  }

  useEffect(()=>{
    if(isError){
      console.log(error)
        rendermodal({
            dispatch: dispatch,
            header: "Error!",
            status: "error",
            content: "OTP verification failed!",
          })
    }
    },[isError])

    useEffect(()=>{
      dispatch(setAuthScreenIndex(2))
    },[])

  return (
    <SafeAreaView
    style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
    <View style={[globalstyles.column,{paddingVertical:20}]}>
      
    <Text style={{
      
      textAlign:'center',
      color:theme.text,
      textTransform:'capitalize'
    }}>
    Use the Code sent to your phone via sms
    </Text>
  
      <TaggedInput
          onChangeText={(val:any)=>handleNumeric(val,setOtp)}
          keyboardType={'numeric'}
          onBlur={()=>setFocus('')}
          onFocus={()=>setFocus('otp')}
          maxLength={6}
          taggedInputContainerStyles={{
            padding:5,
            marginVertical:35,
            borderColor:focused == 'otp'?'orange':'#888'}}
          value={otp}
          errorMessage={errors.otp ? errors.otp.message : ''}
          caption='OTP Code'
          placeholder="Enter Verification code"
        />
 
    <TouchableOpacity
        onPress={verifyOTP}
        style={[ globalstyles.columnCenter,
          {
            backgroundColor: "#b35900",
            width: "80%",
            alignSelf: "center",
            height:44
          }
        ]}
      >
        <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Verify OTP Code</Text>
    </TouchableOpacity>
    
    <Pressable 
    onPress={goBack}
    style={{width:'80%',alignSelf:'center',marginTop:22,
     borderBottomColor:theme.text,borderBottomWidth:1
    }}>
       <Text style={{
        textAlign:'center',
        color:theme.text}}>
        Resend OTP ? I didn't receive any sms.</Text>
    </Pressable>
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

export default OtpVerifyScreen

