import React, { useEffect } from "react";
import { clearModal, rendermodal } from "@/store/slices/modalSlice";
import { useAppDispatch, useSelector } from "@/store/store";
import { checkStrForPurelyNumbers, validationBuilder } from "@/utils/validator";
import { useState } from "react";
import { usePostNoAuthMutation } from "@/store/services/authApi";
import { router } from "expo-router";
import { globalstyles } from "@/styles/styles";
import { View, TextInput,Text, TouchableOpacity, SafeAreaView } from "react-native";
import Toast from "@/components/Toast";

export default function NumberVerification() {
    const {theme, isNightMode} = useSelector((state:any)=>state.theme)
    const [ postData , {isError,isLoading,isSuccess,error,data}] = usePostNoAuthMutation();
    const dispatch = useAppDispatch()
    const [errors,setErrors] = useState <any>({})
    const [focused,setFocus]  = useState<string>('')
    const { openModal, modalStatus, modalHeader, modalContent } = useSelector(
      (state: any) => state.modal
    );
  

    const [mobile_number, setMobileNo] = useState<string>('');
 
  // Toggle Modal
  function closeModal() {
    dispatch(clearModal());
    return true;
  }

  async function sendPhoneOTP() {
    if (!isLoading){
    try{
      const submitData = [{
        mobile_number: mobile_number,
        minlength:8,
        type:'phonenumber'
        }]
     
      const validated = validationBuilder(submitData) 
      const resp = await postData({data:validated,endpoint:'/mobile-otp/'}).unwrap()
      if (resp){
         //  Create a notification
        rendermodal({
          dispatch: dispatch,
          header: "Success",
          status: "success",
          content: `OTP verification code has been sent to +254${mobile_number}!`,
        })
         //  Proceed to next step
         router.push({pathname:'/signup-otp-verify',params:submitData[0]})
      } 
   
    }
    catch(error:any){
 
      setErrors(error)
    }
    }
  }

    function handleNumeric(val:string,setterFunc:any){
    const clean = checkStrForPurelyNumbers(val)
      setterFunc(clean)
  }

    useEffect(()=>{
    if(isError){
      rendermodal({
        dispatch: dispatch,
        header: "Error!",
        status: "error",
        content: `Failed to send One Time Password (OTP) to  +254${mobile_number}.`,
      })
    }
    },[isError])

      
    return(
      <SafeAreaView
      style={[globalstyles.safeArea,{ backgroundColor: theme.background }]}>
        <View style={[globalstyles.column,{paddingVertical:20}]}>
        <Text
        style={{color:theme.text,textAlign:'center'}}
        > 
          ** Use a working phone number
        </Text>
      <View style={[globalstyles.row,{width:'80%',marginVertical:30,
      gap:10,alignSelf:'center'}]}>
  
           <View style={[
            globalstyles.columnCenter,
            {width:70,height:44,
            borderRadius:10,
            borderWidth:1,borderColor:'#888'}]}>
                <Text style={[{color:theme.text,fontWeight:'500'}]}>
                  🇰🇪 {''} +254
                </Text>
           </View>
           
      
          <View>
          <TextInput
            keyboardType={'numeric'}
            onChangeText={(val) => handleNumeric(val,setMobileNo)}
            maxLength={11}
            onBlur={()=>setFocus('')}
            onFocus={()=>setFocus('mobile')}
            style={{
              padding:5,
              borderColor: focused == 'mobile' ? "#b35900":theme.text,
              color:theme.text,
              borderBottomWidth:1,
              width:190}}
            value={mobile_number}
            placeholderTextColor={'#888'}
            placeholder="Phone Number" 
          />
            {errors.mobile_number &&
            <Text style={[globalstyles.error]}>{errors.mobile_number ? 'Mobile number is incorrect' :''  }</Text>}
        </View>
      
      </View>
    
      <TouchableOpacity
          onPress={sendPhoneOTP}
          style={[ globalstyles.columnCenter,
            {
              backgroundColor: "#b35900",
              width: "80%",
              alignSelf: "center",
              height:44
            }
          ]}
        >
          <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>Send OTP</Text>
      </TouchableOpacity>

     <View style={[{width:'80%',
      marginTop:20,alignSelf:'center'}]}>
      <Text
        style={{
          fontSize:10,
          lineHeight:15,
          color:theme.text,textAlign:'center'}}
        > 
        Sms with a verification code will be sent to your  handset.{'\n'}
        Please use the code to verify your identity in the next step
        </Text>
      </View>

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