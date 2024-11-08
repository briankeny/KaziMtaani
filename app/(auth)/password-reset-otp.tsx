import { TaggedInput } from "@/kazisrc/components/Inputs";
import Toast from "@/kazisrc/components/Toast";
import { usePostNoAuthMutation } from "@/kazisrc/store/services/authApi";
import { clearModal, rendermodal } from "@/kazisrc/store/slices/modalSlice";
import { useAppDispatch } from "@/kazisrc/store/store";
import { globalstyles } from "@/kazisrc/styles/styles";
import { checkStrForPurelyNumbers, validationBuilder } from "@/kazisrc/utils/validator";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView, TouchableWithoutFeedback, Keyboard, View, TouchableOpacity,Text } from "react-native";
import { useSelector } from "react-redux";


const LoginPasswordResetVerifyScreen = () => {
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams()
    const [checkCode,{isSuccess,isError,isLoading}] = usePostNoAuthMutation()
    const { theme, isNightMode } = useSelector((state: any) => state.theme);
    const {openModal,modalStatus, modalHeader, modalContent} = useSelector((state:any)=>state.modal);
    const [focus, setFocused] = useState(false);
    const [code, setCode] = useState<string>("");
    const [errors, setErrors] = useState<any>({});
    const [tries ,setTries] = useState<number>(3)

    function closeModal(){
      dispatch(clearModal())
      return true
    }
   
    async function handleCodeVerification(){
      if (!isLoading) {

      try{
        const rules =[
          {
            otp:code,
            minLength:4,
            type:'number'
          }
        ]
        const {mobile_number} = params
        const data:any = validationBuilder(rules)
        data.push({mobile_number:mobile_number})
        const resp = await checkCode({data:data, enpoint:'/password-reset/verify-code/'}).unwrap()
        if (resp)
          router.replace({ pathname:'/(auth)/password-reset-verify' , params:data})
      }
      catch(err:any){
          setErrors(err)
      }
    }
  }

    function handleNumericChange(val:any){
      const v = checkStrForPurelyNumbers(val)
      setCode(v)
    }
   

    useEffect(()=>{
      if(isError) setTries(tries-1)
    },[isError])

    useEffect(()=>{
      tries == 0 && router.replace('/(auth)')
    },[tries])
  
    return (
      <SafeAreaView
      style={[
        globalstyles.safeArea,
        { backgroundColor: theme.background }
      ]} 
    >
    <TouchableWithoutFeedback  style={globalstyles.safeArea} onPress={Keyboard.dismiss}>
      <View style={[globalstyles.card,theme && {marginVertical:90,backgroundColor:theme.card}]}>
        <View style={{ marginVertical: 40 , alignSelf:'center'}}>
       
          <View style={[{ alignSelf: "center",paddingVertical:20 }]}>
            
          <TaggedInput
          onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
        taggedInputContainerStyles={[focus && {borderColor:'green'},{marginVertical:20}]}
        placeholder={"Code ex 22X-XXX"}
        placeholderTextColor={"#888"}
        value = {code}
        keyboardType={'numeric'}
        maxLength={7}
        caption = {'Verification Code'}
        errorMessage={errors.code? errors.code : ''}
        onChangeText={(value:any) => handleNumericChange(value)}
         />
          {!isLoading &&
         
         <TouchableOpacity
         onPress={handleCodeVerification}
         style={[ globalstyles.columnCenter,
             {
             backgroundColor: "rgba(0,105,0,0.5)",
             width: "80%",
             alignSelf: "center",
             marginVertical:12,
             height:44
             }
         ]}
         >
         <Text style={[{color:'white',paddingVertical:5,textAlign:'center',fontWeight:'500'}]}>
           Verify OTP</Text>
         </TouchableOpacity>

          }

        </View>
        <Toast
          visible={openModal}
          status={modalStatus}
          onPress={()=>closeModal()}
          modalHeader={modalHeader}
          modalContent={modalContent}
        />
      </View>
      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );

}

export default LoginPasswordResetVerifyScreen;


